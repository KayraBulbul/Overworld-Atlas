---
name: goon-squad-webapp
description: Guide the architecture, phased implementation, and engineering conventions for the Goon Squad Minecraft server website. Use when planning, implementing, reviewing, or extending the React/Vite frontend, Go API, PostgreSQL database, BlueMap integration, Discord authentication, media storage, or Minecraft server integrations.
compatibility: opencode
metadata:
  project: goon-squad
  architecture: modular-monolith
  frontend: react-vite-typescript
  backend: go-chi-sqlc
---

# Goon Squad Web Application

## Purpose

Build a community website for the private **Goon Squad Minecraft server** hosted continuously through WiseHosting.

The website should become the central hub for:

- Live Minecraft server information
- The existing BlueMap world map
- Members and their profiles
- Builds and notable locations
- Announcements and server history
- Screenshots and media
- Gameplay statistics and leaderboards
- Trusted member administration

Follow the phased roadmap in this skill. Do not introduce later-phase infrastructure before the current phase requires it.

## Product Principles

1. Deliver a useful public website before building administration tools.
2. Keep the architecture as a modular monolith.
3. Use the database only for persistent application data.
4. Do not persist transient server-status checks unless a later analytics feature requires them.
5. Prefer Discord authentication over a custom username-and-password system.
6. Keep secrets, OAuth tokens, database credentials, RCON details, and hosting credentials out of the frontend.
7. Do not expose server-control capabilities publicly.
8. Add infrastructure only when a real feature requires it.
9. Keep the website visually distinctive but readable and responsive.
10. Treat BlueMap and the Minecraft server as external systems accessed through narrow integrations.

# Technology Stack

## Frontend

Use:

- React
- TypeScript
- Vite
- React Router
- TanStack Query
- Tailwind CSS
- shadcn/ui where it provides useful primitives
- React Hook Form
- Zod

Responsibilities:

- Routing and layouts
- UI components
- API requests
- Server-state caching
- Form state
- Client-side validation
- BlueMap embedding
- Responsive presentation
- Loading, empty, offline, and error states

Deploy the frontend to **Cloudflare Pages**.

## Backend

Use:

- Go
- `net/http`
- Chi
- `pgx/v5`
- sqlc
- Goose
- PostgreSQL
- `log/slog`
- Discord OAuth when authentication is introduced

Responsibilities:

- REST API
- Business logic
- Database access
- Minecraft server-status queries
- Authentication
- Authorisation
- Session management
- Input validation
- Image-upload authorisation
- Integration with BlueMap, Discord, storage, and Minecraft systems
- Rate limiting and request security

Deploy the backend to **Fly.io in Sydney**.

## Database

Use:

- PostgreSQL
- Neon hosted PostgreSQL
- Sydney region
- `pgx/v5` as the PostgreSQL driver
- sqlc for generated database code
- Goose for migrations

Use a local PostgreSQL container during development. Never use the production Neon database as the default development database.

## Files and Images

Initially, store manually managed assets under the frontend's static public directory.

Later, use:

- Cloudflare R2
- Presigned uploads
- PostgreSQL for file metadata only

Do not store image binaries directly in PostgreSQL.

## Minecraft Systems

Use:

- WiseHosting for the Minecraft server
- The existing BlueMap deployment
- Minecraft server-list status queries through the Go API
- A custom Minecraft plugin or secure export process only in a later phase

## Infrastructure

Use:

- Cloudflare DNS
- Cloudflare Pages
- Fly.io
- Neon
- Cloudflare R2 later
- Docker Compose locally
- GitHub
- GitHub Actions

# Production Architecture

```text
User
  |
  +-- goonsquad.example.com
  |     |
  |     +-- Cloudflare Pages
  |           |
  |           +-- React + Vite
  |
  +-- api.goonsquad.example.com
  |     |
  |     +-- Fly.io Sydney
  |           |
  |           +-- Go + Chi
  |                 |
  |                 +-- Neon PostgreSQL Sydney
  |                 +-- Minecraft status query
  |                 +-- Discord OAuth
  |                 +-- Cloudflare R2
  |
  +-- map.goonsquad.example.com
        |
        +-- BlueMap hosted with the Minecraft server
```

