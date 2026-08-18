---
name: overworld-atlas-webapp
description: Guide the architecture, phased implementation, and engineering conventions for the Overworld Atlas Minecraft server website. Use when planning, implementing, reviewing, or extending the React/Vite frontend, Go API, PostgreSQL database, BlueMap integration, Discord authentication, join workflow, media storage, or Minecraft server integrations.
---

# Overworld Atlas Web Application

## Purpose and Source of Truth

Build the community website for the private Overworld Atlas Fabric Minecraft server hosted through WiseHosting.

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

The implemented Phase 1 public interface is the owner-approved visual baseline. Preserve its layout, homepage section order, navigation order, typography, spacing, and styling unless the owner explicitly requests a redesign. When an older presentation requirement conflicts with that accepted interface, update the requirement instead of restyling the implementation.

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

Use Libre Caslon Display for major headings and DM Sans for body copy and interface controls, following the approved homepage mock. Revisit the choice only if implementation testing finds a material readability, glyph, or performance problem.

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
- Treat `Visitor` as unauthenticated and map the owner's informal `player` term to `Member`.
- Keep account role separate from application status and content ownership. The `Member` role grants the standard ability to manage owned community content in the phases where writes exist.
- Use application states `Pending`, `Approved`, `Rejected`, and `Whitelisted`.
- Explicitly marking an application `Whitelisted` promotes the account to `Member` in the same protected operation while preserving the separate application status.
- Members manage their own stories and events after Phase 5 and their own screenshots after Phase 7; admins may manage all community content.
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

Use PostgreSQL only for persistent application data. Keep account role, application status, content ownership, and transient server presence distinct. Do not persist routine status checks unless later analytics require history.

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
  +-- overworldatlas.example.com
  |     |
  |     +-- Cloudflare Pages
  |           |
  |           +-- React + Vite
  |
  +-- api.overworldatlas.example.com
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
  +-- map.overworldatlas.example.com
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
overworld-atlas/
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
├── .agents/
│   └── skills/
├── docs/
│   └── Completed phase reports and learning records
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
/screenshots
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

Primary navigation should directly label Home, Players, Map, Stories, Events, Screenshots, and Join in homepage order, alongside the Overworld Atlas logo/name, theme toggle, and contextual login/account control. The public content labels open `/`, `/players`, `/map`, `/stories`, `/events`, or `/screenshots`. Only the current route is marked active: Home matches `/` exactly, while story and event detail routes keep their parent section active. Clearly labelled actions within each homepage section may also open the corresponding full page. Mobile navigation may collapse spatially but may not obscure the information architecture behind vague labels.

Rules and server information may live in the Join flow. `/rules` and `/server` may remain supplemental routes if useful, but are not substitutes for required destinations.

# Homepage Composition

The homepage is a community hub with four distinct editorial sections, not a marketing hero followed by uniform cards.

## Opening and Server Overview

Include:

- Logo and Overworld Atlas name
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

Show the latest three published stories with author, publication date, title, and excerpt; show the single next published upcoming event; and link to all stories and events. The approved Phase 1 homepage uses a compact text-ledger treatment without story images; expanded previews and individual stories may use imagery when available. Also show a curated screenshot preview with date, contributor, alt text, and a link to `/screenshots`. Creation and editing belong on protected dedicated forms, never inline on the homepage.

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
- Enforce account role, ownership, application transitions, and admin access in Go.
- Record who creates or edits important content and who changes application state.

Application OAuth may create only the minimum provisional identity needed to resume the form. Successful submission, not OAuth, establishes `Applicant`.

## Application State

Keep application status distinct from role. Initially support:

```text
Pending -> Approved -> Whitelisted
Pending -> Rejected
```

Do not assume that `Approved` means the whitelist command ran. Only an explicit admin action after the server-console step marks `Whitelisted`; that protected action also promotes the account to `Member` while keeping application status separate.

Reapplication, reconsideration, and username changes still require owner policy before implementation. Model transitions deliberately rather than letting arbitrary client input set status.

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
- The backend health endpoint and browser-origin CORS contract are verified internally; API connectivity is not rendered in the public React interface.
- Local PostgreSQL starts predictably.
- CI can build both applications.

