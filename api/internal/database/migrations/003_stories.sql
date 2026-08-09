-- +goose up
CREATE TABLE stories (
  story_id UUID PRIMARY KEY,
  author_id UUID REFERENCES players (player_id) NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  published_at TIMESTAMPTZ
);

CREATE INDEX idx_stories_published_feed ON stories (is_published, published_at DESC, story_id DESC);

-- +goose Down
DROP TABLE stories;