When a custom BlueMap subdomain is unavailable, expose the map through the website's `/map` route using an iframe or an external link.

Before embedding BlueMap, verify:

- The BlueMap URL uses HTTPS
- The host permits iframe embedding
- Browser security headers do not block embedding
- The URL is stable
- A custom subdomain is supported, if desired

# Repository Structure

Use a monorepo:

```text
goon-squad/
├── web/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── features/
│   │   │   ├── announcements/
│   │   │   ├── builds/
│   │   │   ├── gallery/
│   │   │   ├── members/
│   │   │   └── server-status/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── schemas/
│   │   ├── types/
│   │   └── main.tsx
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
├── api/
│   ├── cmd/
│   │   └── server/
│   │       └── main.go
│   ├── internal/
│   │   ├── auth/
│   │   ├── config/
│   │   ├── database/
│   │   │   ├── generated/
│   │   │   ├── migrations/
│   │   │   ├── queries/
│   │   │   └── store.go
│   │   ├── handlers/
│   │   ├── middleware/
│   │   ├── minecraft/
│   │   ├── models/
│   │   ├── services/
│   │   └── storage/
│   ├── sqlc.yaml
│   ├── goose.yaml
│   ├── go.mod
│   └── Dockerfile
│
├── .github/
│   └── workflows/
├── docker-compose.yml
├── Makefile
├── AGENTS.md
└── README.md
```

Organise frontend code primarily by feature. Do not put every component in one global components directory.

Keep the backend modular, but do not split it into microservices.

# Backend Conventions

## Request Flow

Use this general flow:

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
Service, when business logic warrants one
    |
    v
sqlc-generated database method or external client
```

Handlers should manage HTTP concerns:

- Decode requests
- Validate input
- Call application logic
- Translate errors
- Encode responses

Do not place substantial business logic in handlers.

Do not create interfaces or repository wrappers without a concrete need. sqlc-generated query types may be used directly behind a focused service or store where appropriate.

## API Versioning

Use:

```text
/api/v1
```

Examples:

```http
GET /api/v1/health
GET /api/v1/server/status
GET /api/v1/members
GET /api/v1/builds
```

## API Errors

Return a consistent JSON structure:

```json
{
  "error": {
    "code": "build_not_found",
    "message": "The requested build does not exist."
  }
}
```

Do not expose stack traces, SQL text, secrets, or internal implementation details.

## sqlc Configuration

Generate code for `pgx/v5`.

Example:

```yaml
version: "2"

sql:
  - engine: "postgresql"
    schema: "internal/database/migrations"
    queries: "internal/database/queries"
    gen:
      go:
        package: "database"
        out: "internal/database/generated"
        sql_package: "pgx/v5"
        emit_json_tags: true
        emit_interface: true
