// Package config loads application configuration
package config

import (
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
)

type Config struct {
	APIAddress            string
	DatabaseURL           string
	CORSAllowedOrigin     string
	MinecraftServerHost   string
	MinecraftServerPort   string
	MinecraftQueryTimeout time.Duration
	MinecraftQueryTTL     time.Duration
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

	MinecraftQueryTimeout := os.Getenv("MINECRAFT_QUERY_TIMEOUT")
	TimeoutDuration, err := time.ParseDuration(MinecraftQueryTimeout)
	if err != nil {
		log.Printf("error parsing timeout duration: %v", err)
	}

	MinecraftQueryTTL := os.Getenv("MINECRAFT_QUERY_TTL")
	TTLDuration, err := time.ParseDuration(MinecraftQueryTTL)
	if err != nil {
		log.Printf("error parsing TTL duration: %v", err)
	}

	cfg := Config{
		APIAddress:            apiAddress,
		DatabaseURL:           databaseURL,
		CORSAllowedOrigin:     corsAllowedOrigin,
		MinecraftServerHost:   minecraftServerHost,
		MinecraftServerPort:   minecraftServerPort,
		MinecraftQueryTimeout: TimeoutDuration,
		MinecraftQueryTTL:     TTLDuration,
	}

	return cfg
}
