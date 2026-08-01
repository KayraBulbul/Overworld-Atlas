package handlers

import (
	"log/slog"
	"net/http"
	"time"

	"github.com/KayraBulbul/Goon-Squad-SMP/api/internal/minecraft"
	"github.com/KayraBulbul/Goon-Squad-SMP/api/internal/respond"
)

func ServerStatusHandler(cache *minecraft.Cache, address string, logger *slog.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		type response struct {
			State                 minecraft.State    `json:"state"`
			OnlinePlayers         int                `json:"online_players"`
			MaxPlayers            int                `json:"max_players"`
			PlayerSampleAvailable bool               `json:"player_sample_available"`
			Players               []minecraft.Player `json:"players"`
			Version               string             `json:"version"`
			ProtocolVersion       int                `json:"protocol_version"`
			CheckedAt             time.Time          `json:"checked_at"`
			Stale                 bool               `json:"stale"`
		}

		status, err := cache.Get(r.Context(), address)
		if err != nil {
			respond.WithError(w, http.StatusServiceUnavailable, "error retrieving server status")
			logger.Error("failed to retrieve Minecraft server status", "error", err)
			return
		}

		respond.WithJSON(w, http.StatusOK, response{
			State:                 status.State,
			OnlinePlayers:         status.OnlinePlayers,
			MaxPlayers:            status.MaxPlayers,
			PlayerSampleAvailable: status.PlayerSampleAvailable,
			Players:               status.Players,
			Version:               status.Version,
			ProtocolVersion:       status.ProtocolVersion,
			CheckedAt:             status.CheckedAt,
			Stale:                 status.Stale,
		})

		logger.Info("Successfully retrieved Minecraft server status")
	}
}