```

Keep handwritten SQL under `internal/database/queries`.

Never manually edit files in the generated sqlc directory.

## Database Migrations

- Use Goose for every schema change.
- Keep migrations committed to Git.
- Never modify a migration that has already been applied to a shared or production environment.
- Create a new migration to correct an old one.
- Make migration execution an explicit deployment step.
- Keep development and production connection strings separate.

# Frontend Conventions

## Server State

Use TanStack Query for API-backed data:

- Server status
- Members
- Builds
- Announcements
- Timeline events
- Gallery data
- Statistics

Use React state for local UI concerns:

- Modal visibility
- Selected tabs
- Form controls
- Mobile navigation
- Temporary client-only interactions

## Query Keys

Use stable, hierarchical query keys:

```ts
["server-status"]
["members"]
["members", username]
["builds", filters]
["builds", slug]
["announcements"]
```

After successful writes, invalidate only the affected queries.

## Validation

Use:

- Zod for frontend schemas
- React Hook Form for form state
- Independent server-side validation in Go

Client-side validation improves usability but is never a security boundary.

# Development Environment

Run locally:

```text
React:       http://localhost:5173
Go API:      http://localhost:8080
PostgreSQL:  localhost:5432
BlueMap:     Existing remote URL
```

Use Docker Compose for local PostgreSQL.

Keep local environment values in an ignored environment file.

Commit an example environment file containing names but no real secrets.

# Implementation Phases

## Phase 0: Foundation

### Goal

Establish the frontend-to-backend path and project tooling.

### Implement

- Monorepo
- React, TypeScript, and Vite
- Go application
- Chi router
- Environment configuration
- Docker Compose PostgreSQL
- Goose
- sqlc
- Structured logging
- Health endpoint
- CORS configuration
- Frontend linting and formatting
- Go formatting, vetting, and tests
- GitHub repository
- Basic CI

Initial endpoint:

```http
GET /api/v1/health
```

Example response:

```json
{
  "status": "ok"
}
```

### Database Usage

Set up PostgreSQL, Goose, and sqlc, but do not yet depend on application tables.

### Exit Criteria

- The React application can call the Go health endpoint.
- The frontend displays a successful response.
- Local PostgreSQL starts predictably.
- CI can build both applications.

Do not begin major product features until this path works.

## Phase 1: Public Website and BlueMap

### Goal

Create a presentable public website that can be shared with the server members.

### Implement

- Branding
- Main layout
- Navigation
- Homepage
- Server address with copy action
- BlueMap page
- BlueMap iframe or external link
- Rules page
- Server information page
- Responsive layout
- Loading and error components
- Initial static screenshots

Initial routes:

```text
/
/map
/server
/rules
```

### Database Usage

Do not use application tables yet.

Keep basic server configuration in a frontend configuration module or environment variables:

- Server name
- Public server address
- Minecraft version
- BlueMap URL

Do not create tables for a single server name or map URL.

### Exit Criteria

- The site works on desktop and mobile.
- BlueMap is embedded or linked successfully.
- The homepage is visually complete enough to share.

## Phase 2: Live Minecraft Server Status

### Goal

Connect the website to the real server.

### Backend

Implement:

```http
GET /api/v1/server/status
```

Return a stable response shape such as:

```json
{
  "online": true,
  "playersOnline": 4,
  "maxPlayers": 20,
  "version": "1.21.x",
  "motd": "Goon Squad SMP",
  "players": [
    {
      "name": "PlayerName",
      "uuid": "minecraft-uuid"
    }
  ],
  "checkedAt": "2026-07-29T02:00:00Z"
}
```

The exact player list may be unavailable depending on server configuration.

Add a short in-memory cache in Go so multiple users do not repeatedly query the Minecraft server.

### Frontend

Use TanStack Query and refetch approximately every 30 seconds.

Display:

- Online or offline
- Online player count
- Maximum player count
- Version
- Player names when available
- Last checked time
- Clear loading and unavailable states

### Database Usage

Do not persist routine status checks.

Server status is transient external state.

### Exit Criteria

The homepage reliably displays live status and fails gracefully when the Minecraft server is unavailable.

## Phase 3: Persistent Community Content

### Goal

Introduce the first real database-backed product features.

### Create Tables

Start with:

- `members`
- `builds`
- `build_members`
- `announcements`
- `timeline_events`

Suggested initial schema concepts:

### Members

- ID
- Minecraft UUID
- Username
- Display name
- Role
- Biography
- Join date
- Created and updated timestamps

### Builds

- ID
- Slug
- Name
- Description
- Status
- Dimension
- X, Y, and Z coordinates
- BlueMap URL
- Start and completion dates
- Created and updated timestamps

### Build Members

- Build ID
- Member ID
- Contribution
- Composite primary key

### Announcements

- ID
- Slug
- Title
- Body
- Publication time
- Created and updated timestamps

### Timeline Events

- ID
- Title
- Description
- Event date
- Event type
- Created timestamp

### Public Endpoints

```http
GET /api/v1/members
GET /api/v1/members/{username}

GET /api/v1/builds
GET /api/v1/builds/{slug}

