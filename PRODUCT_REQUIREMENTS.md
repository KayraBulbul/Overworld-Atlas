# Goon Squad Website Product Requirements

## Document Status

This document is the canonical product and experience specification for the Goon Squad Minecraft community website. `AGENTS.md` defines repository-wide engineering rules, and `.opencode/skills/goon-squad-webapp/SKILL.md` defines the architecture and phased implementation roadmap.

When the owner changes a requirement, update this document and every corresponding Markdown source of truth, roadmap, or operational document in the same change.

Updating these documents is Phase 0 planning work. The features described here belong to the implementation phases assigned in the roadmap and must not all be treated as Phase 0 deliverables.

The existing HTML mock is rough visual direction only. It is not a final layout or component specification, and its visual imperfections should not be copied without review.

## Product Purpose

The website is the public and member-facing archive for the private, long-running Goon Squad Fabric Minecraft server. It should act as the community hub for:

- Current server information and active players
- The BlueMap world map
- Players and their profiles
- Stories from the world and community
- Upcoming and past events
- A private-server access application
- Member-managed content
- Applicant status and trusted administration

The experience should feel specific to the world and its history, not like a generic marketing page, SaaS dashboard, or interchangeable gaming template.

## Product Principles

1. Present the server as a living community archive rather than a product being sold.
2. Use real server writing, screenshots, map views, and player information whenever available.
3. Make development placeholders obvious and easy to replace.
4. Keep every major public destination immediately discoverable.
5. Keep normal account login and applying for server access visibly and functionally distinct.
6. Enforce every role and write permission in the Go API.
7. Prioritise accessibility, readability, and responsive behaviour over decoration.
8. Reuse components where that improves consistency, but do not force unrelated content into identical cards.
9. Keep the architecture a modular monolith and add integrations only when their phase requires them.
10. Preserve room for visual refinement and usability testing during implementation.

## Audience, Roles, and States

The product uses Discord OAuth for authentication and has four product roles:

| Role | Meaning | Typical access |
|---|---|---|
| Visitor | An unauthenticated public visitor | Public pages, normal login, and starting a join request |
| Applicant | A Discord-authenticated person with a join request | Public pages, account page, and application status |
| Member | An approved community account | Account page and explicitly permitted content-management actions |
| Admin | A trusted member with administrative permission | Member capabilities and the protected admin dashboard |

`Visitor` is an unauthenticated product state and does not need to be stored as a database role. Application status is separate from account role.

Application states are:

- `Pending`
- `Approved`
- `Rejected`
- `Whitelisted`

The site owner uses their ordinary Discord-authenticated account with the `Admin` role. There must not be a separate owner login, admin password, or parallel authentication system.

The exact policy for promoting a whitelisted applicant to `Member` remains an open product decision. Until decided, documentation and implementation must not assume that whitelisting automatically grants member posting permissions.

## Visual Direction

### Character

The implemented Phase 1 public interface is the approved visual baseline. Preserve its layout, homepage section order, navigation order, typography, spacing, and styling unless the owner explicitly requests a redesign. If an older requirement conflicts only with that accepted presentation, update the requirement rather than restyling the approved interface.

Use an editorial, vintage world-atlas aesthetic with:

- Strong typographic hierarchy
- Structured page sections and deliberate borders
- Mostly sharp or only slightly rounded corners
- Restrained shadows
- Subtle paper grain, faded linework, map details, or archival texture
- Decoration tied to the Minecraft world, its map, or its history

Decoration must never reduce text contrast, obscure controls, compete with content, or create motion and visual noise without purpose.

Avoid:

- Glowing gradients
- Excessive rounded cards
- Floating panels throughout the page
- Huge centred marketing slogans
- Meaningless decorative elements
- Excessive empty space
- Repeating the same card treatment for every section
- Generic dashboard or AI-generated landing-page composition

### Typography

Use a distinctive editorial serif display face for major page titles and section headings. It should evoke an old printed atlas, historical journal, or fantasy world archive while remaining readable:

- Elegant and characterful
- Moderately high stroke contrast
- Traditional rather than modern or geometric
- Effective at large display sizes
- Not excessively ornamental

Phase 1 uses Libre Caslon Display for editorial headings and DM Sans for body and interface copy, following the supplied homepage mock. Revisit the choice only if implementation testing finds a material readability, glyph, or performance problem.

