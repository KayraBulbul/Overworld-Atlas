# Database Scaffold

Do not add application tables or migrations during scaffolding.

When persistent player, story, and event content begins in Phase 3:

1. Add a Goose migration under `migrations/`.
2. Add handwritten SQL under `queries/`.
3. Run sqlc generation.
4. Never edit files under `generated/` manually.
