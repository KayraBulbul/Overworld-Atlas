package handlers

import (
	"context"
	"encoding/json"
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
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
