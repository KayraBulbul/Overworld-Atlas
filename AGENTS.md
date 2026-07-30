# Goon Squad Website

## Project Overview

This repository contains the Goon Squad Minecraft community website.

The canonical product requirements are in `PRODUCT_REQUIREMENTS.md`. The detailed architecture and phased implementation roadmap are in `.agents/skills/goon-squad-webapp/SKILL.md`. Read both before planning or implementing a product feature.

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

## Product Rules

- Build a handcrafted community archive for a long-running private Minecraft world, not a generic landing page or SaaS dashboard.
- Keep normal Discord login separate from requesting Minecraft server access. `Log In` must never open or submit the join-request flow.
- Use the product roles `Visitor`, `Applicant`, `Member`, and `Admin`; treat application status as a separate concept.
- The site owner uses their normal Discord-authenticated account with the `Admin` role. Do not create a separate admin authentication system.
- Enforce all account, ownership, posting, application, and admin permissions in Go.
- The Minecraft server uses Fabric. Do not plan Bukkit, Spigot, or Paper plugins.
- Begin whitelist management as a manual admin workflow. RCON or a Fabric-side integration belongs to a later phase.
- Use real server content and imagery when available, and keep placeholders easy to replace.
- Treat the implemented Phase 1 public interface as the approved visual baseline. Preserve its layout, section order, navigation order, typography, spacing, and styling unless the owner explicitly requests a redesign.

## Experience Rules

- Use an editorial, vintage world-atlas visual language with strong typography, structured sections, deliberate borders, restrained shadows, and subtle archival or map texture.
- Avoid glowing gradients, excessive rounded cards, ubiquitous floating panels, huge centred marketing slogans, meaningless decoration, excessive empty space, and uniform card layouts.
- Explore an old-style editorial serif for major headings and use a clean sans-serif for body and interface text. Font selection remains subject to implementation testing.
- Support coherent light and dark themes. Use the provisional colour tokens in `PRODUCT_REQUIREMENTS.md` as starting points, not immutable values.
- Prioritise readability, accessibility, keyboard operation, contrast, and responsive desktop/mobile layouts over decoration.
- Reuse components without forcing every type of content into the same visual treatment.

## Required Product Areas

The public information architecture includes:

- Home
- Players
- Map
- Stories
- Events
- Join or Request Access
- Theme toggle
- Separate login or contextual account controls

Required routes include `/`, `/map`, `/players`, `/stories`, `/stories/:slug`, `/events`, `/events/:slug`, `/account`, and `/admin`. Add protected story and event create/edit routes in the authentication and content-management phase. `/join` is optional and may complement, but not replace, the join-request dialog.

## Repository Structure

Use this structure:

```text
goon-squad/
├── web/
│   └── React frontend
├── api/
│   └── Go backend
├── .agents/
│   └── skills/
│       └── goon-squad-webapp/
│           └── SKILL.md
├── AGENTS.md
├── PRODUCT_REQUIREMENTS.md
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
- Organise larger features by domain, such as stories, events, players, applications, authentication, gallery, BlueMap, and server status.
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
- Treat normal login and application-specific Discord OAuth as distinct intents, even when they share underlying OAuth infrastructure.

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
2. Public website shell and design system
3. Live Minecraft status and BlueMap
4. PostgreSQL-backed players, stories, and events
5. Production deployment
6. Discord authentication and member content management
7. Join requests, application tracking, and manual whitelist administration
8. Image uploads
9. Rich BlueMap integration
10. Minecraft statistics and optional whitelist automation
11. Optional community features

Do not introduce later-phase infrastructure early unless a current feature genuinely depends on it.

## Development Workflow

Before implementing a feature:

1. Inspect the existing repository.
2. Identify the current project phase.
3. Confirm the feature belongs in that phase.
4. Follow existing conventions.
5. Implement the smallest complete vertical slice.
6. Avoid unrelated refactors.

When the owner requests a product or implementation requirement change, update `PRODUCT_REQUIREMENTS.md` and every corresponding Markdown source of truth, roadmap, or operational document in the same change. Do not leave superseded requirements in `AGENTS.md`, `.agents/skills/goon-squad-webapp/SKILL.md`, `README.md`, or other affected documentation.

After work changes the implemented scope or roadmap position, update `README.md` under `Current Project Status` in the same change. Keep its active phase, completion point, latest additions, and next planned phase accurate; do not leave stale status for a later session.

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
- Never expose RCON, server-console, WiseHosting, or whitelist-management credentials to the browser.

## Codex Skill

The detailed project architecture and implementation roadmap is stored at:

```text
.agents/skills/goon-squad-webapp/SKILL.md
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

Use `PRODUCT_REQUIREMENTS.md` when deciding product behaviour, page content, visual direction, navigation, role semantics, login and application behaviour, or unresolved owner decisions.

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
