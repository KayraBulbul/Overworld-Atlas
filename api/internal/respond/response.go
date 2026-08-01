// Package respond contains response utility functions
package respond

import (
	"encoding/json"
	"log"
	"net/http"
)

type errorResponse struct {
	Error string `json:"error"`
}

func WithJSON(w http.ResponseWriter, code int, payload any) {
	data, err := json.Marshal(payload)
	if err != nil {
		log.Printf("Error marshalling JSON: %s", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)

	if _, err = w.Write(data); err != nil {
		log.Printf("Error writing JSON response: %s", err)
	}
}

func WithError(w http.ResponseWriter, code int, msg string) {
	WithJSON(w, code, errorResponse{
		Error: msg,
	})
}
