# Goon Squad SMP

The Goon Squad Minecraft community website is a modular monolith with a React frontend, a Go API, and PostgreSQL. Work is organised through the phased product roadmap, beginning with the foundation and public editorial interface.

Product and implementation planning is documented in:

- `PRODUCT_REQUIREMENTS.md` for canonical product and experience requirements
- `AGENTS.md` for repository-wide engineering constraints
- `.agents/skills/goon-squad-webapp/SKILL.md` for architecture and the phased delivery roadmap
- `docs/README.md` for phase learning and delivery reports

## Current Project Status

Last updated: 9 August 2026.

Phase 0, Phase 1, and Phase 2 are complete. Phase 3 is active: PostgreSQL-backed public players, stories, events, and homepage feeds. Its domain-model, migration, focused-query, and generated sqlc checkpoints are complete; the public response contract, Go handlers, tests, and frontend integration remain. The initial secure BlueMap embed is intentionally deferred to Phase 4, where its HTTPS route and browser security policy can be completed with production deployment.

Phase 3's initial product decisions are now recorded. Persistent players use UUID-backed identity with case-preserved, case-insensitive username lookup; Discord accounts and roles remain separate until Phase 5. Story and event titles may repeat while stable unique slugs own their routes. Public archives use bounded pagination, homepage feeds return the latest three published stories and the single next event, event instants are stored in UTC and presented in `Australia/Melbourne`, and past state is derived rather than stored.

The handwritten read layer now provides deterministic player pages and counts; published story detail, archive, count, and latest-three operations; and published event detail, upcoming, ongoing, past, count, and next-event operations. Story and event results include their attributed player username, event time-sensitive operations accept a caller-supplied current instant, and handlers will translate page numbers into bounded limits and offsets. `is_published` is the authoritative public-visibility flag; the later protected Go write path owns publication-time consistency.

The first Goose migrations now create empty player, event, and story tables with UUID identity, required player attribution, case-insensitive Minecraft usernames, stable unique slugs, timezone-aware timestamps, publication fields, and initial feed indexes. PostgreSQL enforces structural identity and relationship guarantees; cross-field event-range, publication, and audit-time validation will be enforced in Go when protected writes are introduced. The migration series was verified up and down against disposable local PostgreSQL.

No initial roster, story set, or event set is required. Phase 3's production tables begin empty and the public APIs and pages must treat that as a successful empty state. Phase 5 member/admin forms create stories and events; in Phase 6, the explicit admin `Whitelisted` action creates or links the new member's persistent player profile from their validated Minecraft identity, so there is no separate manual roster-entry job.

Player gameplay statistics are feasible but remain Phase 9. The current public status API cannot provide playtime, travel, mined or placed blocks, deaths, or kills. WiseHosting exposes those values in its private Player Manager but does not document a supported public export API in the reviewed material, so the roadmap now prefers a controlled daily server-side export keyed to Minecraft UUID after the exact public statistic set and a Minecraft `26.2`-compatible source are approved. Screenshots likewise remain static until Phase 7 introduces authenticated R2 uploads and persistent media metadata.

The latest Phase 2 additions are:

- `GET /api/v1/server/status` queries the standard Minecraft server-list status protocol without adding database persistence or server-management access.
- A bounded query timeout prevents an unresponsive Minecraft connection from hanging the API.
- The public contract distinguishes `online`, `offline`, and `unavailable`, represents unknown optional values explicitly, and separates a missing player sample from zero online players.
- A concurrency-safe 15-second in-memory cache prevents duplicate upstream queries and reports fresh, cached, and fallback metadata without persisting routine checks. A transient unavailable refresh cannot overwrite a prior usable online or offline result; the API serves it as stale and retries upstream after a bounded five-second window.
- Deterministic protocol, cache, handler, route, CORS, timeout, and error-envelope coverage is included. All 75 backend test and subtest events pass normally and with the race detector.
- The live server was rechecked on 1 August 2026 and reported Minecraft `26.2`, protocol `776`, zero of 20 players online, and no exposed player sample at that time.
- The homepage now preserves the Phase 1 layout while polling healthy status approximately every 30 seconds, retrying a temporary unavailable result or failed API request after 5 seconds, showing at most four positively identified online players, and rendering explicit loading, zero-player, missing-sample, offline, unavailable, and stale states.
- `/players` temporarily presents only players positively identified by the current public status sample. The persistent online/offline community directory remains Phase 3 work.
- Player heads use direct overlay-aware Mineatar face PNG requests keyed by UUID and fall back once to the local Steve-head asset on image failure. No additional backend service is required.
- Primary navigation now opens the full public pages and derives its active underline from the current route; Home is no longer selected away from `/`.
- The frontend status parser, presentation states, polling behaviour, four-player cap, player-head fallback, route-aware compact-navigation behaviour, homepage integration, and confirmed-online player page have automated coverage. All 39 frontend tests pass.

The accepted Phase 2 delivery and verification record is documented in `docs/phase-02-live-minecraft-status-and-player-presence.md`. The active owner-led Phase 3 backend assignment is `api/TODO.md`. BlueMap stays on the secure static-preview fallback until Phase 4 establishes an HTTPS reverse proxy or tunnel and verifies embedding policy. Phase 3 now continues with its public response contract and handler integration; no Phase 3 API endpoints exist yet.

