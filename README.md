# Overworld Atlas

Overworld Atlas is the engineering project behind a private Minecraft community website. It is a modular monolith with a React frontend, a Go API, and PostgreSQL. Work is organised through the phased product roadmap, beginning with the foundation and public editorial interface.

The repository and its engineering documentation use the name **Overworld Atlas**. The website itself remains branded **Goon Squad**, so user-facing copy, in-world names, domains, and established asset filenames keep that name.

Product and implementation planning is documented in:

- `PRODUCT_REQUIREMENTS.md` for canonical product and experience requirements
- `AGENTS.md` for repository-wide engineering constraints
- `.agents/skills/overworld-atlas-webapp/SKILL.md` for architecture and the phased delivery roadmap
- `docs/README.md` for phase learning and delivery reports

## Current Project Status

Last updated: 9 August 2026.

Phase 0, Phase 1, and Phase 2 are complete. The project is now beginning Phase 3: PostgreSQL-backed public players, stories, events, and homepage feeds. Phase 2 delivered live Minecraft status and player presence across the Go API and public frontend. The initial secure BlueMap embed is intentionally deferred to Phase 4, where its HTTPS route and browser security policy can be completed with production deployment.

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

The accepted backend response contract and verification record are documented in `api/TODO.md`; the completed frontend slice and its verification record are in `web/TODO.md`. BlueMap stays on the secure static-preview fallback until Phase 4 establishes an HTTPS reverse proxy or tunnel and verifies embedding policy. Phase 3 now begins with the public data model and read-only PostgreSQL APIs; no Phase 3 application tables or endpoints exist yet.

The completed delivery and learning records are captured in `docs/phase-00-foundation-and-product-planning.md`, `docs/phase-01-public-website-shell-and-design-system.md`, and `docs/phase-02-live-minecraft-status-and-player-presence.md`. Every future phase must have a corresponding report under `docs/` before the project status advances.

## Collaboration Workflow

The owner writes all backend implementation code, including the Go API, database work, and server-side integrations. Codex supports backend work by preparing focused Markdown TODO briefs and reviewing the owner's code; it does not edit backend implementation files unless the owner explicitly requests an exception for a specific task.

Backend TODOs are written as senior-to-junior assignments. They explain the outcome, reasoning, responsibilities, concepts, constraints, acceptance criteria, and review handoff without supplying implementation code or pseudocode by default. Backend help remains concept-first so the owner can reason through and implement the solution.

Frontend behaviour, layout, states, and integration contracts are discussed extensively with the owner before implementation. Once the owner approves the direction, Codex implements the frontend while preserving the accepted Phase 1 visual baseline.

At the end of each accepted roadmap phase, Codex writes a report under `docs/` covering its frontend work, the owner's backend work, concepts practised, verification, deferred work, and an evidence-based senior-engineer report on the owner's development.

## Foundation

The current foundation includes:

- React, TypeScript, Vite, React Router, TanStack Query, and Tailwind CSS
- Go, Chi, structured request logging, and HTTP server timeouts
- An internal `GET /api/v1/health` endpoint with CORS coverage
- Local PostgreSQL through Docker Compose
- Goose and sqlc configuration ready for the initial Phase 3 application migrations
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

The endpoint returns HTTP `200` for normal `online`, `offline`, and temporarily `unavailable` outcomes so the frontend can render each state deliberately. Online responses include known counts and version information; optional fields are `null` when they are unavailable. The complete stable response examples are recorded in `api/TODO.md`.

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

The Phase 1 editorial content remains centralised static preview data, while the server-status and confirmed-online player areas now use the live Minecraft status API. Phase 3 replaces player, story, and event fixtures with PostgreSQL-backed public content; Phase 4 replaces the static map with the initial secure BlueMap experience; and Phase 7 replaces screenshot fixtures with storage-backed media without changing the public information architecture.

## Database Tooling

No application tables or migrations exist yet. As Phase 3 begins, persistent public content must follow this workflow:

1. Add Goose migrations under `api/internal/database/migrations`.
2. Add handwritten queries under `api/internal/database/queries`.
3. Run sqlc generation using `api/sqlc.yaml`.
4. Commit generated code under `api/internal/database/generated`.

Never edit generated sqlc files manually or use the production database as the local default.
