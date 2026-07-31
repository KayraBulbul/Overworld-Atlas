// Package config loads application configuration
package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	APIAddress          string
	DatabaseURL         string
	CORSAllowedOrigin   string
	MinecraftServerHost string
	MInecraftServerPort string
}

func GetConfig() Config {
	err := godotenv.Load()
	if err != nil {
		log.Printf("error loading environment %v", err)
	}

	apiAddress := os.Getenv("API_ADDR")
	if apiAddress == "" {
		apiAddress = ":8080"
	}

	databaseURL := os.Getenv("DATABASE_URL")

	corsAllowedOrigin := os.Getenv("CORS_ALLOWED_ORIGIN")
	if corsAllowedOrigin == "" {
		corsAllowedOrigin = "http://localhost:5173"
	}

	minecraftServerHost := os.Getenv("MINECRAFT_SERVER_HOST")
	minecraftServerPort := os.Getenv("MINECRAFT_SERVER_PORT")

	cfg := Config{
		APIAddress:          apiAddress,
		DatabaseURL:         databaseURL,
		CORSAllowedOrigin:   corsAllowedOrigin,
		MinecraftServerHost: minecraftServerHost,
		MInecraftServerPort: minecraftServerPort,
	}

	return cfg
}
