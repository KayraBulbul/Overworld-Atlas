-- name: GetPlayerByUsername :one
SELECT *
FROM players
WHERE username = $1;

-- name: GetPageOfPlayers :many
SELECT *
FROM players
ORDER BY username ASC
LIMIT $1 OFFSET $2;

-- name: GetPlayerCount :one
SELECT COUNT(*)
FROM players;
