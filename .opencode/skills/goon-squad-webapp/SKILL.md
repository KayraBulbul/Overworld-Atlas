---
name: goon-squad-webapp
description: Guide the architecture, phased implementation, and engineering conventions for the Goon Squad Minecraft server website. Use when planning, implementing, reviewing, or extending the React/Vite frontend, Go API, PostgreSQL database, BlueMap integration, Discord authentication, join workflow, media storage, or Minecraft server integrations.
compatibility: opencode
metadata:
  project: goon-squad
  architecture: modular-monolith
  frontend: react-vite-typescript
  backend: go-chi-sqlc
---

# Goon Squad Web Application

## Purpose and Source of Truth

Build the community website for the private Goon Squad Fabric Minecraft server hosted through WiseHosting.

Use these documents together:

- `PRODUCT_REQUIREMENTS.md` is canonical for product behaviour, content, visual direction, routes, roles, login, joining, accounts, and administration.
- `AGENTS.md` defines repository-wide engineering and workflow rules.
- This skill defines technical architecture, implementation conventions, phase allocation, dependencies, and exit criteria.

If this skill and `PRODUCT_REQUIREMENTS.md` disagree on product behaviour, follow `PRODUCT_REQUIREMENTS.md` and correct this skill. Do not treat all requirements as current-phase implementation work.

The website should become the central hub for:

- Live Minecraft server information and active players
- The BlueMap world map
- Player profiles and community identity
- Stories and events
- Server history, screenshots, and media
- Discord-authenticated member content
- Join requests and applicant status
- Trusted administration and a manual whitelist workflow
- Later gameplay statistics and narrowly scoped Minecraft integrations

Follow the phased roadmap. Do not introduce infrastructure or protected features before their dependencies and phase require them.

## Product and Experience Guardrails

### Community Archive

Build a handcrafted archive for a long-running shared world, not a generic landing page, gaming template, or SaaS dashboard.

- Use an editorial, vintage world-atlas visual language.
- Use strong typography, structured sections, deliberate borders, restrained shadows, and subtle archival or map texture.
- Prefer mostly sharp or slightly rounded corners.
- Use real server imagery and writing when available.
- Keep placeholders obvious and easy to replace.
- Reuse components without making every section an identical card grid.
- Keep decoration subordinate to content, accessibility, and readability.

Avoid:

- Glowing gradients
- Excessive rounded cards
- Floating panels everywhere
- Huge centred marketing slogans
- Meaningless decoration
- Excessive empty space
- Uniform layouts that erase differences between stories, events, map content, and server status

### Typography and Themes

Explore a distinctive old-style editorial serif for major headings, such as Cormorant Garamond, EB Garamond, Libre Baskerville, or a comparable face. Test the exact font during implementation rather than treating a candidate as final. Use a clean sans-serif for body copy and interface controls.

Start theme exploration with these provisional tokens:

| Role | Light | Dark |
|---|---|---|
| Background | `#E8DFD0` | `#1C1D1D` |
| Surface | `#F4EDE2` | `#292A29` |
| Text | `#29231E` | `#EAE3D8` |
| Accent | `#875637` | `#B87850` |
| Border | `#B9AA96` | `#55504A` |

Light mode should evoke warm beige paper and cognac accents. Dark mode should use charcoal and muted copper or burnt orange. Both must remain one coherent design system. Preserve contrast, keyboard operation, visible focus, meaningful alt text, reduced-motion support, and responsive desktop/mobile behaviour.

### Authentication and Joining

Normal Discord login and requesting Minecraft access are separate product intents.

- `Log In` begins normal Discord OAuth and must never open or submit a join request.
- `Request Access` and `Join` may open the application dialog.
- Application-specific `Continue with Discord` identifies the applicant and resumes the application flow.
- OAuth alone never submits an application.
- Use the roles `Visitor`, `Applicant`, `Member`, and `Admin`.
- Keep account role separate from application status and posting permission.
- Use application states `Pending`, `Approved`, `Rejected`, and `Whitelisted`.
- The owner uses their normal Discord-authenticated account with `Admin`; do not create separate admin authentication.
- Enforce all permissions in Go. Frontend visibility is not authorisation.

