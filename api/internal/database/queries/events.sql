-- name: GetEventBySlug :one
SELECT 
  e.*,
  p.username
FROM events AS e
JOIN players AS p
  ON e.organiser_id = p.player_id
WHERE e.slug = $1 AND e.is_published = TRUE;

-- name: GetLatestUpcomingEvent :one
SELECT 
  e.*,
  p.username
FROM events AS e
JOIN players AS p
  ON e.organiser_id = p.player_id
WHERE e.start_date > $1 AND e.is_published = TRUE
ORDER BY e.start_date ASC, e.title ASC, e.slug ASC
LIMIT 1;

-- name: GetPageOfUpcomingEvents :many
SELECT 
  e.*,
  p.username
FROM events AS e
JOIN players AS p
  ON e.organiser_id = p.player_id
WHERE e.is_published = TRUE AND e.start_date > $1
ORDER BY e.start_date ASC, e.title ASC, e.slug ASC
LIMIT $2 OFFSET $3;

-- name: GetPageOfPastEvents :many
SELECT 
  e.*,
  p.username
FROM events AS e
JOIN players AS p
  ON e.organiser_id = p.player_id
WHERE
  e.is_published = TRUE
  AND (e.end_date IS NOT NULL AND e.end_date < $1)
  OR e.is_published = TRUE AND (e.end_date IS NULL AND e.start_date < $1)
ORDER BY COALESCE(e.end_date, e.start_date) DESC, e.title ASC, e.slug ASC
LIMIT $2 OFFSET $3;

-- name: GetPageOfOngoingEvents :many
SELECT 
  e.*,
  p.username
FROM events AS e
JOIN players AS p
  ON e.organiser_id = p.player_id
WHERE e.is_published = TRUE AND e.start_date < $1 AND e.end_date > $1
ORDER BY e.start_date ASC, e.title ASC, e.slug ASC
LIMIT $2 OFFSET $3;

-- name: GetUpcomingCount :one
SELECT COUNT(*)
FROM events
WHERE is_published = TRUE AND start_date > $1;

-- name: GetPastCount :one
SELECT COUNT(*)
FROM events
WHERE
  is_published = TRUE
  AND (end_date IS NOT NULL AND end_date < $1)
  OR is_published = TRUE AND (end_date IS NULL AND start_date < $1);

-- name: GetOngoingCount :one
SELECT COUNT(*)
FROM events
WHERE is_published = TRUE AND start_date < $1 AND end_date > $1;