GET /api/v1/announcements
GET /api/v1/announcements/{slug}

GET /api/v1/timeline
```

### Frontend Routes

```text
/members
/members/:username
/builds
/builds/:slug
/announcements
/announcements/:slug
/timeline
```

### Database Usage

This is the first phase in which the product should depend on PostgreSQL.

Begin with read-only public pages.

Insert initial content through:

- Seed scripts
- SQL files
- A small internal CLI
- A trusted database console

Do not build authentication and the first database models simultaneously.

### Exit Criteria

The public website reads members, builds, announcements, and timeline events through the Go API from PostgreSQL.

## Phase 4: Production Deployment and Hardening

### Goal

Deploy the complete public read-only system.

### Deploy

- Frontend to Cloudflare Pages
- Go API to Fly.io Sydney
- PostgreSQL to Neon Sydney
- BlueMap remains with WiseHosting

### Add

- Production domain
- API subdomain
- HTTPS
- Strict production CORS allowlist
- Secure environment variables
- Connection-pool limits
- Request timeouts
- Panic recovery
- Rate limiting
- Structured logs
- Consistent API errors
- Automated checks
- Explicit migration process
- Database recovery and backup awareness

### CI Checks

Frontend:

```text
install
lint
typecheck
test
build
```

Backend:

```text
go mod download
go vet ./...
go test ./...
verify sqlc output
go build ./cmd/server
```

### Exit Criteria

A tested revision can be deployed consistently without manually copying source files.

## Phase 5: Discord Authentication and Administration

### Goal

Allow trusted members to manage persistent content.

### Authentication

Use Discord OAuth.

Recommended flow:

```text
React requests login
    |
    v
Go redirects to Discord
    |
    v
Discord returns to the Go callback
    |
    v
Go verifies identity and membership
    |
    v
Go creates a secure server-side session
```

### Add Tables

- `users`
- `sessions`
- Roles or permissions, if required

Keep roles simple:

- Owner
- Admin
- Member

### Protected Endpoints

Examples:

```http
POST   /api/v1/admin/builds
PATCH  /api/v1/admin/builds/{id}
DELETE /api/v1/admin/builds/{id}

POST   /api/v1/admin/announcements
PATCH  /api/v1/admin/announcements/{id}

POST   /api/v1/admin/timeline
```

### Security

- Use secure, HTTP-only cookies.
- Do not store OAuth tokens in browser local storage.
- Validate every permission in Go.
- Do not treat hidden frontend controls as authorisation.
- Protect every write endpoint server-side.
- Add CSRF protection where applicable.
- Record who created or edited important content.

### Exit Criteria

An authorised member can sign in and manage content without direct database access.

## Phase 6: Image Uploads and Gallery

### Goal

Allow members to upload screenshots and attach them to content.

### Storage

Introduce Cloudflare R2.

Store file metadata in PostgreSQL and file bytes in R2.

### Preferred Upload Flow

```text
React requests upload authorisation
    |
    v
Go validates user and metadata
    |
    v
Go creates a presigned upload URL
    |
    v
Browser uploads directly to R2
    |
    v
React confirms completion
    |
    v
Go stores image metadata in PostgreSQL
```

### Add

- File-size limits
- MIME-type validation
- Random object keys
- Alt text
- Image ordering
- Image deletion
- Gallery moderation
- Build-image relationships
- Optional thumbnails

### Exit Criteria

Authorised members can upload and manage screenshots safely.

## Phase 7: Rich BlueMap Integration

### Goal

Connect website content to precise map locations.

### Add

- Build coordinates
- Minecraft dimensions
- “View on map” actions
- Direct BlueMap links
- Featured locations
- Marker categories
- Website build IDs associated with BlueMap marker IDs
- Optional marker synchronisation

Do not begin marker synchronisation until build pages and coordinates work reliably.

### Exit Criteria

Users can move directly between a build page and the corresponding BlueMap location.

## Phase 8: Statistics and Leaderboards

### Goal

Collect persistent gameplay data.

### Possible Features

- Playtime
- Deaths
- Blocks mined
- Distance travelled
- Mob kills
- Advancements
- First join
- Last seen
- Weekly activity
- Player-count history

### Integration

This phase may require:

- A custom Minecraft plugin
- Secure periodic exports
- Access to server statistics
- An authenticated ingestion endpoint
- Aggregation jobs

Preferred flow:

```text
Minecraft plugin or exporter
    |
    v
