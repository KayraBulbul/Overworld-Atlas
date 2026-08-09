-- +goose Up
CREATE TABLE events (
  event_id UUID PRIMARY KEY,
  organiser_id UUID REFERENCES players (player_id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  published_at TIMESTAMPTZ
);

CREATE INDEX idx_events_start_time ON events (start_date);

-- +goose Down
DROP TABLE events;