Documentation work belongs to Phase 0. The documented product features do not.

## Phase 1: Public Website Shell and Design System

### Goal

Create the public editorial shell and homepage structure using centralised static previews for later integrations.

### Deliver

- Overworld Atlas branding with replaceable real-content placeholders
- Editorial atlas typography exploration and design tokens
- Coherent light and dark themes
- Light-by-default guest theme state that resets on refresh; signed-in persistence belongs to Phase 5
- Responsive main layout and directly labelled route navigation for all required public destinations
- Homepage opening/server-overview composition
- `Copy Server IP` with immediate copy and accessible temporary `Copied` state
- Visually distinct `Request Access` and `Log In` affordances
- Accessible join-application preview with disabled Discord continuation and submission until Phase 6
- Featured-settlement section
- Reserved nearly full-width map section with a replaceable static preview until the initial secure BlueMap integration in Phase 4
- Static/replaceable player, story, event, and screenshot previews
- Styled preview pages for `/players`, `/map`, `/stories`, `/events`, and `/screenshots`
- Responsive desktop and mobile behaviour
- Accessible focus, navigation, theme control, and content hierarchy
- Shared loading, error, and unavailable presentation primitives

### Routes

Establish usable static preview pages for the public information architecture without adding protected behaviour. Homepage section actions and primary content navigation link to the expanded public pages.

### Database Usage

Do not use application tables. Keep server address, server description, version text, BlueMap URL, and all preview content in replaceable configuration or static content. Do not create tables for one server address or map URL.

### Exit Criteria

- The shell and homepage work on desktop and mobile.
- Light and dark themes form one accessible visual system.
- Guest theme changes reset to light after refresh.
- The layout is recognisably a community atlas/archive rather than a generic landing page.
- Copy Server IP works without a server round trip.
- Static preview data is centralised and ready to replace with later APIs.
- Join submission and Discord continuation remain visibly disabled and cannot imply that data was saved.

## Phase 2: Live Minecraft Status and Player Presence

### Goal

Connect the public shell to the real Fabric server's public status and active-player sample.

### Backend

Implement:

```http
GET /api/v1/server/status
```

Return a stable public-safe shape containing online state, player count, maximum players when available, version, active player names/UUIDs when exposed, and check time.

- Use a short in-memory cache.
- Preserve a prior usable online or offline result as explicitly stale across a transient unavailable refresh, with a bounded retry window. Return unavailable normally when no usable result exists.
- Do not persist routine checks.
- Distinguish an unavailable player sample from zero active players.
- Never expose server-management credentials.

### Frontend

- Show live online/offline state and online count on the homepage.
- Show at most four positively identified active Minecraft usernames and player heads on the homepage when the status sample exposes them.
- Until Phase 3 provides the persistent directory, make `/players` a confirmed-online-only view driven by the same live status sample.
- Preserve a known online count when the sample is missing or incomplete, and never infer that an absent player is offline.
- Use direct Mineatar face PNG requests keyed by sampled UUID with the skin overlay enabled, provider/browser caching, and a replaceable local Steve-head fallback. Do not add a new backend proxy for this Phase 2 concern.
- Provide loading, stale, offline, partial-data, and unavailable states.
- Refetch healthy online or offline status at a moderate interval such as approximately 30 seconds. Retry a temporary unavailable result or failed API request sooner, such as approximately 5 seconds, so a transient failure does not leave the public interface waiting for the normal poll.

### Integration Checks

- Confirm player-list exposure.
- Keep the documented Mineatar direct-request privacy policy and local fallback behaviour accurate.

### Exit Criteria

- Homepage status fails gracefully when the server is unavailable.
- Active-player information is accurate about data availability.
- No Bukkit, Spigot, or Paper dependency was introduced.

## Phase 3: Persistent Public Community Content

### Goal

Introduce PostgreSQL-backed public players, stories, and events while remaining read-only to public users.

### Initial Persistent Concepts