# Technology Stack

## Frontend

Use:

- React
- TypeScript
- Vite
- React Router
- TanStack Query
- Tailwind CSS
- shadcn/ui only where an accessible primitive is useful and can be styled to match the editorial system
- React Hook Form
- Zod

Responsibilities:

- Routing and layouts
- Accessible UI components
- API requests and server-state caching
- Form state and client-side validation
- BlueMap embedding and fallback states
- Responsive presentation
- Light and dark theme controls
- Loading, empty, offline, error, and success states

Deploy the frontend to Cloudflare Pages.

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

- Versioned REST API
- Business logic
- PostgreSQL access
- Minecraft server-status queries
- Authentication, authorisation, and sessions
- Distinct normal-login and application OAuth intents
- Join application state transitions
- Manual whitelist workflow support
- Input validation
- Image-upload authorisation
- Integration with BlueMap, Discord, storage, and Minecraft systems
- Rate limiting, timeouts, and request security

Deploy the backend to Fly.io in Sydney.

## Database

Use:

- PostgreSQL
- Neon hosted PostgreSQL in Sydney for production
- `pgx/v5` as the driver
- sqlc for generated database code
- Goose for migrations

Use a local PostgreSQL container during development. Never use production Neon as the default development database.

Use PostgreSQL only for persistent application data. Keep account role, application status, posting permission, and transient server presence distinct. Do not persist routine status checks unless later analytics require history.

## Files and Images

Initially store manually managed, replaceable assets under the frontend static public directory.

In the upload phase, use:

- Cloudflare R2
- Presigned uploads
- PostgreSQL for file metadata and object keys only

Do not store image binaries in PostgreSQL.

## Minecraft Systems

Use:

- WiseHosting for the Minecraft server
- Fabric as the server mod platform
- BlueMap as a Fabric-compatible server mod
- Minecraft server-list status queries through the Go API
- Manual server-console whitelisting for the first join workflow
- Backend RCON or a custom authenticated Fabric-side mod only in a later automation phase

Do not plan Bukkit, Spigot, or Paper plugins. Treat BlueMap, live player data, and whitelist management as separate integrations with separate failure and security boundaries.

## Infrastructure

Use:

- Cloudflare DNS
- Cloudflare Pages
- Fly.io Sydney
- Neon Sydney
- Cloudflare R2 later
- Docker Compose locally
- GitHub
- GitHub Actions

Do not add microservices, Kubernetes, Redis, WebSockets, event buses, or separate public/admin backends without a demonstrated requirement.

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
  |                 +-- Cloudflare R2 later
  |                 +-- Optional RCON or Fabric integration later
  |
  +-- map.goonsquad.example.com
        |
        +-- BlueMap hosted with the Minecraft server
```

The site `/map` route should embed BlueMap when supported and provide an external-link fallback. Before embedding, verify:

- HTTPS is available, potentially through a reverse proxy.
- The host permits iframe embedding.
- Content security policy and browser headers permit the intended parent/child relationship.
- The URL is stable.
- Deep links or camera parameters can target the main settlement.
- A dedicated map subdomain is supported if desired.

Never expose WiseHosting, server-console, RCON, or whitelist-management credentials to the browser.

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
│   │   │   ├── applications/
│   │   │   ├── authentication/
│   │   │   ├── bluemap/
│   │   │   ├── events/
│   │   │   ├── gallery/
│   │   │   ├── players/
│   │   │   ├── server-status/
│   │   │   └── stories/
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
├── .opencode/
│   └── skills/
├── AGENTS.md
├── PRODUCT_REQUIREMENTS.md
├── README.md
├── docker-compose.yml
└── Makefile
```

Organise frontend code primarily by feature. Reuse shared primitives where useful, but do not put all domain components in a global directory or style every domain identically.

