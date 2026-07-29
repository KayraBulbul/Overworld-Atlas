# Goon Squad SMP

The Goon Squad Minecraft community website is a modular monolith with a React frontend, a Go API, and PostgreSQL. Work is organised through the phased product roadmap, beginning with the foundation and public editorial interface.

Product and implementation planning is documented in:

- `PRODUCT_REQUIREMENTS.md` for canonical product and experience requirements
- `AGENTS.md` for repository-wide engineering constraints
- `.opencode/skills/goon-squad-webapp/SKILL.md` for architecture and the phased delivery roadmap

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

## Phase 1 Assets

Keep manually managed, replaceable images under `web/public/images/`. Place the primary logo at `web/public/images/branding/goon-squad-logo.png`, or use the same basename with an `.svg` extension for a vector source. Until a final logo is supplied, the interface uses a text monogram fallback.

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