Use a clean, highly readable sans-serif face for body copy, navigation, buttons, forms, metadata, and interface labels.

### Themes

Support light and dark modes as two expressions of one design system.

| Role | Light mode | Dark mode |
|---|---|---|
| Background | `#E8DFD0` | `#1C1D1D` |
| Surface | `#F4EDE2` | `#292A29` |
| Text | `#29231E` | `#EAE3D8` |
| Accent | `#875637` | `#B87850` |
| Border | `#B9AA96` | `#55504A` |

These are provisional design tokens, not immutable final values.

- Light mode should resemble warm beige paper with deep brown or cognac accents.
- Dark mode should use charcoal grey with muted copper or burnt-orange accents.
- Theme-dependent texture and imagery must retain sufficient contrast.
- The theme control must be keyboard accessible and expose its current state.
- The default theme is light. Guest theme changes last only for the current rendered application session and reset to light after a page refresh. Persist a preference only for a signed-in account when account-backed preferences are introduced.

### Layout and Accessibility

- Support responsive desktop and mobile layouts.
- Preserve clear heading order, landmarks, focus treatment, and keyboard operation.
- Respect reduced-motion preferences.
- Provide text alternatives for meaningful imagery and player heads.
- Do not encode server status, application status, or validation errors by colour alone.
- Keep decorative texture subtle enough that content remains readable at common zoom levels.
- Prefer purposeful editorial variation between sections over uniform card grids.

## Information Architecture

### Primary Navigation

The primary navigation includes:

- Goon Squad logo and name
- Home
- Players
- Map
- Stories
- Events
- Screenshots
- Join
- Theme toggle
- Login or account controls

Use direct labels in homepage order: Home, Players, Map, Stories, Events, and Screenshots. These labels target their corresponding homepage sections. From another page, they return to the homepage and scroll to that section. Each homepage section provides a clearly labelled action to its expanded page. Do not hide these destinations inside vague dropdowns. On constrained mobile layouts, the navigation may collapse for space, but every destination must remain directly labelled and easy to reach.

The `Join` item may open the request-access dialog rather than navigate to a dedicated route.

Navigation account states:

| State | Controls |
|---|---|
| Logged out | `Join` or `Request Access`, plus a separate `Log In` action |
| Logged-in applicant | Account menu with prominent access to application status |
| Logged-in member | Avatar/account menu |
| Admin | Avatar/account menu with access to the Admin Dashboard |

The normal `Log In` action must never open the request-access dialog.

### Core Routes

| Route | Requirement |
|---|---|
| `/` | Community-hub homepage |
| `/map` | Large or full-screen BlueMap/world-map experience |
| `/players` | Player directory and available activity information |
| `/stories` | Public story listing |
| `/stories/:slug` | Individual public story |
| `/events` | Public upcoming and past event listing |
| `/events/:slug` | Individual public event |
| `/screenshots` | Public screenshot gallery; static and replaceable in Phase 1, storage-backed in Phase 7 |
| `/account` | Authenticated profile, content, and application status |
| `/admin` | Admin-only dashboard |

Authenticated content routes should be added when member content management is introduced:

```text
/stories/new
/stories/:slug/edit
/events/new
/events/:slug/edit
```

Authorisation for these routes and their backing API endpoints is server-enforced. Members may edit only content they own or are otherwise permitted to manage; admins may receive broader permissions.

`/join` is optional. If included, it is a shareable, full-page form of the same join information and application flow. It does not replace the primary request-access dialog requirement.

Rules and server information may be structured sections within the Join experience instead of separate top-level routes. If `/rules` or `/server` routes are retained, they should not displace the required primary navigation destinations.

## Homepage Requirements

The homepage is the server's community hub, not a generic promotional landing page.

Phase 1 may use centralised static preview data to demonstrate layouts and future interactions before their APIs exist. Preview data must remain easy to replace and must not imply that an application was submitted or persisted. Live integrations replace these fixtures in their assigned phases.

### Opening and Server Overview

Include:

- Goon Squad logo and name
- A concise description of the server
- Live online or offline state
- Online player count
- Currently active players when the integration provides them
- Minecraft usernames and player heads
- Primary action: `Copy Server IP`
- Secondary action: `Request Access`

Copying the server IP should happen immediately. The button should briefly change to `Copied` and provide an accessible status announcement before returning to its normal label.