The completed delivery and learning records are captured in `docs/phase-00-foundation-and-product-planning.md`, `docs/phase-01-public-website-shell-and-design-system.md`, and `docs/phase-02-live-minecraft-status-and-player-presence.md`. Every future phase must have a corresponding report under `docs/` before the project status advances.

## Collaboration Workflow

The owner writes all backend production implementation code, including the Go API, database work, and server-side integrations. Codex owns backend automated test implementation and maintenance, including test files, fixtures, helpers, and test-only dependencies or configuration. Codex otherwise supports backend work through focused Markdown TODO briefs and code review, and does not edit backend production files unless the owner explicitly requests an exception for a specific task.

Backend TODOs are written as senior-to-junior assignments. They explain the outcome, reasoning, responsibilities, concepts, constraints, acceptance criteria, and review handoff without supplying implementation code or pseudocode by default. Backend help remains concept-first so the owner can reason through and implement the solution.

Frontend behaviour, layout, states, and integration contracts are discussed extensively with the owner before implementation. Once the owner approves the direction, Codex implements the frontend while preserving the accepted Phase 1 visual baseline.

At the end of each accepted roadmap phase, Codex writes a report under `docs/` covering its frontend and backend-test work, the owner's backend production work, concepts practised, verification, deferred work, and an evidence-based senior-engineer report on the owner's development.

## Foundation

The current foundation includes:

- React, TypeScript, Vite, React Router, TanStack Query, and Tailwind CSS
- Go, Chi, structured request logging, and HTTP server timeouts
- An internal `GET /api/v1/health` endpoint with CORS coverage
- Local PostgreSQL through Docker Compose
- Goose and sqlc configuration with the initial Phase 3 player, event, and story migrations, focused read queries, and generated pgx access package
- Frontend formatting, linting, type checking, and production builds
- Go formatting checks, vetting, tests, and builds
- GitHub Actions CI for both applications

The health endpoint verifies backend availability internally. The public frontend does not request or display API connectivity as user-facing server status; live Minecraft status belongs to Phase 2.

## Requirements

- Node.js 22.12 or newer
- npm
- Go 1.26 or newer
- Docker with Docker Compose

## Environment

Frontend variables are documented in `web/.env.example`. API variables are documented in `api/.env.example`.

The committed examples contain local development values only. Keep local overrides in ignored `.env` files and never point default development commands at production services.

## Install Dependencies

```bash
make install
```

Go dependencies are downloaded automatically by standard Go commands.

## Run Locally

Start PostgreSQL:

```bash
make db-up
```

PostgreSQL is exposed at `localhost:5432` using the local-only defaults from `docker-compose.yml`.

Start the API:

```bash
make api
```

The API listens on `http://localhost:8080` by default.

Start the frontend in another terminal:

```bash
make web
```

Vite serves the site at `http://localhost:5173`.

Stop PostgreSQL with:

```bash
make db-down
```

## Internal Health Check

With the API running, verify its backend-only health endpoint:

```bash
curl --fail --show-error \
  -H 'Origin: http://localhost:5173' \
  http://localhost:8080/api/v1/health
```

The expected response is:

```json
{"status":"ok"}
```

The endpoint is independent of PostgreSQL and Minecraft server availability.

## Live Server Status Check

With the API running and Minecraft configuration set, verify the public status endpoint:

```bash
curl --fail --show-error \
  -H 'Origin: http://localhost:5173' \
  http://localhost:8080/api/v1/server/status
```

The endpoint returns HTTP `200` for normal `online`, `offline`, and temporarily `unavailable` outcomes so the frontend can render each state deliberately. Online responses include known counts and version information; optional fields are `null` when they are unavailable. The accepted contract decisions and verification evidence are recorded in `docs/phase-02-live-minecraft-status-and-player-presence.md`.

## Checks

Run the complete local check suite:

```bash
make check
```

This checks frontend formatting, linting, types, tests, and the production build. It also checks Go formatting without modifying files, then runs `go vet`, tests, and a build.

To format frontend files intentionally:

```bash
npm --prefix web run format
```

GitHub Actions runs the same categories of checks on pushes and pull requests.

## Phase 1 Assets

Keep manually managed, replaceable images under `web/public/images/`. The official primary logo is `web/public/images/branding/goon-squad-logo.png`, the Phase 1 featured settlement image is `web/public/images/settlements/featured_settlement.webp`, and the replaceable player-head fallback is `web/public/images/players/steve-head.png`.

Use the remaining directories by content type:

```text
web/public/images/maps/
web/public/images/screenshots/
web/public/images/settlements/
web/public/images/stories/
```

The Phase 1 editorial content remains centralised static preview data, while the server-status and confirmed-online player areas now use the live Minecraft status API. Phase 3 replaces player, story, and event fixtures with empty-safe PostgreSQL-backed public reads; Phase 4 replaces the static map with the initial secure BlueMap experience; and Phase 7 replaces screenshot fixtures with storage-backed media without changing the public information architecture.

## Database Tooling

The initial empty Phase 3 player, event, and story tables are defined through Goose migrations. Their focused read queries and generated sqlc package are committed. Continue later database changes with this workflow:

1. Add handwritten queries under `api/internal/database/queries`.
2. Run sqlc generation using `api/sqlc.yaml`.
3. Inspect and commit generated code under `api/internal/database/generated` without editing it manually.
4. Add a new Goose migration for any later schema correction; do not rewrite an applied migration.

Never edit generated sqlc files manually or use the production database as the local default.