The feature tree is the intended domain organisation, not a Phase 0 scaffolding requirement. Create or rename directories only when implementing the owning feature. Earlier empty `announcements`, `builds`, and `members` placeholders do not override the current player, story, and event requirements.

Keep the backend modular without splitting it into microservices.

# Required Routes and Navigation

Required routes:

```text
/
/map
/players
/stories
/stories/:slug
/events
/events/:slug
/account
/admin
```

Add these protected routes in the authentication and member-content phase:

```text
/stories/new
/stories/:slug/edit
/events/new
/events/:slug/edit
```

`/join` is optional and may provide a full-page/shareable alternative to the join dialog. It does not replace the modal requirement.

Primary navigation should directly label Home, Map, Players, Stories, Events, and Join, alongside the Goon Squad logo/name, theme toggle, and contextual login/account control. Mobile navigation may collapse spatially but may not obscure the information architecture behind vague labels.

Rules and server information may live in the Join flow. `/rules` and `/server` may remain supplemental routes if useful, but are not substitutes for required destinations.

# Homepage Composition

The homepage is a community hub with four distinct editorial sections, not a marketing hero followed by uniform cards.

## Opening and Server Overview

Include:

- Logo and Goon Squad name
- Concise server description
- Live online/offline state
- Online player count
- Active player names and heads when available
- Primary `Copy Server IP` action with temporary accessible `Copied` state
- Secondary `Request Access` action opening the join dialog when that phase is implemented

## Featured Settlement

Include a large real or replaceable image, settlement name, coordinates, dimension where helpful, and a short description.

## Embedded World Map

Include a nearly full-width BlueMap embed centred initially near the main settlement when supported, ordinary BlueMap exploration controls, and an `Explore the Full World` link to `/map`. Provide an honest loading, unavailable, blocked-embed, or external-link fallback.

## Community Content

Show the latest two or three stories with image, author, date, title, and excerpt; show upcoming events; and link to all stories and events. Creation and editing belong on protected dedicated forms, never inline on the homepage.

# Backend Conventions

## Request Flow

Use:

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

Handlers decode and validate requests, call application logic, translate errors, and encode responses. Keep substantial business logic outside handlers.

Do not create repository interfaces or abstraction layers that merely wrap sqlc one-for-one. Use focused services where application state transitions, ownership, or external integrations warrant them.

## API Versioning

Use `/api/v1`.

Representative endpoints by phase may include:

```http
GET  /api/v1/health
GET  /api/v1/server/status
GET  /api/v1/players
GET  /api/v1/stories
GET  /api/v1/stories/{slug}
GET  /api/v1/events
GET  /api/v1/events/{slug}
GET  /api/v1/account
```

Do not finalise write endpoint shapes before the owning phase defines role, ownership, status-transition, and validation behaviour.

## API Errors

Return a consistent JSON structure:

```json
{
  "error": {
    "code": "story_not_found",
    "message": "The requested story does not exist."
  }
}
```

Do not expose stack traces, SQL text, credentials, OAuth details, or internal implementation data.

## Authentication and Authorisation

Use Discord OAuth with secure server-side sessions.

Normal login flow:

```text
Existing user selects Log In
    |
    v
Go begins OAuth with login intent and validated return target
    |
    v
Discord callback reaches Go
    |
    v
Go validates state, resolves an existing account, and creates a session
    |
    v
User returns to the originating page
```

Application identification flow:

```text
Visitor begins join form
    |
    v
Visitor selects Continue with Discord
    |
    v
Go begins OAuth with application intent
    |
    v
Go validates identity and returns to the same application context
    |
    v
Visitor reviews and explicitly submits the application
```

- Do not let normal login silently create or submit an application.
- Do not let application OAuth submit without explicit user confirmation.
- Validate OAuth state and return targets.
- Use secure, HTTP-only cookies.
- Do not store OAuth access tokens in browser local storage.
- Add CSRF protection where applicable.
- Enforce account role, posting permission, ownership, application transitions, and admin access in Go.
- Record who creates or edits important content and who changes application state.

Application OAuth may create only the minimum provisional identity needed to resume the form. Successful submission, not OAuth, establishes `Applicant`.