The server address is `51.161.199.235:25584`.

The official Phase 1 logo is `web/public/images/branding/goon-squad-logo.png`.

`Request Access` opens the join-request dialog. In Phase 1 the complete form may be previewed, but its submission action remains disabled and explains that applications are not yet being accepted through the website.

The Phase 1 homepage player preview may show at most four centralised fixture players. Phase 2 replaces the preview with live presence data.

### Featured Settlement

Include:

- A large image or cinematic view of the main settlement
- Settlement name
- Coordinates, including dimension when useful
- A short description

Use real server imagery when available. Any placeholder asset and content must be centralised or otherwise easy to replace.

The Phase 1 featured settlement is Goon Squad Mountain at X `-1129`, Y `119`, Z `1030` in the Overworld. Its short description is "The promised land", and its image is `web/public/images/settlements/featured_settlement.webp`.

### Embedded World Map

Include:

- A large, nearly full-width embedded BlueMap view
- An initial camera position near the main settlement when BlueMap supports a stable deep link or configuration
- Normal BlueMap zooming, rotation, and exploration
- An `Explore the Full World` action linking to `/map`

The dedicated Map page should provide a larger or full-screen exploration experience. The site must offer a useful fallback link when browser security policy or the BlueMap host prevents embedding.

### Community Content

Include:

- The latest two or three stories
- Author, date, title, and excerpt
- Upcoming events
- Clearly labelled links from the story and event sections to `/stories` and `/events`

The approved Phase 1 homepage uses a text-ledger treatment for stories and does not require images in that compact section. Story imagery remains appropriate on expanded story previews and individual stories when real media is available.

Creating and editing content uses dedicated authenticated forms. The homepage must not become an inline content editor.

### Screenshots

Include a curated screenshot preview with dates, contributor names, useful alt text, and a link to `/screenshots`. Phase 1 uses replaceable static assets and metadata. Member uploads, ownership, moderation, and persistent gallery records remain Phase 7 work.

## Public Page Requirements

### Map

- Prioritise map area while retaining enough site navigation to leave the page.
- Embed BlueMap securely when supported, otherwise provide a clear external-map fallback.
- Preserve BlueMap's standard exploration controls.
- Make loading, unavailable, embedding-blocked, and external-link states clear.

### Players

- Provide a discoverable player directory.
- Distinguish persistent member/profile data from transient online activity.
- Show player heads and Minecraft usernames where data and privacy settings permit.
- Handle unavailable active-player lists without implying that no one is online.

### Stories

- Provide a public listing and individual slug-based pages.
- Show author, publication date, title, imagery when available, and readable story content.
- Clearly distinguish drafts from published content in authenticated management views.

### Events

- Provide public listing and individual slug-based pages.
- Separate upcoming and past events where useful.
- Include title, date and time, author or organiser, description, and imagery when available.

### Screenshots

- Provide a responsive gallery with useful alt text, dates, and contributor names.
- Use centralised static entries in Phase 1.
- Replace static entries with authorised, storage-backed media records in Phase 7.

## Authentication Requirements

### Discord OAuth

Discord OAuth is the only website authentication method. The Go API owns the OAuth callback, account lookup, role lookup, secure session, and authorisation decisions.

- Use secure, HTTP-only cookies for sessions.
- Do not store OAuth access tokens in browser local storage.
- Validate OAuth state and any post-authentication return target.
- Return users to the page or application context they came from.
- Use the site owner's normal Discord identity for administration.
- Never treat hidden frontend controls as access control.

### Normal Login

`Log In with Discord` starts the normal Discord OAuth flow directly. A small login-specific transition screen is acceptable only if technically necessary.

Normal login means accessing an existing website or community account. It does not mean applying to join the Minecraft server, and it must not open or submit the request-access dialog.

The OAuth flow should carry an explicit intent so that normal login and application identification cannot be confused. A normal login attempt by an unknown Discord identity should not silently create or submit a join application; the user should receive a clear route to Request Access instead.

The application-specific OAuth intent may establish the minimum provisional authenticated identity needed to finish the form. It must not grant `Applicant`, `Member`, posting, or admin privileges by itself; successful application submission establishes the `Applicant` role.

After successful normal authentication:

- Return the user to their originating page.
- Give members access to `/account`.
- Allow authorised members to create or manage permitted stories and events.
- Show admin controls only to the `Admin` role.

