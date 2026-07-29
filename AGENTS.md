# Goon Squad Website

## Project Overview

This repository contains the Goon Squad Minecraft community website.

The project uses:

- React, TypeScript, and Vite for the frontend
- Go and Chi for the backend API
- PostgreSQL for persistent data
- pgx and sqlc for database access
- Goose for database migrations
- TanStack Query for frontend server state
- WiseHosting for the Minecraft server and BlueMap
- Cloudflare Pages for frontend hosting
- Fly.io Sydney for backend hosting
- Neon Sydney for production PostgreSQL
- Cloudflare R2 for uploaded images later
- Discord OAuth for authentication later

The project should remain a modular monolith.

Do not introduce microservices, Kubernetes, Redis, WebSockets, event buses, or additional infrastructure unless a concrete feature requires them.

## Repository Structure

Use this structure:

```text
goon-squad/
├── web/
│   └── React frontend
├── api/
│   └── Go backend
├── .opencode/
│   └── skills/
│       └── goon-squad-webapp/
│           └── SKILL.md
├── AGENTS.md
├── docker-compose.yml
├── Makefile
└── README.md
```

## Frontend Rules

- Keep frontend code under `web/`.
- Use React with TypeScript and Vite.
- Use React Router for page routing.
- Use TanStack Query for data loaded from the Go API.
- Use normal React state for local UI state.
- Use Tailwind CSS for styling.
- Use React Hook Form and Zod for forms where useful.
- Organise larger features by domain, such as builds, members, announcements, gallery, and server status.
- Include loading, empty, error, and success states.
- Do not place secrets or private API credentials in frontend code.
- Do not treat client-side validation as a security boundary.

## Backend Rules

- Keep backend code under `api/`.
- Use Go with `net/http` and Chi.
- Use `/api/v1` for API routes.
- Keep HTTP concerns in handlers.
- Keep substantial business logic outside handlers.
- Use `log/slog` for structured logging.
- Return consistent JSON errors.
- Do not expose SQL errors, stack traces, credentials, or internal implementation details.
- Validate all untrusted input in the Go API.
- Protect every write endpoint on the server.
- Do not expose RCON or WiseHosting management credentials.

Use this general request flow:

```text
HTTP request
    |
    v
Chi route
    |
    v
Handler
    |
    v
Service when needed
    |
    v
sqlc query or external client
```

Do not add repository interfaces or abstraction layers that only wrap sqlc one-for-one.

## Database Rules

- Use PostgreSQL.
- Use pgx as the database driver.
- Use sqlc for generated database access.
- Use Goose for every schema migration.
- Keep SQL queries under the backend database query directory.
- Never manually edit generated sqlc files.
- Run sqlc generation after changing schemas or queries.
- Never modify an already-applied shared or production migration.
- Create a new migration to correct an old migration.
- Use local PostgreSQL through Docker Compose during development.
- Never default development commands to the production Neon database.
- Do not store uploaded image binaries in PostgreSQL.
- Store only image metadata and object keys in PostgreSQL.

After changing database schemas or queries:

1. Create or update a Goose migration.
2. Update the SQL query files.
3. Run sqlc generation.
4. Run tests and builds.
5. Confirm generated files are current.

## Project Phases

Use the `goon-squad-webapp` skill for the full roadmap.

The intended order is:

1. Foundation
2. Public homepage and BlueMap
3. Live Minecraft server status
4. PostgreSQL-backed community content
5. Production deployment
6. Discord authentication and administration
7. Image uploads
8. Rich BlueMap integration
9. Minecraft statistics
10. Optional community features

Do not introduce later-phase infrastructure early unless a current feature genuinely depends on it.

## Development Workflow

Before implementing a feature:

1. Inspect the existing repository.
2. Identify the current project phase.
3. Confirm the feature belongs in that phase.
4. Follow existing conventions.
5. Implement the smallest complete vertical slice.
6. Avoid unrelated refactors.

Before completing frontend work, run:

- Linting
- Type checking
- Tests where available
- Production build

Before completing backend work, run:

- Go formatting
- `go vet ./...`
- `go test ./...`
- Go build

After database changes, also run sqlc generation and migration checks.

## Security Rules

- Never commit secrets.
- Keep database URLs, Discord secrets, storage credentials, and Minecraft management credentials in environment variables.
- Use secure HTTP-only cookies for authentication.
- Do not store OAuth access tokens in local storage.
- Check permissions in Go, not only in the frontend.
- Use strict production CORS configuration.
- Add rate limits and request timeouts where appropriate.
- Do not allow arbitrary file uploads.
- Validate file size, type, ownership, and permissions before uploads.
- Do not expose direct database access to the browser.

## OpenCode Skill

The detailed project architecture and implementation roadmap is stored at:

```text
.opencode/skills/goon-squad-webapp/SKILL.md
```

Use the `goon-squad-webapp` skill when:

- Planning a feature
- Deciding which phase a feature belongs to
- Changing architecture
- Adding database models
- Adding authentication
- Adding uploads
- Integrating BlueMap
- Integrating Minecraft statistics
- Reviewing whether an implementation matches the roadmap

## Definition of Done

A feature is complete only when:

- It follows the current architecture.
- It works locally.
- Relevant migrations are included.
- Generated sqlc code is current.
- Inputs are validated.
- Errors are handled.
- The UI handles loading and failure states.
- Tests or a clear verification method exist.
- Secrets are not committed.
- New environment variables are documented.
- No unnecessary infrastructure was introduced.