## Application State

Keep application status distinct from role. Initially support:

```text
Pending -> Approved -> Whitelisted
Pending -> Rejected
```

Do not assume that `Approved` means the whitelist command ran. Only an explicit admin action after the server-console step marks `Whitelisted`.

Reapplication, reconsideration, username changes, and the point at which an applicant becomes a member require owner policy before implementation. Model transitions deliberately rather than letting arbitrary client input set status.

## sqlc and Migrations

Generate sqlc code for `pgx/v5`. Keep handwritten SQL under `api/internal/database/queries` and generated code under `api/internal/database/generated`.

- Use Goose for every schema change.
- Keep migrations committed.
- Never modify an already-applied shared or production migration.
- Create a new migration to correct an old migration.
- Make production migration execution explicit.
- Keep development and production connection strings separate.
- Never manually edit generated sqlc files.
- Regenerate sqlc after schema or query changes.

# Frontend Conventions

## Server and Local State

Use TanStack Query for API-backed state such as:

- Server status
- Player directory and profiles
- Stories
- Events
- Current account
- Application status
- Admin application queues
- Gallery data
- Statistics

Use React state for local UI concerns such as:

- Modal visibility
- Mobile navigation
- Theme control state before persistence
- Temporary copy-button feedback
- Unsaved form controls
- BlueMap presentation controls owned by the site rather than BlueMap

Use stable, hierarchical query keys. Invalidate only affected queries after writes.

## Forms and Validation

Use React Hook Form and Zod where useful for form state and client feedback. Independently validate every untrusted value in Go. Client validation is not a security boundary.

For application OAuth continuation, preserve the draft only as narrowly and temporarily as needed. Never include secrets. Restore the dialog and require explicit review and submission after OAuth.

## Content and Components

- Keep story and event creation/editing on dedicated protected pages.
- Do not add homepage inline editing.
- Centralise replaceable server facts and placeholder asset references until persistent administration is justified.
- Use semantic HTML and accessible dialog primitives.
- Avoid adopting a component library's default visual language when it conflicts with the atlas direction.

# Development Environment

Run locally:

```text
React:       http://localhost:5173
Go API:      http://localhost:8080
PostgreSQL:  localhost:5432
BlueMap:     Existing remote or explicitly configured development URL
```

Use Docker Compose for local PostgreSQL. Keep local environment values in ignored environment files, and commit example files containing variable names but no secrets.

# Implementation Phases

## Phase 0: Foundation and Product Planning

### Goal

Establish the frontend-to-backend path, project tooling, and agreed product/architecture plan.

### Deliver

- Canonical requirements, routes, roles, application states, conceptual data model, design direction, and integration plan
- Monorepo
- React, TypeScript, and Vite
- Go application and Chi router
- Environment configuration
- Docker Compose PostgreSQL
- Goose and sqlc configuration
- Structured logging
- Health endpoint
- CORS configuration
- Frontend linting and formatting
- Go formatting, vetting, and tests
- GitHub repository and basic CI

Initial endpoint:

```http
GET /api/v1/health
```

### Database Usage

Set up PostgreSQL, Goose, and sqlc, but do not add application tables or make the health path depend on the database.

### Exit Criteria

- Product, layout, routes, role semantics, login/application separation, and phase placement are documented.
- The React application can call the Go health endpoint.
- Local PostgreSQL starts predictably.
- CI can build both applications.

Documentation work belongs to Phase 0. The documented product features do not.

## Phase 1: Public Website Shell and Design System

### Goal

Create the public editorial shell and homepage structure without pretending later integrations are live.

### Deliver