## Request Access

### Dialog Purpose

The request-access modal or dialog is exclusively for applying to join the Minecraft server. It may be opened from:

- The homepage `Request Access` action
- The `Join` navigation item
- Other clearly labelled join calls to action

Do not make every Discord or login-related action open this dialog.

Before Phase 6, the dialog may present the planned fields and concise pending server information as a visual preview, but submission and Discord continuation remain disabled. It must not store a draft or show a successful-submission state. Finalised version, mod, rule, and post-submission guidance is required when Phase 6 enables the application flow, not as a condition of the approved Phase 1 preview.

The dialog should explain:

- The server is private and whitelisted.
- Applications are manually reviewed.
- The supported Minecraft and Fabric version.
- Required client mods, if any.
- Important server rules.
- What happens after submission.

### Application Form

Request:

- Minecraft Java username
- A short introduction or connection to the group
- Explicit agreement to the server rules

Validate all fields in the Go API. Client validation exists for usability only.

### Unauthenticated Applicant Flow

An unauthenticated visitor may begin filling in the form. Before submission:

1. Require `Continue with Discord`.
2. Explain that Discord identifies the applicant and is part of completing the application.
3. Begin an application-specific OAuth intent, distinct from normal navigation login.
4. Return the user to the same open application dialog after OAuth.
5. Preserve entered form information where practical and safe.
6. Require the user to review and submit after returning; OAuth alone must not submit an application.

Temporary draft persistence must avoid secrets and should be scoped narrowly to the application flow. Its exact storage mechanism is an implementation decision.

### Submission Result

After successful submission:

- Show a clear confirmation in the dialog or equivalent flow.
- Explain that review is manual.
- Link to `/account` for application status.
- Establish or retain the authenticated account as an `Applicant` without granting member posting permissions.
- Prevent accidental duplicate pending applications while allowing a clear recovery path for rejected or superseded requests according to the final policy.

## Account Page

`/account` is authenticated and includes:

- Discord profile information
- Minecraft username
- Join-request status and status explanation
- Submitted stories
- Submitted events
- Actions to create, edit, and manage the user's own permitted content

For applicants, application status must be the most prominent account information. `Pending`, `Approved`, `Rejected`, and `Whitelisted` need plain-language explanations and next steps. The page must not imply that `Approved` means the server command has already been run.

## Admin Dashboard

`/admin` is protected by backend-enforced `Admin` authorisation. It initially supports:

- Viewing pending join requests
- Viewing approved requests that still require the manual whitelist step
- Viewing an applicant's Discord identity
- Viewing Minecraft username
- Viewing the introduction
- Viewing submission date
- Viewing current application status
- Approving or rejecting applications
- Generating and copying `/whitelist add <username>`
- Manually marking an approved applicant as whitelisted

Initial whitelist workflow:

1. An admin approves the request.
2. The website generates and copies the whitelist command.
3. The admin runs the command through the Minecraft server console.
4. The admin marks the applicant as whitelisted.
5. The applicant sees in `/account` that they can join.

The command must be generated from the validated stored Minecraft Java username. The dashboard should make the manual boundary explicit and must not claim the command succeeded merely because it was copied.

The dashboard should later be extendable to manage:

- Stories
- Events
- Member posting permissions
- Featured homepage content
- Server information
- Reports or inappropriate content

Automatic whitelist management is not part of the initial admin release.

## Content Management

- Stories and events use dedicated authenticated create and edit forms.
- Member write access is permission-based and enforced in Go.
- Ownership and administrative override rules must be explicit.
- Public pages show only publishable content.
- The system records who created and last edited important content.
- Homepage feature selection can remain manually configured until the admin roadmap phase adds controls.

## Minecraft and BlueMap Integrations

### Fabric Constraint

The Minecraft server uses Fabric. Do not plan around Bukkit, Spigot, or Paper plugins.

- BlueMap should run as a Fabric-compatible server mod.
- Any later custom server-side integration must be Fabric-compatible.
- Generic references to a Minecraft "plugin" in planning documents mean a Fabric-side mod or another explicitly compatible integration, not a Bukkit-family plugin.

### BlueMap

