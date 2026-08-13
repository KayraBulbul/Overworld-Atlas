package handlers

import (
	"encoding/json"
	"errors"
	"io"
	"log/slog"
	"math"
	"net/http"
	"net/http/httptest"
	"regexp"
	"strconv"
	"testing"
	"time"

	database "github.com/KayraBulbul/Goon-Squad-SMP/api/internal/database/generated"
	"github.com/jackc/pgx/v5"
	"github.com/pashagolub/pgxmock/v4"
)

const (
	getPageOfPlayersSQL = `SELECT player_id, minecraft_id, username, created_at, updated_at
FROM players
ORDER BY username ASC
LIMIT $1 OFFSET $2`
	getPlayerCountSQL = `SELECT COUNT(*)
FROM players`
	getPlayerByUsernameSQL = `SELECT player_id, minecraft_id, username, created_at, updated_at
FROM players
WHERE username = $1`
)

type playersPageResponse struct {
	Players []struct {
		MinecraftID string `json:"minecraft_id"`
		Username    string `json:"username"`
	} `json:"players"`
	PageNum    uint32 `json:"page"`
	PageSize   uint32 `json:"page_size"`
	TotalItems uint32 `json:"total_items"`
	TotalPages uint32 `json:"total_pages"`
	Previous   bool   `json:"has_previous"`
	Next       bool   `json:"has_next"`
}

type handlerErrorResponse struct {
	Error struct {
		Code    string `json:"code"`
		Message string `json:"message"`
	} `json:"error"`
}

func newPlayerHandlerTestDouble(t *testing.T) (*PlayerHandler, pgxmock.PgxPoolIface) {
	t.Helper()

	db, err := pgxmock.NewPool()
	if err != nil {
		t.Fatalf("create pgx mock: %v", err)
	}

	t.Cleanup(func() {
		if err := db.ExpectationsWereMet(); err != nil {
			t.Errorf("unmet database expectations: %v", err)
		}
	})

	logger := slog.New(slog.NewTextHandler(io.Discard, nil))
	return NewPlayerHandler(database.New(db), logger), db
}

func expectPlayerPage(
	db pgxmock.PgxPoolIface,
	limit int32,
	offset int32,
	rows *pgxmock.Rows,
) {
	db.ExpectQuery(regexp.QuoteMeta(getPageOfPlayersSQL)).
		WithArgs(limit, offset).
		WillReturnRows(rows).
		RowsWillBeClosed()
}

func expectPlayerCount(db pgxmock.PgxPoolIface, count int64) {
	db.ExpectQuery(regexp.QuoteMeta(getPlayerCountSQL)).
		WillReturnRows(pgxmock.NewRows([]string{"count"}).AddRow(count))
}

func decodePlayersPageResponse(t *testing.T, recorder *httptest.ResponseRecorder) playersPageResponse {
	t.Helper()

	var body playersPageResponse
	if err := json.NewDecoder(recorder.Body).Decode(&body); err != nil {
		t.Fatalf("decode response: %v", err)
	}
	return body
}

func decodeHandlerError(t *testing.T, recorder *httptest.ResponseRecorder) handlerErrorResponse {
	t.Helper()

	var body handlerErrorResponse
	if err := json.NewDecoder(recorder.Body).Decode(&body); err != nil {
		t.Fatalf("decode error response: %v", err)
	}
	return body
}

func TestGetPlayersPageHandlerUsesPaginationDefaults(t *testing.T) {
	handler, db := newPlayerHandlerTestDouble(t)
	now := time.Date(2026, time.August, 13, 12, 0, 0, 0, time.UTC)

	rows := pgxmock.NewRows([]string{
		"player_id",
		"minecraft_id",
		"username",
		"created_at",
		"updated_at",
	}).AddRow(
		"11111111-1111-1111-1111-111111111111",
		"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
		"MagicGN",
		now,
		now,
	)
	expectPlayerPage(db, 12, 0, rows)
	expectPlayerCount(db, 25)

	request := httptest.NewRequest(http.MethodGet, "/api/v1/players", nil)
	recorder := httptest.NewRecorder()
	handler.GetPlayersPageHandler(recorder, request)

	if recorder.Code != http.StatusOK {
		t.Fatalf("status code = %d, want %d", recorder.Code, http.StatusOK)
	}
	if got := recorder.Header().Get("Content-Type"); got != "application/json" {
		t.Fatalf("Content-Type = %q, want application/json", got)
	}

	body := decodePlayersPageResponse(t, recorder)
	if len(body.Players) != 1 {
		t.Fatalf("len(players) = %d, want 1", len(body.Players))
	}
	if body.Players[0].MinecraftID != "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa" {
		t.Errorf("minecraft_id = %q, want expected UUID", body.Players[0].MinecraftID)
	}
	if body.Players[0].Username != "MagicGN" {
		t.Errorf("username = %q, want MagicGN", body.Players[0].Username)
	}
	if body.PageNum != 1 {
		t.Errorf("page = %d, want 1", body.PageNum)
	}
	if body.PageSize != 12 {
		t.Errorf("page_size = %d, want 12", body.PageSize)
	}
	if body.TotalItems != 25 {
		t.Errorf("total_items = %d, want 25", body.TotalItems)
	}
	if body.TotalPages != 3 {
		t.Errorf("total_pages = %d, want 3", body.TotalPages)
	}
	if body.Previous {
		t.Error("previous = true, want false")
	}
	if !body.Next {
		t.Error("next = false, want true")
	}
}