- Goon Squad branding with replaceable real-content placeholders
- Editorial atlas typography exploration and design tokens
- Coherent light and dark themes
- Responsive main layout and directly labelled navigation for all required public destinations
- Homepage opening/server-overview composition
- `Copy Server IP` with immediate copy and accessible temporary `Copied` state
- Visually distinct `Request Access` and `Log In` affordances; before their owning phases, use an honest unavailable/information state rather than fake OAuth or submission behaviour
- Featured-settlement section
- Reserved nearly full-width map section with an honest placeholder or configured external link until Phase 2
- Static/replaceable story and event preview composition until Phase 3
- Responsive desktop and mobile behaviour
- Accessible focus, navigation, theme control, and content hierarchy
- Shared loading, error, and unavailable presentation primitives

### Routes

Establish route shells needed for the public information architecture without adding fake protected behaviour. Major navigation destinations should become directly discoverable as their usable pages ship.

### Database Usage

Do not use application tables. Keep server address, server description, version text, BlueMap URL, and placeholder content in replaceable configuration or static content. Do not create tables for one server address or map URL.

### Exit Criteria

- The shell and homepage work on desktop and mobile.
- Light and dark themes form one accessible visual system.
- The layout is recognisably a community atlas/archive rather than a generic landing page.
- Copy Server IP works without a server round trip.
- Incomplete map, status, content, login, and request-access behaviour is not presented as operational.

## Phase 2: Live Minecraft Status and BlueMap

### Goal

Connect the public shell to the real Fabric server and BlueMap.

### Backend

Implement:

```http
GET /api/v1/server/status
```

Return a stable public-safe shape containing online state, player count, maximum players when available, version, active player names/UUIDs when exposed, and check time.

- Use a short in-memory cache.
- Do not persist routine checks.
- Distinguish an unavailable player sample from zero active players.
- Never expose server-management credentials.

### Frontend

- Show live online/offline state and online count on the homepage.
- Show currently active Minecraft usernames and player heads when available.
- Provide loading, stale, offline, partial-data, and unavailable states.
- Refetch status at a moderate interval such as approximately 30 seconds.
- Implement `/map` as the larger or full-screen BlueMap experience.
- Embed a nearly full-width BlueMap view on the homepage.
- Target the main settlement initially when BlueMap supports stable deep links or camera configuration.
- Preserve BlueMap zoom, rotation, and exploration.
- Link `Explore the Full World` to `/map`.
- Provide an HTTPS external-link fallback if embedding is blocked.

### Integration Checks

- Confirm the Fabric-compatible BlueMap deployment and version.
- Confirm HTTPS or reverse-proxy configuration.
- Confirm iframe and CSP behaviour.
- Confirm player-list exposure.
- Select and document a player-head provider, caching, fallback, and privacy policy.

### Exit Criteria

- Homepage status fails gracefully when the server is unavailable.
- Active-player information is accurate about data availability.
- The homepage and `/map` provide usable BlueMap exploration or a clear secure fallback.
- No Bukkit, Spigot, or Paper dependency was introduced.

## Phase 3: Persistent Public Community Content

### Goal

Introduce PostgreSQL-backed public players, stories, and events while remaining read-only to public users.

### Initial Persistent Concepts

- Player/member profiles with Minecraft identity
- Stories with slug, title, excerpt/body, author attribution, publication state/date, and timestamps
- Events with slug, title, description, date/time, organiser attribution, publication state, and timestamps
- Optional static image references until the upload phase

Do not conflate player profiles with authenticated Discord users prematurely. Define their eventual relationship so Phase 5 can connect identities safely.

### Public API

```http
GET /api/v1/players
GET /api/v1/players/{username}
GET /api/v1/stories
GET /api/v1/stories/{slug}
GET /api/v1/events
GET /api/v1/events/{slug}
```

### Routes

```text
/players
/stories
/stories/:slug
/events
/events/:slug
```

### Homepage

Replace static previews with the latest two or three published stories and upcoming published events. Preserve loading, empty, and error states. Do not add homepage editing.

### Database Usage

This is the first phase that depends on application tables. Use Goose migrations, handwritten query files, and generated sqlc code. Insert initial content through seed data, SQL, a small trusted CLI, or a trusted database console.

Do not build authentication and the first public data model in the same vertical slice. Protected writes remain Phase 5.

### Exit Criteria