- Treat BlueMap as an external Minecraft integration.
- Embed or link to its web interface.
- Serve it over HTTPS, potentially through a reverse proxy or dedicated map subdomain.
- Verify iframe permissions, content-security policy, browser headers, URL stability, and deep-link support before relying on embedding or initial camera coordinates.
- Keep rich website-to-map markers and location synchronisation for a later phase.

### Live Player Data

- Treat server status, active-player names, and player heads as separate concerns from BlueMap and whitelist management.
- Query public-safe status through the Go API and use a short in-memory cache.
- Do not persist routine status checks unless a later analytics requirement needs history.
- Player-list availability depends on server configuration; provide an honest unavailable state.
- Decide and document the player-head source, caching, fallback, and privacy behaviour before implementation.

### Whitelisting

Begin with the manual admin workflow. Never expose RCON, WiseHosting, server-console, or management credentials to the browser.

Later automation may use:

- RCON through a narrowly scoped Go backend integration, or
- A small authenticated Fabric-side server mod

Choose between these only after the manual workflow is proven and hosting capabilities are confirmed. Automated whitelisting needs audit logging, strict admin authorisation, timeout and failure handling, and a manual fallback.

## Data Planning

No schema is implemented by this requirements update. When their phases begin, plan persistent models for:

- Discord-authenticated users and secure sessions
- Member/player profiles and Minecraft identity
- Simple account roles and posting permissions
- Join applications and application status history or audit fields
- Stories and story authorship
- Events and event authorship
- Images and object metadata in the upload phase
- Featured content configuration only when administration requires it

Keep account role, application status, posting permission, and transient online status as distinct concepts. Use PostgreSQL only for persistent application data and do not store image bytes in PostgreSQL.

## Delivery Phases

The detailed roadmap and exit criteria live in `.opencode/skills/goon-squad-webapp/SKILL.md`. The required allocation is:

| Phase | Product allocation |
|---|---|
| Phase 0 | Requirements, architecture, routes, conceptual data model, roles, design system, integration planning, and the existing foundation tooling |
| Phase 1 | Public layout, editorial visual system, themes, section-scrolling navigation, homepage structure, replaceable static previews and expanded public preview pages, screenshots, a disabled join-form preview, and Copy Server IP |
| Phase 2 | Fabric-compatible BlueMap embedding, `/map`, live server status, active-player data, and player heads |
| Phase 3 | PostgreSQL-backed public player directory, stories, and events with homepage feeds |
| Phase 4 | Production deployment and hardening of the public read-only product |
| Phase 5 | Discord OAuth, sessions, roles, `/account`, posting permissions, and protected story/event forms |
| Phase 6 | Request-access dialog, applicant account state, application tracking, `/admin`, and manual whitelist workflow |
| Phase 7 | Cloudflare R2 image uploads and persistent gallery/media management replacing Phase 1 screenshot fixtures |
| Phase 8 | Rich BlueMap links, locations, markers, and optional synchronisation |
| Phase 9 | Persistent statistics and optional automatic whitelist integration through backend RCON or a Fabric-side mod |
| Phase 10 | Optional community features based on demonstrated use |

Authentication and backend-enforced roles must exist before protected account management, content writes, join administration, or admin actions. Public read-only stories and events may precede authentication; authenticated content management may not.

## Open Product Decisions

The following decisions need owner input before their implementation phase:

1. Minecraft/Fabric version, required client mods, rules, and post-approval instructions.
2. Real story and screenshot media, and the initial BlueMap camera target.
3. How existing accounts are recognised for normal login before someone applies, such as pre-provisioned Discord identities or confirmed Discord server membership.
4. Whether whitelisted applicants automatically become `Member`, require a separate promotion, or receive member status through another process.
5. Which members may create stories and events, whether publication requires review, and whether organiser/co-author roles are needed.
6. Whether `/join` should exist in addition to the dialog.
7. Player-head provider, caching and fallback policy, and whether all member profiles and activity are public.
8. BlueMap production HTTPS/reverse-proxy arrangement, iframe policy, and deep-link capabilities. The current server-hosted URL is `http://51.161.199.235:25674/` and is not production-ready for secure embedding.
9. Whether later whitelist automation should prefer backend RCON or a custom Fabric-side integration after WiseHosting capabilities are verified.
10. Reapplication and duplicate-request policy after rejection or Minecraft username changes.

These are intentionally unresolved. They do not justify choosing additional infrastructure or silently inventing product policy during scaffolding.
