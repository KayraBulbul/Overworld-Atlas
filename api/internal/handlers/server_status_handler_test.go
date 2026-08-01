package handlers

import (
	"context"
	"encoding/json"
	"errors"
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/KayraBulbul/Goon-Squad-SMP/api/internal/minecraft"
)

func TestServerStatusHandlerReturnsOfflineStatus(t *testing.T) {
	query := func(ctx context.Context, address string) (minecraft.Status, error) {
		return minecraft.Status{
			State:     minecraft.StateOffline,
			CheckedAt: time.Now().UTC(),
		}, nil
	}

	cache := minecraft.NewCache(time.Minute, query)
	handler := ServerStatusHandler(
		cache,
		"localhost:25565",
		slog.New(slog.NewTextHandler(io.Discard, nil)),
	)

	request := httptest.NewRequest(http.MethodGet, "/api/v1/server/status", nil)
	recorder := httptest.NewRecorder()

	handler.ServeHTTP(recorder, request)

	if recorder.Code != http.StatusOK {
		t.Fatalf("status code = %d, want %d", recorder.Code, http.StatusOK)
	}

	var body struct {
		State         minecraft.State `json:"state"`
		OnlinePlayers *int            `json:"online_players"`
		Version       *string         `json:"version"`
	}

	if err := json.NewDecoder(recorder.Body).Decode(&body); err != nil {
		t.Fatalf("decode response: %v", err)
	}

	if body.State != minecraft.StateOffline {
		t.Fatalf("state = %v, want %v", body.State, minecraft.StateOffline)
	}

	if body.OnlinePlayers != nil {
		t.Fatalf("online_players = %v, want nil", body.OnlinePlayers)
	}

	if body.Version != nil {
		t.Fatalf("version = %v, want nil", body.Version)
	}
}

func TestServerStatusHandlerReturnsUnavailableStatus(t *testing.T) {
	query := func(ctx context.Context, address string) (minecraft.Status, error) {
		return minecraft.Status{
			State:     minecraft.StateUnavailable,
			CheckedAt: time.Now().UTC(),
		}, nil
	}

	cache := minecraft.NewCache(time.Minute, query)
	handler := ServerStatusHandler(
		cache,
		"localhost:25565",
		slog.New(slog.NewTextHandler(io.Discard, nil)),
	)

	request := httptest.NewRequest(http.MethodGet, "/api/v1/server/status", nil)
	recorder := httptest.NewRecorder()

	handler.ServeHTTP(recorder, request)

	if recorder.Code != http.StatusOK {
		t.Fatalf("status code = %d, want %d", recorder.Code, http.StatusOK)
	}

	var body struct {
		State         minecraft.State `json:"state"`
		OnlinePlayers *int            `json:"online_players"`
		Version       *string         `json:"version"`
	}

	if err := json.NewDecoder(recorder.Body).Decode(&body); err != nil {
		t.Fatalf("decode response: %v", err)
	}

	if body.State != minecraft.StateUnavailable {
		t.Fatalf("state = %v, want %v", body.State, minecraft.StateUnavailable)
	}

	if body.OnlinePlayers != nil {
		t.Fatalf("online_players = %v, want nil", body.OnlinePlayers)
	}

	if body.Version != nil {
		t.Fatalf("version = %v, want nil", body.Version)
	}
}