- Player profiles with an internal identifier, unique Minecraft UUID, and current Minecraft username. Preserve username casing for display, use case-insensitive uniqueness and lookup, and do not make the mutable username the persistent identity.
- Stories with an internal identifier, stable unique slug, non-unique title, excerpt, text body, player-profile author attribution, publication state/date, and creation/edit timestamps.
- Events with an internal identifier, stable unique slug, non-unique title, text description/body, player-profile organiser attribution, start and optional end instants, publication state/date, and creation/edit timestamps.
- Optional static image references until the upload phase

Do not conflate player profiles with authenticated Discord users prematurely. Discord identity, roles, ownership, and posting permissions arrive in Phase 5 and link to the player profile deliberately.

Store event instants in UTC and render them using `Australia/Melbourne`, allowing AEST or AEDT to follow the event date. Derive upcoming/past state from end time, or start time when no end exists; do not store a stale `has_passed` flag.

`is_published` is authoritative for public visibility. The owning Go write path records the current instant when publishing, unpublishing removes the record from public reads, and republishing records a new publication instant. Titles may repeat; slugs are collision-safe route identifiers and remain stable after title edits.

### Public API

```http
GET /api/v1/players
GET /api/v1/players/{username}
GET /api/v1/stories
GET /api/v1/stories/{slug}
GET /api/v1/events
GET /api/v1/events/{slug}
```

List endpoints use bounded page-based pagination defaulting to page 1 with 12 records and allowing at most 50. Invalid or excessive values return the consistent validation-error response. Ordering is deterministic, and responses expose enough metadata for accessible Previous and Next controls. Player lookup and search are case-insensitive. Stories sort by publication time newest first; upcoming events sort by start time soonest first; past events sort by completion time most recent first.

### Routes

```text
/players
/stories
/stories/:slug
/events
/events/:slug
```

### Homepage

Replace static previews with exactly the latest three published stories and the single next published upcoming event. Preserve loading, empty, and error states. Do not add homepage editing.

### Database Usage

This is the first phase that depends on application tables. Use Goose migrations, handwritten query files, and generated sqlc code. Production player, story, and event tables begin empty; do not add a seed/import requirement or manufacture content to make public reads non-empty. Use disposable test fixtures only to verify non-empty behaviour.

The initial schema uses PostgreSQL for structural identity and relationship guarantees: required values, primary keys, foreign keys, case-insensitive username uniqueness, Minecraft UUID uniqueness, and slug uniqueness. Validate cross-field event ranges, publication consistency, and audit timestamps in Go when protected write endpoints are introduced. Public read queries use `is_published` as the visibility boundary; the owning Go write path guarantees publication-time consistency.

Do not build authentication and the first public data model in the same vertical slice. Protected writes remain Phase 5.

Do not add screenshot records or gameplay-statistic tables in this phase. Screenshots remain static until Phase 7, and daily player-statistic snapshots remain Phase 9.

### Exit Criteria

- Public player, story, and event pages read from PostgreSQL through the Go API.
- Homepage feeds show published content only.
- Directory and archive endpoints paginate deterministically, and player username lookup is case-insensitive.
- Loading, empty, unavailable, and not-found states are clear.
- Empty production tables return successful empty directory, archive, and homepage-feed states without requiring operator-loaded content.
- Static image references remain easy to replace with Phase 7 media records.

## Phase 4: Production Deployment, Hardening, and Initial BlueMap Integration

### Goal

Deploy the complete public read-only product consistently and introduce BlueMap once a production-safe HTTPS route exists.

### Deliver