Authenticated Go ingestion endpoint
    |
    v
PostgreSQL
    |
    v
Public statistics endpoints
```

Do not expose arbitrary WiseHosting files to the public API.

### Data Modelling

Potential tables:

- `player_stat_snapshots`
- `player_daily_stats`
- `server_activity`
- `achievements`

Define the questions and charts the website must support before storing large volumes of raw events.

Prefer useful hourly or daily aggregates where appropriate.

### Exit Criteria

Statistics are collected automatically and are accurate enough to display publicly.

## Phase 9: Optional Community Features

Only begin this phase after the core system is stable and members are actively using it.

Possible features:

- Polls
- Events
- Build proposals
- Comments
- Reactions
- Awards
- Seasonal records
- Patch notes
- Discord announcement synchronisation
- Notification preferences

Choose features based on actual community use, not because the database makes them possible.

# Feature Order

Follow this order unless a concrete dependency justifies changing it:

1. Foundation
2. Homepage and BlueMap
3. Live server status
4. PostgreSQL community content
5. Production deployment
6. Discord authentication and administration
7. Image uploads
8. Rich BlueMap integration
9. Minecraft statistics
10. Optional community features

# Technology Introduction by Phase

| Technology | Introduce |
|---|---|
| React, Vite, TypeScript | Phase 0 |
| Go and Chi | Phase 0 |
| Docker Compose | Phase 0 |
| Local PostgreSQL | Phase 0 |
| Goose and sqlc configuration | Phase 0 |
| TanStack Query | Phase 0 or 1 |
| BlueMap embedding | Phase 1 |
| Minecraft status integration | Phase 2 |
| Database-backed product data | Phase 3 |
| Neon production database | Phase 4 |
| Fly.io API deployment | Phase 4 |
| Cloudflare Pages deployment | Phase 4 |
| Discord OAuth | Phase 5 |
| Cloudflare R2 | Phase 6 |
| Custom BlueMap markers | Phase 7 |
| Minecraft plugin or ingestion process | Phase 8 |

# Explicit Non-Goals for Early Phases

Do not introduce the following before a demonstrated need:

- Microservices
- Kubernetes
- Redis
- WebSockets
- Event buses
- A custom Minecraft plugin
- Public file uploads
- Complex role-management screens
- Separate public and admin backends
- Generic interfaces around every service
- Repository abstractions that merely wrap sqlc one-for-one
- Real-time chat
- Direct browser access to PostgreSQL
- Direct browser access to RCON
- Server-management credentials in frontend code

# Coding and Change Rules

When implementing a feature:

1. Identify the current roadmap phase.
2. Confirm that the feature belongs in that phase.
3. Inspect existing project conventions before adding new structure.
4. Prefer the smallest complete vertical slice.
5. Update migrations before generated sqlc code.
6. Run sqlc generation after query or schema changes.
7. Validate inputs in both frontend and backend where relevant.
8. Add loading, empty, error, and success states.
9. Add focused tests for business logic and API behaviour.
10. Run formatters, type checks, tests, and builds before declaring completion.
11. Document new environment variables.
12. Do not silently add a new infrastructure dependency.
13. Do not alter the architecture or hosting plan without explaining the concrete reason.

# Definition of Done

A feature is not complete until:

- It follows the current architecture.
- It works locally.
- Relevant migrations are included.
- Generated sqlc code is current.
- API input and output shapes are stable.
- Errors are handled consistently.
- The UI includes loading and failure states.
- Tests or a clear verification procedure exist.
- Secrets are not committed.
- Documentation is updated where necessary.
- The implementation does not introduce an unjustified later-phase dependency.