func TestServerStatusHandlerReturnsOnlineResponse(t *testing.T) {
	online := 2
	maxPlayers := 20
	sampleAvailable := true
	version := "1.21"
	protocol := 767
	checkedAt := time.Date(
		2026,
		time.August,
		1,
		3,
		0,
		0,
		0,
		time.UTC,
	)

	query := func(
		ctx context.Context,
		address string,
	) (minecraft.Status, error) {
		return minecraft.Status{
			State:                 minecraft.StateOnline,
			OnlinePlayers:         &online,
			MaxPlayers:            &maxPlayers,
			PlayerSampleAvailable: &sampleAvailable,
			Players: []minecraft.Player{
				{
					Username: "MagicGN",
					UUID:     "uuid-one",
				},
			},
			Version:         &version,
			ProtocolVersion: &protocol,
			CheckedAt:       checkedAt,
			Stale:           false,
		}, nil
	}

	cache := minecraft.NewCache(time.Minute, query)
	logger := slog.New(slog.NewTextHandler(io.Discard, nil))
	handler := ServerStatusHandler(cache, "localhost:25565", logger)

	request := httptest.NewRequest(
		http.MethodGet,
		"/api/v1/server/status",
		nil,
	)
	recorder := httptest.NewRecorder()

	handler.ServeHTTP(recorder, request)

	if recorder.Code != http.StatusOK {
		t.Fatalf(
			"status code = %d, want %d",
			recorder.Code,
			http.StatusOK,
		)
	}

	var body struct {
		State                 minecraft.State    `json:"state"`
		OnlinePlayers         *int               `json:"online_players"`
		MaxPlayers            *int               `json:"max_players"`
		PlayerSampleAvailable *bool              `json:"player_sample_available"`
		Players               []minecraft.Player `json:"players"`
		Version               *string            `json:"version"`
		ProtocolVersion       *int               `json:"protocol_version"`
		CheckedAt             time.Time          `json:"checked_at"`
		Stale                 bool               `json:"stale"`
	}

	if err := json.NewDecoder(recorder.Body).Decode(&body); err != nil {
		t.Fatalf("decode response: %v", err)
	}

	if body.State != minecraft.StateOnline {
		t.Fatalf(
			"state = %v, want %v",
			body.State,
			minecraft.StateOnline,
		)
	}

	if body.OnlinePlayers == nil || *body.OnlinePlayers != 2 {
		t.Fatalf(
			"online_players = %v, want pointer to 2",
			body.OnlinePlayers,
		)
	}

	if len(body.Players) != 1 {
		t.Fatalf("len(players) = %d, want 1", len(body.Players))
	}

	if body.Players[0].Username != "MagicGN" {
		t.Fatalf(
			"players[0].username = %q, want MagicGN",
			body.Players[0].Username,
		)
	}

	if !body.CheckedAt.Equal(checkedAt) {
		t.Fatalf(
			"checked_at = %v, want %v",
			body.CheckedAt,
			checkedAt,
		)
	}
}

func TestServerStatusHandlerUsesPlayerJSONFieldNames(t *testing.T) {
	online := 1
	maxPlayers := 20
	sampleAvailable := true
	version := "1.21"
	protocol := 767

	query := func(
		ctx context.Context,
		address string,
	) (minecraft.Status, error) {
		return minecraft.Status{
			State:                 minecraft.StateOnline,
			OnlinePlayers:         &online,
			MaxPlayers:            &maxPlayers,
			PlayerSampleAvailable: &sampleAvailable,
			Players: []minecraft.Player{
				{
					Username: "MagicGN",
					UUID:     "uuid-one",
				},
			},
			Version:         &version,
			ProtocolVersion: &protocol,
			CheckedAt:       time.Now().UTC(),
		}, nil
	}

	cache := minecraft.NewCache(time.Minute, query)
	logger := slog.New(slog.NewTextHandler(io.Discard, nil))
	handler := ServerStatusHandler(cache, "localhost:25565", logger)

	recorder := httptest.NewRecorder()
	request := httptest.NewRequest(
		http.MethodGet,
		"/api/v1/server/status",
		nil,
	)

	handler.ServeHTTP(recorder, request)

	body := recorder.Body.String()

	if !strings.Contains(body, `"username":"MagicGN"`) {
		t.Fatalf("response does not contain lowercase username: %s", body)
	}

	if !strings.Contains(body, `"uuid":"uuid-one"`) {
		t.Fatalf("response does not contain lowercase uuid: %s", body)
	}

	if strings.Contains(body, `"Username"`) {
		t.Fatalf("response contains uppercase Username field: %s", body)
	}

	if strings.Contains(body, `"UUID"`) {
		t.Fatalf("response contains uppercase UUID field: %s", body)
	}
}

func TestServerStatusHandlerReturnsStructuredError(t *testing.T) {
	queryErr := errors.New("internal query failure")

	query := func(
		ctx context.Context,
		address string,
	) (minecraft.Status, error) {
		return minecraft.Status{}, queryErr
	}

	cache := minecraft.NewCache(time.Minute, query)
	logger := slog.New(slog.NewTextHandler(io.Discard, nil))
	handler := ServerStatusHandler(cache, "localhost:25565", logger)

	request := httptest.NewRequest(
		http.MethodGet,
		"/api/v1/server/status",
		nil,
	)
	recorder := httptest.NewRecorder()

	handler.ServeHTTP(recorder, request)

	if recorder.Code != http.StatusServiceUnavailable {
		t.Fatalf(
			"status code = %d, want %d",
			recorder.Code,
			http.StatusServiceUnavailable,
		)
	}

	var body struct {
		Error struct {
			Code    string `json:"code"`
			Message string `json:"message"`
		} `json:"error"`
	}

	if err := json.NewDecoder(recorder.Body).Decode(&body); err != nil {
		t.Fatalf("decode response: %v", err)
	}

	if body.Error.Code != "server_status_unavailable" {
		t.Fatalf(
			"error.code = %q, want server_status_unavailable",
			body.Error.Code,
		)
	}

	if body.Error.Message != "error retrieving server status" {
		t.Fatalf(
			"error.message = %q, want error retrieving server status",
			body.Error.Message,
		)
	}
}