- Frontend on Cloudflare Pages
- Go API on Fly.io Sydney
- PostgreSQL on Neon Sydney
- BlueMap remaining with WiseHosting behind a stable HTTPS route
- Nearly full-width BlueMap embed on the homepage and a larger exploration experience on `/map`
- Standard BlueMap zoom, rotation, and exploration controls
- Initial camera target near Overworld Atlas Mountain when stable deep links or camera configuration support it
- Clear loading, embedding-blocked, unavailable, and secure external-link fallbacks
- Verified iframe headers, site CSP, URL stability, and parent/child browser policy
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
- The homepage and `/map` provide usable BlueMap exploration or a clear secure fallback.
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
- Standard member permission to create, edit, publish, and unpublish owned stories and events; admin override across all content
- Connection between Discord account and Minecraft/player profile where policy permits
- Authenticated `/account` with Discord profile, Minecraft username, submitted stories, and submitted events
- Protected dedicated story/event create and edit routes
- The first real stories and events are created through these protected member/admin forms; Phase 3 does not preload production content.
- Ownership-aware and permission-aware Go write endpoints with server-side body and metadata limits
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
- Members can create, edit, publish, and unpublish only their own stories/events through dedicated forms; admins can manage all stories/events.
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
4. Admin explicitly marks the application whitelisted.
5. The same protected action promotes the account from `Applicant` to `Member`, retains `Whitelisted` as the application status, and creates or links the persistent player profile from the validated Minecraft UUID and current username.
6. The member sees they can join and use member content permissions.

Copying a command must not imply it ran successfully.

### Extensibility

Leave the admin area extendable for story/event moderation, featured homepage content, server information, and reports. Do not build those extensions without a current requirement.

### Exit Criteria

- Visitors can begin the form and resume after application-specific OAuth.
- OAuth never submits without explicit confirmation.
- Applicants can track clear status from `/account`.
- Only admins can view or change applications.
- Status transitions are validated in Go and auditable.
- Marking an application whitelisted atomically preserves the application status, promotes the account role to `Member`, and creates or links the persistent player profile without a separate roster-maintenance action.
- The complete whitelist process works manually without RCON or a custom mod.
- Login and Request Access remain distinct in navigation, OAuth intent, and outcome.

## Phase 7: Image Uploads and Gallery

### Goal

Allow authorised members to upload screenshots and attach them to stories, events, profiles, and later featured content.

Replace the Phase 1 static screenshot fixtures with persistent media records while preserving the public `/screenshots` route and visual system.

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
- Internal media identifier, title, bounded description, upload/edit timestamps, publication state, and publication time
- Alt text
- Image ordering
- Ownership and deletion rules
- Member ownership rules matching stories/events, with admin override
- Paginated public gallery ordered by publication time with accessible Previous and Next controls
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

The current public server-status protocol cannot provide historical per-player statistics. WiseHosting's private Player Manager currently displays playtime, travel, mined/placed blocks, deaths, kills, and related data, but the reviewed documentation does not expose a supported public export API. Do not integrate undocumented panel endpoints.

Vanilla Minecraft records extensive per-player statistics server-side, and Fabric exposes the statistics system. Possible public profile values include playtime, deaths, blocks mined or placed, distance travelled by useful categories, kills, advancements, first join, last seen, weekly activity, and player-count history.

This may require:

- A version-compatible authenticated Fabric exporter
- A supported WiseHosting export if one becomes available
- A verified compatible third-party Fabric statistics mod after security, maintenance, storage, and Minecraft-version review
- Secure periodic exports from server-owned statistic data
- Access to server statistics
- An authenticated ingestion endpoint
- Aggregation jobs

Store statistics in dedicated records keyed to the stable player identity, never as a growing set of columns on the player profile. Begin with one idempotent daily snapshot, record the source check time, and preserve the last usable snapshot after collection failures. Define the exact public values, units, privacy policy, and charts before storing high-volume raw events.

Do not expose arbitrary WiseHosting files or add a second public website/database merely because a third-party mod bundles one. Treat direct SFTP ingestion as a fallback requiring explicit credential, consistency, and operational review rather than the default design.

### Whitelist Automation

Choose only after confirming WiseHosting capabilities and operational needs:

- Backend RCON with no browser exposure, or
- A small authenticated Fabric-side mod

Require strict admin authorisation, audit logging, command/result distinction, timeout and failure handling, idempotency, and a manual fallback. Do not automate simply because an integration is possible.

### Exit Criteria

- Implemented statistics are accurate enough for public use.
- Daily collection is idempotent, failure-aware, and linked to stable player identity.
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
3. Live server status, active-player data, and player heads
4. PostgreSQL-backed public players, stories, and events
5. Production deployment, hardening, and initial secure BlueMap integration
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
| BlueMap embedding | Phase 4 |
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

