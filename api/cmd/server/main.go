package main

import (
	"log/slog"
	"net/http"
	"os"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/httplog/v3"
	"github.com/joho/godotenv"
)

func newRouter(logger *slog.Logger) http.Handler {
	r := chi.NewRouter()
	r.Use(httplog.RequestLogger(logger, &httplog.Options{
		Level: slog.LevelInfo,
	}))

	r.Route("/api/v1", func(r chi.Router) {
		r.Get("/health", healthHandler)
	})

	return r
}

func main() {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))

	err := godotenv.Load()
	if err != nil {
		logger.Error("couldn't load environment", "error", err)
	}
	apiAddress := os.Getenv("API_ADDR")
	if apiAddress == "" {
		apiAddress = ":8080"
	}

	router := newRouter(logger)

	server := &http.Server{
		Addr:              apiAddress,
		Handler:           router,
		ReadHeaderTimeout: 5 * time.Second,
		ReadTimeout:       10 * time.Second,
		WriteTimeout:      30 * time.Second,
		IdleTimeout:       60 * time.Second,
	}

	logger.Info("starting server", "address", apiAddress)

	if err = server.ListenAndServe(); err != nil {
		logger.Error("server stopped", "error", err)
		os.Exit(1)
	}
}
