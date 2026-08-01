# Phase 3 Database Work — Active

Phase 3 begins after completion of the live-status and player-presence phase. No application tables, migrations, queries, or generated access code exist yet.

Before implementation, lock the public player, story, and event fields and resolve the initial roster/content decisions in `PRODUCT_REQUIREMENTS.md`. Keep transient Minecraft presence separate from persistent player profiles, and do not introduce authentication or protected writes in this phase.

For each approved Phase 3 vertical slice:

1. Add a Goose migration under `migrations/`.
2. Add handwritten SQL under `queries/`.
3. Run sqlc generation.
4. Add the public read-only Go endpoint and corresponding frontend query states.
5. Run migration checks, formatting, linting, vetting, tests, race tests where relevant, and production builds.
6. Never edit files under `generated/` manually.