- Fabric/version/mod/rules content and server imagery
- Existing-account recognition policy for normal login
- Co-author, multiple-organiser, moderation, or publication-review needs beyond the approved single-owner member workflow
- Optional `/join` route
- BlueMap HTTPS, iframe, and deep-link capabilities; the current HTTP URL is not production-ready for embedding
- Exact public Phase 9 statistic set and whether collection uses a custom authenticated Fabric exporter, a supported WiseHosting export, or a verified third-party Fabric mod
- Reapplication and duplicate-request policy
- RCON versus Fabric-side whitelist automation

# Coding and Change Rules

## Owner and Codex Collaboration Boundary

The owner writes all backend production implementation code. This includes Go API code, database schemas and queries, migrations, generated database access code, and server-side integrations.

Codex owns backend automated test implementation and maintenance. Codex may create or edit backend test files, test fixtures, test helpers, and test-only dependencies or configuration needed to verify the owner's implementation. This standing test responsibility does not authorise Codex to change backend production code.

For backend work, Codex is limited to:

- Discussing architecture, behaviour, contracts, risks, and acceptance criteria
- Creating or updating focused Markdown `TODO.md` task briefs for the owner
- Writing and maintaining automated tests for the owner's backend implementation
- Reviewing the owner's implementation with concrete file and line findings
- Running relevant read-only checks and reporting their results

Codex must not create or edit backend production implementation code unless the owner explicitly overrides this boundary for a specific task. A request to review backend code does not authorise Codex to fix it.

Treat backend planning and review as a senior-to-junior mentoring workflow:

- Write each active backend `TODO.md` as a bounded assignment addressed directly to the owner.
- Explain the intended outcome, purpose, prerequisites, ordered responsibilities, architectural constraints, concepts to practise, acceptance criteria, verification, and review handoff.
- State the invariants and questions the owner must resolve without prescribing a line-by-line implementation.
- Do not put backend implementation code, SQL, JSON examples, code-shaped pseudocode, or starter snippets in new task briefs or explanations unless the owner explicitly requests a rare, narrowly scoped example.
- Answer backend questions concept-first. Connect the explanation to the current assignment, then leave the implementation with the owner.
- Review existing backend code through file-and-line findings, behaviour, risks, and test evidence. Do not paste a replacement implementation into the review.
- Assign backend production implementation to the owner and backend automated test implementation to Codex. State the behaviours and boundaries Codex will verify without transferring production-code responsibility.
- Historical completed TODOs may retain earlier contract examples; new and materially rewritten assignments use the mentoring format.

Codex may implement frontend work only after an extensive discussion with the owner covers the intended behaviour, visual treatment, responsive layout, accessibility states, API contract, and testing approach, and the owner approves that direction. Preserve the accepted Phase 1 visual baseline unless the owner explicitly approves a redesign.

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
15. When the owner changes a requirement, update `PRODUCT_REQUIREMENTS.md` and every corresponding Markdown source of truth, roadmap, or operational document in the same change.
16. When a roadmap phase is accepted, create its learning and delivery report under `docs/` before advancing the project status.

## Phase Completion and Learning Record

At the completion of every full roadmap phase, Codex owns a Markdown report named `docs/phase-XX-short-name.md`. Follow the structure and evidence rules in `docs/README.md`.

The report must identify:

- The accepted outcome and final scope boundary
- Frontend work implemented by Codex
- Backend work implemented by the owner
- Shared contracts and integration decisions
- Backend, frontend, and cross-cutting concepts covered
- Verification evidence and unresolved or deferred work
- Evidence-based senior-engineer feedback on the owner's backend work, including demonstrated strengths, a development area, and a concrete next-phase focus

Do not invent contributions when one side had no work. Do not use grades by default. Update the report if acceptance uncovers follow-up work, and link the final report from the `README.md` project status.

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
- A completed roadmap phase has an accepted `docs/` phase report covering delivery, concepts, verification, and owner feedback.
