package respond

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestWithErrorReturnsStructuredEnvelope(t *testing.T) {
	recorder := httptest.NewRecorder()

	WithError(
		recorder,
		http.StatusServiceUnavailable,
		"server_status_unavailable",
		"error retrieving server status",
	)

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
			"error.code = %q, want %q",
			body.Error.Code,
			"server_status_unavailable",
		)
	}

	if body.Error.Message != "error retrieving server status" {
		t.Fatalf(
			"error.message = %q, want %q",
			body.Error.Message,
			"error retrieving server status",
		)
	}

	if got := recorder.Header().Get("Content-Type"); got != "application/json" {
		t.Fatalf("Content-Type = %q, want application/json", got)
	}
}
