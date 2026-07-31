package main

import (
	"log/slog"
	"net/http"
	"os"
	"time"

	"github.com/KayraBulbul/Goon-Squad-SMP/api/internal/config"
	"github.com/KayraBulbul/Goon-Squad-SMP/api/internal/handlers"
	"github.com/KayraBulbul/Goon-Squad-SMP/api/internal/middleware"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
)

func newRouter(logger *slog.Logger, options cors.Options) http.Handler {
	r := chi.NewRouter()

	r.Use(middleware.RequestLogger(logger))

	r.Use(cors.Handler(options))

	r.Route("/api/v1", func(r chi.Router) {
		r.Get("/health", handlers.HealthHandler)
	})

	return r
}

func main() {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))

	cfg := config.GetConfig()

	router := newRouter(logger, cors.Options{
		AllowedOrigins: []string{cfg.CORSAllowedOrigin},
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

	server := &http.Server{
		Addr:              cfg.APIAddress,
		Handler:           router,
		ReadHeaderTimeout: 5 * time.Second,
		ReadTimeout:       10 * time.Second,
		WriteTimeout:      30 * time.Second,
		IdleTimeout:       60 * time.Second,
	}

	logger.Info("starting server", "address", cfg.APIAddress)

	if err := server.ListenAndServe(); err != nil {
		logger.Error("server stopped", "error", err)
		os.Exit(1)
	}
}
