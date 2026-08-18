package handlers

import (
	"log/slog"
	"net/http"

	database "github.com/KayraBulbul/Overworld-Atlas/api/internal/database/generated"
)

type StoryHandler struct {
	queries *database.Queries
	logger  *slog.Logger
}

func NewStoryHandler(queries *database.Queries, logger *slog.Logger) *StoryHandler {
	return &StoryHandler{
		queries: queries,
		logger:  logger,
	}
}

func (s *StoryHandler) GetStoriesPageHandler(w http.ResponseWriter, r *http.Request) {}

func (s *StoryHandler) GetStoryBySlugHandler(w http.ResponseWriter, r *http.Request) {}
