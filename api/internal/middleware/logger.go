// Package middleware loads all middleware
package middleware

import (
	"log/slog"
	"net/http"

	"github.com/go-chi/httplog/v3"
)

func RequestLogger(logger *slog.Logger) func(http.Handler) http.Handler {
	return httplog.RequestLogger(logger, &httplog.Options{
		Level: slog.LevelInfo,
	})
}
