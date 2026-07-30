# Goon Squad SMP

The Goon Squad Minecraft community website is a modular monolith with a React frontend, a Go API, and PostgreSQL. Work is organised through the phased product roadmap, beginning with the foundation and public editorial interface.

Product and implementation planning is documented in:

- `PRODUCT_REQUIREMENTS.md` for canonical product and experience requirements
- `AGENTS.md` for repository-wide engineering constraints
- `.opencode/skills/goon-squad-webapp/SKILL.md` for architecture and the phased delivery roadmap

## Current Project Status

Last updated: 30 July 2026.

The project is at the completion and acceptance point of Phase 1, the public website shell and design system. Phase 0 is complete, all currently scoped Phase 1 implementation and automated checks pass, and Phase 2 has not started.

The latest Phase 1 additions are:

- The implemented public interface is now the approved visual baseline, including its Home, Players, Map, Stories, Events, and Screenshots section and navigation order.
- The official logo, server address, and Goon Squad Mountain featured-settlement content are recorded as canonical product facts.
- The featured settlement uses the optimised `web/public/images/settlements/featured_settlement.webp` image with supplied coordinates, description, and accessible alternative text.
- Shared loading, error, and unavailable presentation primitives are available for later API-backed phases without changing the current static interface.
- The complete frontend and backend check suite passes, including 17 frontend tests and the production builds.

The next planned implementation work is Phase 2: live Minecraft server status and secure BlueMap integration.

## Foundation

The current foundation includes:

- React, TypeScript, Vite, React Router, TanStack Query, and Tailwind CSS
- Go, Chi, structured request logging, and HTTP server timeouts
- An internal `GET /api/v1/health` endpoint with CORS coverage
- Local PostgreSQL through Docker Compose
- Goose and sqlc configuration, with application migrations deferred until Phase 3
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

The public interface also has zero-tolerance Playwright snapshots for Chromium,
Firefox, and WebKit. Run them in the pinned browser environment:

```bash
docker run --rm --network host --user "$(id -u):$(id -g)" \
  -e HOME=/tmp \
  -v "$PWD/web:/work" \
  -w /work \
  mcr.microsoft.com/playwright:v1.62.0-noble \
  npm run test:visual
```

Only update an accepted visual baseline deliberately with
`npm run test:visual:update` in that same container environment.

## Phase 1 Assets

Keep manually managed, replaceable images under `web/public/images/`. The official primary logo is `web/public/images/branding/goon-squad-logo.png`, and the Phase 1 featured settlement image is `web/public/images/settlements/featured_settlement.webp`.

Use the remaining directories by content type:

```text
web/public/images/maps/
web/public/images/screenshots/
web/public/images/settlements/
web/public/images/stories/
```

Phase 1 public content is centralised static preview data. Later phases replace those fixtures with the live Minecraft status API, BlueMap, PostgreSQL-backed community content, and storage-backed media without changing the public information architecture.

## Database Tooling

No application tables or migrations exist during Phase 0. When persistent public content begins in Phase 3:

1. Add Goose migrations under `api/internal/database/migrations`.
2. Add handwritten queries under `api/internal/database/queries`.
3. Run sqlc generation using `api/sqlc.yaml`.
4. Commit generated code under `api/internal/database/generated`.

Never edit generated sqlc files manually or use the production database as the local default.
