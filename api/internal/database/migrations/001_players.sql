-- +goose Up
CREATE EXTENSION IF NOT EXISTS citext;

CREATE TABLE players (
  player_id UUID PRIMARY KEY,
  minecraft_id UUID NOT NULL UNIQUE,
  username CITEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

-- +goose Down
DROP TABLE players;
DROP EXTENSION citext;