func TestGetPlayersPageHandlerUsesRequestedPageAndSize(t *testing.T) {
	handler, db := newPlayerHandlerTestDouble(t)

	expectPlayerPage(
		db,
		10,
		20,
		pgxmock.NewRows([]string{
			"player_id",
			"minecraft_id",
			"username",
			"created_at",
			"updated_at",
		}),
	)
	expectPlayerCount(db, 25)

	request := httptest.NewRequest(
		http.MethodGet,
		"/api/v1/players?page=3&page_size=10",
		nil,
	)
	recorder := httptest.NewRecorder()
	handler.GetPlayersPageHandler(recorder, request)

	if recorder.Code != http.StatusOK {
		t.Fatalf("status code = %d, want %d", recorder.Code, http.StatusOK)
	}

	body := decodePlayersPageResponse(t, recorder)
	if body.PageNum != 3 {
		t.Errorf("page = %d, want 3", body.PageNum)
	}
	if body.PageSize != 10 {
		t.Errorf("page_size = %d, want 10", body.PageSize)
	}
	if body.TotalPages != 3 {
		t.Errorf("total_pages = %d, want 3", body.TotalPages)
	}
	if !body.Previous {
		t.Error("previous = false, want true")
	}
	if body.Next {
		t.Error("next = true, want false")
	}
}

func TestGetPlayersPageHandlerReturnsSuccessfulEmptyPage(t *testing.T) {
	handler, db := newPlayerHandlerTestDouble(t)

	expectPlayerPage(
		db,
		12,
		0,
		pgxmock.NewRows([]string{
			"player_id",
			"minecraft_id",
			"username",
			"created_at",
			"updated_at",
		}),
	)
	expectPlayerCount(db, 0)

	request := httptest.NewRequest(http.MethodGet, "/api/v1/players", nil)
	recorder := httptest.NewRecorder()
	handler.GetPlayersPageHandler(recorder, request)

	if recorder.Code != http.StatusOK {
		t.Fatalf("status code = %d, want %d", recorder.Code, http.StatusOK)
	}

	body := decodePlayersPageResponse(t, recorder)
	if body.Players == nil {
		t.Fatal("players = null, want []")
	}
	if len(body.Players) != 0 {
		t.Fatalf("len(players) = %d, want 0", len(body.Players))
	}
	if body.PageNum != 1 || body.TotalItems != 0 || body.TotalPages != 0 {
		t.Errorf(
			"pagination = {page:%d total_items:%d total_pages:%d}, want {page:1 total_items:0 total_pages:0}",
			body.PageNum,
			body.TotalItems,
			body.TotalPages,
		)
	}
	if body.Previous || body.Next {
		t.Errorf("previous/next = %t/%t, want false/false", body.Previous, body.Next)
	}
}

func TestGetPlayersPageHandlerAllowsPageBeyondCurrentResults(t *testing.T) {
	handler, db := newPlayerHandlerTestDouble(t)

	expectPlayerPage(
		db,
		12,
		36,
		pgxmock.NewRows([]string{
			"player_id",
			"minecraft_id",
			"username",
			"created_at",
			"updated_at",
		}),
	)
	expectPlayerCount(db, 25)

	request := httptest.NewRequest(http.MethodGet, "/api/v1/players?page=4", nil)
	recorder := httptest.NewRecorder()
	handler.GetPlayersPageHandler(recorder, request)

	if recorder.Code != http.StatusOK {
		t.Fatalf("status code = %d, want %d", recorder.Code, http.StatusOK)
	}

	body := decodePlayersPageResponse(t, recorder)
	if body.Players == nil || len(body.Players) != 0 {
		t.Fatalf("players = %#v, want a non-nil empty list", body.Players)
	}
	if body.PageNum != 4 || body.TotalPages != 3 {
		t.Errorf("page/total_pages = %d/%d, want 4/3", body.PageNum, body.TotalPages)
	}
	if !body.Previous || body.Next {
		t.Errorf("previous/next = %t/%t, want true/false", body.Previous, body.Next)
	}
}