- Public player, story, and event pages read from PostgreSQL through the Go API.
- Homepage feeds show published content only.
- Loading, empty, unavailable, and not-found states are clear.
- Static image references remain easy to replace with Phase 7 media records.

## Phase 4: Production Deployment and Hardening

### Goal

Deploy the complete public read-only product consistently.

### Deliver

- Frontend on Cloudflare Pages
- Go API on Fly.io Sydney
- PostgreSQL on Neon Sydney
- BlueMap remaining with WiseHosting behind HTTPS
- Production and API domains
- Strict production CORS allowlist
- Secure environment variables
- Connection-pool limits
- Request timeouts and panic recovery
- Rate limiting
- Structured logs and consistent API errors
- Automated checks and explicit migration process
- Database backup and recovery awareness

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

- A tested revision deploys without manually copying source files.
- Public pages, status, and map use HTTPS and production-safe cross-origin policy.
- Production secrets and management credentials are absent from frontend assets and Git.

## Phase 5: Discord Authentication and Member Content Management

### Goal

Add secure accounts, roles, posting permissions, and ownership-aware story/event management before any join administration.

### Deliver

- Discord OAuth normal-login intent
- OAuth state and validated return-to handling
- Secure server-side sessions in HTTP-only cookies
- Persistent users and sessions
- Product roles supporting `Applicant`, `Member`, and `Admin`; `Visitor` remains unauthenticated
- Explicit member posting permissions where required
- Connection between Discord account and Minecraft/player profile where policy permits
- Authenticated `/account` with Discord profile, Minecraft username, submitted stories, and submitted events
- Protected dedicated story/event create and edit routes
- Ownership-aware and permission-aware Go write endpoints
- Author/editor audit fields
- Contextual applicant/member/admin account navigation; application status is added in Phase 6

Normal login is for an existing website/community account. Unknown identities must not silently become applicants; direct them clearly to Request Access.

### Protected Routes

```text
/account
/stories/new
/stories/:slug/edit
/events/new
/events/:slug/edit
```

### Security

- Enforce every write and ownership rule in Go.
- Add CSRF protection where applicable.
- Do not store OAuth tokens in local storage.
- Do not rely on hidden controls.
- Do not create a separate owner/admin authentication path.
- Do not add the join-request OAuth intent or admin application workflow until Phase 6.

### Exit Criteria

- Existing members can sign in and return to their originating page.
- Authorised members can create and manage only permitted stories/events through dedicated forms.
- Admin role is attached to the owner's normal Discord identity.
- `/account` works without direct database access.
- Login remains visibly and functionally separate from Request Access.

## Phase 6: Join Requests and Manual Whitelist Administration

### Goal

Add the complete applicant journey and protected manual admin workflow on top of Phase 5 authentication and authorisation.

### Request Access Dialog

Explain:

- Private, whitelisted server status
- Manual review
- Minecraft and Fabric version
- Required client mods, if any
- Important rules
- What happens after submission

Collect:

- Minecraft Java username
- Short introduction or connection to the group
- Explicit rules agreement

Allow a visitor to begin before authentication. Require application-specific `Continue with Discord`, preserve draft input where practical, return to the open dialog, and require explicit review/submission after OAuth.

The dialog may open from homepage Request Access, Join navigation, and other clearly labelled join calls to action. Normal Log In must never open it. `/join` remains an optional full-page/shareable alternative.

### Persistent Concepts

- Join application tied to the authenticated Discord identity
- Submitted Minecraft username and introduction
- Rules agreement evidence appropriate to the product
- `Pending`, `Approved`, `Rejected`, and `Whitelisted` status
- Submission and status-change timestamps
- Admin identity for status changes
- Safeguards against accidental duplicate pending applications

### Account

Extend `/account` with prominent application status and plain-language next steps. Make clear that `Approved` precedes the manual whitelist command and that only `Whitelisted` means the applicant can join.

### Admin Dashboard

Protect `/admin` with backend-enforced `Admin` role. Initially support:

