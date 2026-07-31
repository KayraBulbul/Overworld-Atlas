// Package handlers provides all handler functions for endpoints
package handlers

import (
	"net/http"

	"github.com/KayraBulbul/Goon-Squad-SMP/api/internal/respond"
)

func HealthHandler(w http.ResponseWriter, r *http.Request) {
	type response struct {
		Status string `json:"status"`
	}

	respond.RespondWithJSON(w, http.StatusOK, response{Status: "ok"})
}
