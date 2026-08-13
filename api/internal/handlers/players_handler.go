package handlers

import (
	"log/slog"
	"math"
	"net/http"
	"strconv"

	database "github.com/KayraBulbul/Goon-Squad-SMP/api/internal/database/generated"
	"github.com/KayraBulbul/Goon-Squad-SMP/api/internal/respond"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
)

type PlayerHandler struct {
	queries *database.Queries
	logger  *slog.Logger
}

type Player struct {
	MinecraftID pgtype.UUID `json:"minecraft_id"`
	Username    string      `json:"username"`
}

func NewPlayerHandler(queries *database.Queries, logger *slog.Logger) *PlayerHandler {
	return &PlayerHandler{
		queries: queries,
		logger:  logger,
	}
}

func (p *PlayerHandler) GetPlayersPageHandler(w http.ResponseWriter, r *http.Request) {
	params := database.GetPageOfPlayersParams{
		Limit:  12,
		Offset: 0,
	}

	query := r.URL.Query()

	if query.Has("page_size") {
		pageSizeStr := query.Get("page_size")

		val, err := strconv.Atoi(pageSizeStr)
		if err != nil {
			respond.WithError(w, http.StatusBadRequest, "validation_error", "page_size must be an integer")
			return
		}
		if val < 51 && val > 0 {
			params.Limit = int32(val)
		} else if val > 50 {
			respond.WithError(w, http.StatusBadRequest, "validation_error", "page size is too large (must be 50 or less)")
			return
		} else if val < 1 {
			respond.WithError(w, http.StatusBadRequest, "validation_error", "page size must be at least 1")
			return
		}
	}

	if query.Has("page") {
		pageNumStr := query.Get("page")

		page, err := strconv.ParseInt(pageNumStr, 10, 64)
		if err != nil {
			respond.WithError(w, http.StatusBadRequest, "validation_error", "page must be an integer")
			return
		}
		if page > 0 {
			if (page - 1) > int64(math.MaxInt32)/int64(params.Limit) {
				respond.WithError(w, http.StatusBadRequest, "validation_error", "page is too large")
				return
			}

			offset := int32((page - 1)) * params.Limit

			params.Offset = offset
		} else {
			respond.WithError(w, http.StatusBadRequest, "validation_error", "page must be at least 1")
			return
		}
	}

	dbPlayers, err := p.queries.GetPageOfPlayers(r.Context(), params)
	if err != nil {
		respond.WithError(w, http.StatusInternalServerError, "database_error", "error getting player page")
		p.logger.Error("error getting player page from database", "error", err)
		return
	}

	players := []Player{}
	for _, player := range dbPlayers {
		players = append(players, Player{
			MinecraftID: player.MinecraftID,
			Username:    player.Username,
		})
	}

	playerCount, err := p.queries.GetPlayerCount(r.Context())
	if err != nil {
		respond.WithError(w, http.StatusInternalServerError, "database_error", "error getting player count")
		p.logger.Error("error getting player count from database", "error", err)
		return
	}

	totalPages := math.Ceil(float64(playerCount) / float64(params.Limit))

	type response struct {
		Players    []Player `json:"players"`
		PageNum    uint32   `json:"page"`
		PageSize   uint32   `json:"page_size"`
		TotalItems uint32   `json:"total_items"`
		TotalPages uint32   `json:"total_pages"`
		Previous   bool     `json:"has_previous"`
		Next       bool     `json:"has_next"`
	}

	respond.WithJSON(w, http.StatusOK, response{
		Players:    players,
		PageNum:    uint32((params.Offset / params.Limit) + 1),
		PageSize:   uint32(params.Limit),
		TotalItems: uint32(playerCount),
		TotalPages: uint32(totalPages),
		Previous:   (params.Offset/params.Limit)+1 > 1,
		Next:       (params.Offset/params.Limit)+1 < int32(totalPages),
	})
}

func (p *PlayerHandler) GetPlayerByUsernameHandler(w http.ResponseWriter, r *http.Request) {
	username := r.PathValue("username")

	dbPlayer, err := p.queries.GetPlayerByUsername(r.Context(), username)
	if err == pgx.ErrNoRows {
		respond.WithError(w, http.StatusNotFound, "player_not_found", "player not found")
		return
	} else if err != nil {
		respond.WithError(w, http.StatusInternalServerError, "database_error", "error getting player from database")
		p.logger.Error("error getting player from database", "error", err)
		return
	}

	player := Player{MinecraftID: dbPlayer.MinecraftID, Username: dbPlayer.Username}

	respond.WithJSON(w, http.StatusOK, player)
}
