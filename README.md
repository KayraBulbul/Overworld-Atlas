# Goon Squad SMP

Foundation scaffolding for the Goon Squad Minecraft community website. The repository is a modular monolith with a React frontend, a future Go API, and local PostgreSQL.

The frontend currently provides only an unstyled application shell. The backend intentionally contains no executable code, handlers, services, queries, or migrations.

Product and implementation planning is documented in:

- `PRODUCT_REQUIREMENTS.md` for the canonical product, design, route, authentication, joining, account, and administration requirements
- `AGENTS.md` for repository-wide engineering constraints
- `.opencode/skills/goon-squad-webapp/SKILL.md` for the architecture and phased delivery roadmap

The current repository remains in Phase 0. These planning documents do not scaffold or implement the described product features.

## Repository structure

```text
goon-squad-SMP/
├── web/                       React, TypeScript, and Vite
│   ├── public/
│   └── src/
│       ├── api/
│       ├── assets/
│       ├── components/
│       ├── features/          Empty domain placeholders
│       ├── hooks/
│       ├── layouts/
│       ├── pages/
│       ├── routes/
│       ├── schemas/
│       └── types/
├── api/                       Go module and backend scaffold
│   ├── cmd/server/
│   └── internal/
│       ├── auth/
│       ├── config/
│       ├── database/
│       │   ├── generated/
│       │   ├── migrations/
│       │   └── queries/
│       ├── handlers/
│       ├── middleware/
│       ├── minecraft/
│       ├── models/
│       ├── services/
│       └── storage/
├── docker-compose.yml
├── PRODUCT_REQUIREMENTS.md
├── AGENTS.md
└── Makefile
```

Some empty feature directories still use the earlier `announcements`, `builds`, and `members` scaffold names. They are not current product requirements. Reconcile them with the player, story, event, authentication, application, BlueMap, gallery, and server-status domains only when implementation reaches the relevant phase; this documentation update intentionally does not restructure application code.

## Requirements

- Node.js 22.12 or newer
- npm
- Go 1.26 or newer for future backend work
- Docker with Docker Compose

## Install frontend dependencies

```bash
make install
```

The Go module has no dependencies yet because backend code has intentionally not been implemented.

## Start the frontend

```bash
make web
```

Vite serves the site at <http://localhost:5173>.

## Start PostgreSQL

```bash
make db-up
```

PostgreSQL is exposed at `localhost:5432`. The Compose defaults match `api/.env.example` and are for local development only.

Stop PostgreSQL with:

```bash
make db-down
```

No tables or migrations exist yet.

## Checks

```bash
make check
```

Until the first Go package is implemented, the backend checks are skipped. Once a Go package exists, `make check` automatically runs Go formatting, vetting, tests, and a build in addition to the frontend checks.

## First backend task

Follow `api/cmd/server/TODO.md` to implement a minimal Chi server and `GET /api/v1/health` yourself. Keep the first endpoint independent of PostgreSQL.