func TestGetPlayersPageHandlerRejectsInvalidPagination(t *testing.T) {
	tests := []struct {
		name    string
		target  string
		message string
	}{
		{
			name:    "empty page size",
			target:  "/api/v1/players?page_size=",
			message: "page_size must be an integer",
		},
		{
			name:    "non-integer page size",
			target:  "/api/v1/players?page_size=twelve",
			message: "page_size must be an integer",
		},
		{
			name:    "zero page size",
			target:  "/api/v1/players?page_size=0",
			message: "page size must be at least 1",
		},
		{
			name:    "negative page size",
			target:  "/api/v1/players?page_size=-1",
			message: "page size must be at least 1",
		},
		{
			name:    "excessive page size",
			target:  "/api/v1/players?page_size=51",
			message: "page size is too large (must be 50 or less)",
		},
		{
			name:    "empty page",
			target:  "/api/v1/players?page=",
			message: "page must be an integer",
		},
		{
			name:    "non-integer page",
			target:  "/api/v1/players?page=first",
			message: "page must be an integer",
		},
		{
			name:    "zero page",
			target:  "/api/v1/players?page=0",
			message: "page must be at least 1",
		},
		{
			name:    "negative page",
			target:  "/api/v1/players?page=-1",
			message: "page must be at least 1",
		},
		{
			name:    "page creates excessive offset",
			target:  "/api/v1/players?page=" + strconv.FormatInt(int64(math.MaxInt32/12)+2, 10),
			message: "page is too large",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			handler, _ := newPlayerHandlerTestDouble(t)

			request := httptest.NewRequest(http.MethodGet, tt.target, nil)
			recorder := httptest.NewRecorder()
			handler.GetPlayersPageHandler(recorder, request)

			if recorder.Code != http.StatusBadRequest {
				t.Fatalf("status code = %d, want %d", recorder.Code, http.StatusBadRequest)
			}

			body := decodeHandlerError(t, recorder)
			if body.Error.Code != "validation_error" {
				t.Errorf("error.code = %q, want validation_error", body.Error.Code)
			}
			if body.Error.Message != tt.message {
				t.Errorf("error.message = %q, want %q", body.Error.Message, tt.message)
			}
		})
	}
}

func TestGetPlayersPageHandlerHandlesPlayerQueryFailure(t *testing.T) {
	handler, db := newPlayerHandlerTestDouble(t)

	db.ExpectQuery(regexp.QuoteMeta(getPageOfPlayersSQL)).
		WithArgs(int32(12), int32(0)).
		WillReturnError(errors.New("database unavailable"))

	request := httptest.NewRequest(http.MethodGet, "/api/v1/players", nil)
	recorder := httptest.NewRecorder()
	handler.GetPlayersPageHandler(recorder, request)

	if recorder.Code != http.StatusInternalServerError {
		t.Fatalf("status code = %d, want %d", recorder.Code, http.StatusInternalServerError)
	}

	body := decodeHandlerError(t, recorder)
	if body.Error.Code != "database_error" {
		t.Errorf("error.code = %q, want database_error", body.Error.Code)
	}
	if body.Error.Message != "error getting player page" {
		t.Errorf("error.message = %q, want generic database message", body.Error.Message)
	}
}

func TestGetPlayersPageHandlerHandlesCountQueryFailure(t *testing.T) {
	handler, db := newPlayerHandlerTestDouble(t)

	expectPlayerPage(
		db,
		12,
		0,
		pgxmock.NewRows([]string{
			"player_id",
			"minecraft_id",
			"username",
			"created_at",
			"updated_at",
		}),
	)
	db.ExpectQuery(regexp.QuoteMeta(getPlayerCountSQL)).
		WillReturnError(errors.New("database unavailable"))

	request := httptest.NewRequest(http.MethodGet, "/api/v1/players", nil)
	recorder := httptest.NewRecorder()
	handler.GetPlayersPageHandler(recorder, request)

	if recorder.Code != http.StatusInternalServerError {
		t.Fatalf("status code = %d, want %d", recorder.Code, http.StatusInternalServerError)
	}

	body := decodeHandlerError(t, recorder)
	if body.Error.Code != "database_error" {
		t.Errorf("error.code = %q, want database_error", body.Error.Code)
	}
	if body.Error.Message != "error getting player count" {
		t.Errorf("error.message = %q, want generic database message", body.Error.Message)
	}
}