- Pending-request queue
- Approved requests awaiting the manual whitelist step
- Discord identity
- Minecraft username
- Introduction
- Submission date
- Current status
- Approve and reject actions
- Generate and copy `/whitelist add <username>`
- Explicitly mark an approved applicant as whitelisted

Manual workflow:

1. Admin approves.
2. Website generates/copies the command from the validated stored username.
3. Admin runs it in the Minecraft server console.
4. Admin marks the application whitelisted.
5. Applicant sees they can join.

Copying a command must not imply it ran successfully.

### Extensibility

Leave the admin area extendable for story/event moderation, member posting permissions, featured homepage content, server information, and reports. Do not build those extensions without a current requirement.

### Exit Criteria

- Visitors can begin the form and resume after application-specific OAuth.
- OAuth never submits without explicit confirmation.
- Applicants can track clear status from `/account`.
- Only admins can view or change applications.
- Status transitions are validated in Go and auditable.
- The complete whitelist process works manually without RCON or a custom mod.
- Login and Request Access remain distinct in navigation, OAuth intent, and outcome.

## Phase 7: Image Uploads and Gallery

### Goal

Allow authorised members to upload screenshots and attach them to stories, events, profiles, and later featured content.

### Storage

Introduce Cloudflare R2. Store bytes in R2 and file metadata in PostgreSQL.

Preferred flow:

```text
React requests upload authorisation
    |
    v
Go validates user, permission, and metadata
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
Go stores image metadata
```

### Deliver

- File-size limits
- MIME-type validation
- Random object keys
- Alt text
- Image ordering
- Ownership and deletion rules
- Moderation hooks
- Story/event/profile image relationships
- Optional thumbnails based on measured need

### Exit Criteria

- Authorised users upload and manage images safely.
- Public content renders useful alt text and stable fallback states.
- No image bytes are stored in PostgreSQL.

## Phase 8: Rich BlueMap Integration

### Goal

Connect site content to precise world locations after basic BlueMap and community content are stable.

### Deliver

- Story, event, settlement, or featured-location coordinates where useful
- Minecraft dimensions
- `View on map` actions and direct BlueMap links
- Featured locations
- Marker categories
- Website IDs associated with BlueMap marker IDs
- Optional marker synchronisation

Do not begin marker synchronisation until coordinates, deep links, and content ownership work reliably.

### Exit Criteria

- Users can move reliably between site content and the corresponding BlueMap location.
- Broken or unsupported deep links have a usable fallback.

## Phase 9: Minecraft Statistics and Optional Whitelist Automation

### Goal

Add persistent gameplay statistics and, only after the manual process is proven, consider narrowly scoped whitelist automation.

### Statistics

Possible features include playtime, deaths, blocks mined, distance travelled, mob kills, advancements, first join, last seen, weekly activity, and player-count history.

This may require:

- A custom Fabric-side mod
- Secure periodic exports
- Access to server statistics
- An authenticated ingestion endpoint
- Aggregation jobs

Do not expose arbitrary WiseHosting files. Define required questions and charts before storing high-volume raw events. Prefer useful hourly or daily aggregates when appropriate.

### Whitelist Automation

Choose only after confirming WiseHosting capabilities and operational needs:

- Backend RCON with no browser exposure, or
- A small authenticated Fabric-side mod

Require strict admin authorisation, audit logging, command/result distinction, timeout and failure handling, idempotency, and a manual fallback. Do not automate simply because an integration is possible.

### Exit Criteria

- Implemented statistics are accurate enough for public use.
- Any automated whitelist action is backend-only, auditable, failure-aware, and optional.
- Manual whitelisting remains available.

## Phase 10: Optional Community Features

Begin only after the core product is stable and community use demonstrates a need.

Possible features:

- Polls
- Build proposals
- Comments and reactions
- Awards and seasonal records
- Patch notes
- Discord announcement synchronisation
- Notification preferences
- Reports and moderation tooling

Events are not optional; the core event experience belongs to Phases 3 and 5.

# Feature Order

Follow this dependency order unless a concrete requirement justifies changing it:

