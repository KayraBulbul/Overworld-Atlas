package main

import (
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestHealthRoute(t *testing.T) {
	logger := slog.New(
		slog.NewTextHandler(io.Discard, nil),
	)

	router := newRouter(logger)

	request := httptest.NewRequest(
		http.MethodGet,
		"/api/v1/health",
		nil,
	)

	recorder := httptest.NewRecorder()

	router.ServeHTTP(recorder, request)

	if recorder.Code != http.StatusOK {
		t.Errorf(
			"expected status %d, got %d",
			http.StatusOK,
			recorder.Code,
		)
	}

	expectedBody := `{"status":"ok"}`

	if strings.TrimSpace(recorder.Body.String()) != expectedBody {
		t.Errorf(
			"expected body %q, got %q",
			expectedBody,
			recorder.Body.String(),
		)
	}

	expectedContentType := "application/json"

	if recorder.Header().Get("Content-Type") != expectedContentType {
		t.Errorf(
			"expected Content-Type %q, got %q",
			expectedContentType,
			recorder.Header().Get("Content-Type"),
		)
	}
}