func TestGetPlayerByUsernameHandlerReturnsPlayer(t *testing.T) {
	handler, db := newPlayerHandlerTestDouble(t)
	now := time.Date(2026, time.August, 13, 12, 0, 0, 0, time.UTC)

	db.ExpectQuery(regexp.QuoteMeta(getPlayerByUsernameSQL)).
		WithArgs("magicgn").
		WillReturnRows(pgxmock.NewRows([]string{
			"player_id",
			"minecraft_id",
			"username",
			"created_at",
			"updated_at",
		}).AddRow(
			"11111111-1111-1111-1111-111111111111",
			"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
			"MagicGN",
			now,
			now,
		))

	request := httptest.NewRequest(http.MethodGet, "/api/v1/players/magicgn", nil)
	request.SetPathValue("username", "magicgn")
	recorder := httptest.NewRecorder()
	handler.GetPlayerByUsernameHandler(recorder, request)

	if recorder.Code != http.StatusOK {
		t.Fatalf("status code = %d, want %d", recorder.Code, http.StatusOK)
	}
	if got := recorder.Header().Get("Content-Type"); got != "application/json" {
		t.Fatalf("Content-Type = %q, want application/json", got)
	}

	var body struct {
		MinecraftID string `json:"minecraft_id"`
		Username    string `json:"username"`
	}
	if err := json.NewDecoder(recorder.Body).Decode(&body); err != nil {
		t.Fatalf("decode response: %v", err)
	}
	if body.MinecraftID != "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa" {
		t.Errorf("minecraft_id = %q, want expected UUID", body.MinecraftID)
	}
	if body.Username != "MagicGN" {
		t.Errorf("username = %q, want case-preserved MagicGN", body.Username)
	}
}

func TestGetPlayerByUsernameHandlerReturnsNotFound(t *testing.T) {
	tests := []struct {
		name     string
		username string
	}{
		{name: "well-formed unknown username", username: "MissingPlayer"},
		{name: "malformed username", username: "invalid username!"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			handler, db := newPlayerHandlerTestDouble(t)

			db.ExpectQuery(regexp.QuoteMeta(getPlayerByUsernameSQL)).
				WithArgs(tt.username).
				WillReturnError(pgx.ErrNoRows)

			request := httptest.NewRequest(http.MethodGet, "/api/v1/players/unknown", nil)
			request.SetPathValue("username", tt.username)
			recorder := httptest.NewRecorder()
			handler.GetPlayerByUsernameHandler(recorder, request)

			if recorder.Code != http.StatusNotFound {
				t.Fatalf("status code = %d, want %d", recorder.Code, http.StatusNotFound)
			}

			body := decodeHandlerError(t, recorder)
			if body.Error.Code != "player_not_found" {
				t.Errorf("error.code = %q, want player_not_found", body.Error.Code)
			}
			if body.Error.Message != "player not found" {
				t.Errorf("error.message = %q, want player not found", body.Error.Message)
			}
		})
	}
}

func TestGetPlayerByUsernameHandlerHandlesDatabaseFailure(t *testing.T) {
	handler, db := newPlayerHandlerTestDouble(t)

	db.ExpectQuery(regexp.QuoteMeta(getPlayerByUsernameSQL)).
		WithArgs("MagicGN").
		WillReturnError(errors.New("database unavailable"))

	request := httptest.NewRequest(http.MethodGet, "/api/v1/players/MagicGN", nil)
	request.SetPathValue("username", "MagicGN")
	recorder := httptest.NewRecorder()
	handler.GetPlayerByUsernameHandler(recorder, request)

	if recorder.Code != http.StatusInternalServerError {
		t.Fatalf("status code = %d, want %d", recorder.Code, http.StatusInternalServerError)
	}

	body := decodeHandlerError(t, recorder)
	if body.Error.Code != "database_error" {
		t.Errorf("error.code = %q, want database_error", body.Error.Code)
	}
	if body.Error.Message != "error getting player from database" {
		t.Errorf("error.message = %q, want generic database message", body.Error.Message)
	}
}
