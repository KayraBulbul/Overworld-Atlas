package main

import (
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/go-chi/cors"
)

func TestHealthRoute(t *testing.T) {
	logger := slog.New(
		slog.NewTextHandler(io.Discard, nil),
	)

	const allowedOrigin string = "http://localhost:5173"

	router := newRouter(logger, cors.Options{
		AllowedOrigins: []string{allowedOrigin},
		AllowedMethods: []string{
			http.MethodGet,
			http.MethodOptions,
		},
		AllowedHeaders: []string{
			"Accept",
			"Authorization",
			"Content-Type",
		},
		AllowCredentials: true,
		MaxAge:           300,
	})

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

func TestHealthRouteCORS(t *testing.T) {
	logger := slog.New(
		slog.NewTextHandler(io.Discard, nil),
	)

	const allowedOrigin string = "http://localhost:5173"

	t.Run("allows configured origin", func(t *testing.T) {
		router := newRouter(logger, cors.Options{
			AllowedOrigins: []string{allowedOrigin},
			AllowedMethods: []string{
				http.MethodGet,
				http.MethodOptions,
			},
			AllowedHeaders: []string{
				"Accept",
				"Authorization",
				"Content-Type",
			},
			AllowCredentials: true,
			MaxAge:           300,
		})

		request := httptest.NewRequest(
			http.MethodGet,
			"/api/v1/health",
			nil,
		)
		request.Header.Set("Origin", allowedOrigin)

		recorder := httptest.NewRecorder()

		router.ServeHTTP(recorder, request)

		if recorder.Code != http.StatusOK {
			t.Errorf(
				"expected status %d, got %d",
				http.StatusOK,
				recorder.Code,
			)
		}

		gotOrigin := recorder.Header().Get("Access-Control-Allow-Origin")
		if gotOrigin != allowedOrigin {
			t.Errorf(
				"expected Access-Control-Allow-Origin %q, got %q",
				allowedOrigin,
				gotOrigin,
			)
		}
	})

	t.Run("allows preflight request", func(t *testing.T) {
		router := newRouter(logger, cors.Options{
			AllowedOrigins: []string{allowedOrigin},
			AllowedMethods: []string{
				http.MethodGet,
				http.MethodOptions,
			},
			AllowedHeaders: []string{
				"Accept",
				"Authorization",
				"Content-Type",
			},
			AllowCredentials: true,
			MaxAge:           300,
		})

		request := httptest.NewRequest(
			http.MethodOptions,
			"/api/v1/health",
			nil,
		)
		request.Header.Set("Origin", allowedOrigin)
		request.Header.Set("Access-Control-Request-Method", http.MethodGet)

		recorder := httptest.NewRecorder()

		router.ServeHTTP(recorder, request)

		if recorder.Code != http.StatusOK {
			t.Errorf(
				"expected status %d, got %d",
				http.StatusOK,
				recorder.Code,
			)
		}

		gotOrigin := recorder.Header().Get("Access-Control-Allow-Origin")
		if gotOrigin != allowedOrigin {
			t.Errorf(
				"expected expected Access-Control-Allow-Origin %q, got %q",
				allowedOrigin,
				gotOrigin,
			)
		}

		gotMethods := recorder.Header().Get("Access-Control-Allow-Methods")
		if !strings.Contains(gotMethods, http.MethodGet) {
			t.Errorf(
				"expected Access-Control-Allow-Methods to contain %q, got %q",
				http.MethodGet,
				gotMethods,
			)
		}
	})

	t.Run("does not allow unconfigured origin", func(t *testing.T) {
		router := newRouter(logger, cors.Options{
			AllowedOrigins: []string{allowedOrigin},
			AllowedMethods: []string{
				http.MethodGet,
				http.MethodOptions,
			},
			AllowedHeaders: []string{
				"Accept",
				"Authorization",
				"Content-Type",
			},
			AllowCredentials: true,
			MaxAge:           300,
		})

		request := httptest.NewRequest(
			http.MethodGet,
			"/api/v1/health",
			nil,
		)
		request.Header.Set("Origin", "http://not-allowed.example")

		recorder := httptest.NewRecorder()

		router.ServeHTTP(recorder, request)

		if recorder.Code != http.StatusOK {
			t.Errorf(
				"expected status %d, got %d",
				http.StatusOK,
				recorder.Code,
			)
		}

		gotOrigin := recorder.Header().Get("Access-Control-Allow-Origin")
		if gotOrigin != "" {
			t.Errorf(
				"expected no Access-Control-Allow-Origin header %q, got %q",
				"",
				gotOrigin,
			)
		}
	})
}
