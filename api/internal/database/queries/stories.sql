-- name: GetStoryBySlug :one
SELECT *
FROM stories AS s
JOIN players AS p
  ON s.author_id = p.player_id
WHERE s.slug = $1 AND s.is_published = TRUE;

-- name: GetPageOfStories :many
SELECT *
FROM stories AS s
JOIN players AS p
  ON s.author_id = p.player_id
WHERE s.slug IS NOT NULL AND s.is_published = TRUE
ORDER BY s.published_at DESC, s.title ASC, s.slug ASC
LIMIT $1 OFFSET $2;

-- name: GetTopThreeStories :many
SELECT *
FROM stories AS s
JOIN players AS p
  ON s.author_id = p.player_id
WHERE s.is_published = TRUE
ORDER BY s.published_at DESC, s.title ASC, s.slug ASC
LIMIT 3;

-- name: GetPublishedStoryCount :one
SELECT COUNT(*)
FROM stories
WHERE is_published = TRUE;