1. Foundation and product planning
2. Public shell and design system
3. Live server status and BlueMap
4. PostgreSQL-backed public players, stories, and events
5. Production deployment and hardening
6. Discord authentication and member content management
7. Join requests and manual whitelist administration
8. Image uploads
9. Rich BlueMap integration
10. Minecraft statistics and optional whitelist automation
11. Optional community features

# Technology Introduction by Phase

| Technology or capability | Introduce |
|---|---|
| React, Vite, TypeScript | Phase 0 |
| Go and Chi | Phase 0 |
| Docker Compose and local PostgreSQL | Phase 0 |
| Goose and sqlc configuration | Phase 0 |
| TanStack Query | Phase 0 or 1 |
| Editorial design system and themes | Phase 1 |
| BlueMap embedding | Phase 2 |
| Minecraft status and player heads | Phase 2 |
| Database-backed public product data | Phase 3 |
| Cloudflare Pages, Fly.io, Neon production | Phase 4 |
| Discord OAuth and secure sessions | Phase 5 |
| Backend roles, ownership, and posting permissions | Phase 5 |
| Join applications and manual whitelist workflow | Phase 6 |
| Cloudflare R2 | Phase 7 |
| Custom BlueMap markers | Phase 8 |
| Fabric-side statistics integration | Phase 9 |
| Optional backend RCON or Fabric whitelist automation | Phase 9 |

# Explicit Non-Goals for Early Phases

Do not introduce before a demonstrated need and assigned phase:

- Microservices
- Kubernetes
- Redis
- WebSockets
- Event buses
- Bukkit, Spigot, or Paper plugins
- A custom Fabric mod before Phase 9
- Public file uploads before Phase 7
- Automated whitelist management before Phase 9
- Complex role-management screens
- A separate admin authentication system
- Separate public and admin backends
- Generic interfaces around every service
- Repository abstractions that wrap sqlc one-for-one
- Real-time chat
- Direct browser access to PostgreSQL or RCON
- Server-management credentials in frontend code

# Open Decisions

Do not silently resolve the owner decisions listed in `PRODUCT_REQUIREMENTS.md`. In particular, confirm before the owning phase:

- Real server address, Fabric/version/mod/rules content, and server imagery
- Existing-account recognition policy for normal login
- Whitelisted-applicant to member-role policy
- Member posting and publication permissions
- Optional `/join` route
- Theme default and persistence
- Final fonts
- Player-head source and privacy policy
- BlueMap URL, HTTPS, iframe, and deep-link capabilities
- Reapplication and duplicate-request policy
- RCON versus Fabric-side whitelist automation

# Coding and Change Rules

When implementing a feature:

1. Identify the current roadmap phase.
2. Confirm the feature belongs in that phase and its dependencies are complete.
3. Read `PRODUCT_REQUIREMENTS.md` and inspect existing conventions.
4. Prefer the smallest complete vertical slice.
5. Update migrations before generated sqlc code.
6. Run sqlc generation after query or schema changes.
7. Validate inputs in both frontend and backend where relevant.
8. Add loading, empty, error, and success states.
9. Add focused tests for business logic, permissions, transitions, and API behaviour.
10. Run formatters, type checks, tests, and builds before declaring completion.
11. Document new environment variables.
12. Do not silently add infrastructure or resolve an open product decision.
13. Do not alter the architecture or hosting plan without a concrete reason.
14. Keep normal login and application intent distinct in UI, routes, state, and backend handling.

# Definition of Done

A feature is not complete until:

- It follows the current architecture and assigned phase.
- It matches `PRODUCT_REQUIREMENTS.md`.
- It works locally and responsively where relevant.
- Relevant migrations are included.
- Generated sqlc code is current.
- API input/output shapes and state transitions are stable.
- Inputs and permissions are validated in Go.
- Errors are handled consistently.
- The UI includes accessible loading, empty, failure, and success states.
- Focused tests or a clear verification procedure exist.
- Secrets are not committed.
- New environment variables and operational steps are documented.
- The implementation introduces no unjustified later-phase infrastructure.
