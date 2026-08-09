# Phase 3 Backend Assignment: Persistent Public Community Content

Status: active backend assignment. The domain-model and first-migration checkpoints are accepted. Continue with the focused Phase 3 read queries and bring their behaviour and public contract to review before handler integration.

## Why I Am Assigning This Work

Phase 2 proved that the site can expose live, transient Minecraft state safely. Phase 3 introduces a different kind of backend responsibility: durable community content whose meaning must remain correct after restarts, deployments, and later authentication work.

Your job is to design and implement the first PostgreSQL-backed public read path for players, stories, and events. The important lesson is not merely how to create tables. It is how to turn product language into durable storage, focused queries, explicit Go validation, and a stable public contract without pulling Phase 5 authentication into the design early.

## Prerequisites

- Read the Phase 3 requirements in `PRODUCT_REQUIREMENTS.md` and `.agents/skills/goon-squad-webapp/SKILL.md` before proposing the model.
- Use `docs/phase-02-live-minecraft-status-and-player-presence.md` as the accepted boundary between transient server presence and persistent community profiles.
- Confirm local PostgreSQL starts through the existing Docker Compose workflow and that development remains pointed at the local database.
- The accepted Goose migrations now create the empty player, event, and story tables. No Phase 3 queries or generated database package exist yet.
- Preserve the accepted domain model and migration boundary while designing the query behaviour and public response fields for the next review checkpoint.

## Expected Outcome

By the end of this assignment, public visitors can read a paginated persistent player directory, published stories, and published events through the Go API. Individual story and event routes return one publishable record or the repository's standard not-found response. The homepage can request exactly the latest three published stories and the single next published upcoming event without knowing anything about the database.

The backend remains read-only to public users. The production tables start empty, and an empty player directory, story archive, event archive, and homepage feed are valid Phase 3 outcomes. There are no production seed/import requirements, browser write endpoints, Discord accounts, sessions, ownership permissions, uploads, or admin tools in this phase.

The required public read endpoints are:

- `GET /api/v1/players`
- `GET /api/v1/players/{username}`
- `GET /api/v1/stories`
- `GET /api/v1/stories/{slug}`
- `GET /api/v1/events`
- `GET /api/v1/events/{slug}`

## Approved Product Direction

These decisions are now settled for the Phase 3 design:

- Give each player profile an internal database identifier and store a unique Minecraft UUID as the stable external identity. Preserve the current username's exact casing for display, but enforce case-insensitive uniqueness and lookup because the username may change.
- Keep the Phase 3 player profile limited to Minecraft identity. Discord identity, account role, application state, posting permissions, and ownership arrive in Phases 5 and 6 and must not be columns on this table.
- Defer gameplay statistics to Phase 9. The current status API cannot provide them. When introduced, daily statistics snapshots belong in dedicated records keyed to the stable player identity rather than extra profile columns.
- Give stories and events generated internal identifiers. Attribute their Phase 3 author or organiser to a persistent player profile; Phase 5 later adds authenticated ownership and editor audit relationships.
- Story and event titles may repeat. Generate a collision-safe unique slug on creation and keep that slug stable when the title changes.
- Store story and event bodies as text. Stories also need an excerpt; events need start and optional end instants.
- Keep creation, edit, publication state, and publication time distinct. Public reads include only published records with a valid publication time. Publishing records the current instant, unpublishing hides the record, and republishing records a new publication instant.
- Store event instants in UTC and present them in `Australia/Melbourne`, using AEST or AEDT according to the date. Derive upcoming/past state from end time, falling back to start time; do not persist `has_passed`.
- Use bounded page-based pagination for players, stories, and events, defaulting to page 1 with 12 records and allowing no more than 50, with enough response metadata for accessible Previous and Next controls. Invalid or excessive values use the repository's consistent validation-error response.
- Sort players case-insensitively by username, stories by publication time newest first, upcoming events by start time soonest first, and past events by completion time most recent first. Every order needs a stable tie-breaker.
- Serve the homepage with the same read model: the latest three published stories and one next published upcoming event, without loading an entire archive.
- Keep screenshots static in Phase 3. Persistent screenshot metadata and R2 uploads remain Phase 7.
- Start the production player, story, and event tables empty. Do not invent or request seed content merely to make the read APIs non-empty.
- Phase 5 protected forms will create stories and events. Phase 6's explicit `Whitelisted` transition will create or link the persistent player profile from the applicant's validated Minecraft UUID and current username; the admin must not perform a separate roster-entry task.

The product role names remain `Visitor`, `Applicant`, `Member`, and `Admin`. The owner's informal `player` role maps to `Member`; roles are not part of the Phase 3 schema.

## Initial Data Policy

You do not need an initial roster, story, event, or attribution package from the owner. Production begins with no rows in these tables. Phase 3 proves the schema, queries, API contract, and empty states without manufacturing community content.

Use narrowly scoped fixtures only in disposable test databases to prove non-empty filtering, ordering, pagination, attribution, and structural uniqueness behaviour. Fixtures are test data, not a production content-loading mechanism. Do not infer or create persistent profiles from the live server-status sample.

## Your Assignment

### 1. Model the Domain Before the Tables

Status: completed and accepted.

Describe each persistent concept in plain language and list its invariants. Pay particular attention to identity boundaries:

- A persistent player profile is not a live presence record.
- A Minecraft identity is not automatically a Discord-authenticated user.
- An author or organiser attribution in Phase 3 is not automatically an ownership permission in Phase 5.
- Publication state is not the same as whether a row exists.
- A mutable username is not the stable player identity.
- Upcoming/past event state is derived from time rather than persisted state.

Bring this model to review before translating it into schema details.

### 2. Design the First Migration

Status: completed and accepted. The three migrations apply and reverse successfully against disposable local PostgreSQL.

Create the smallest schema that fully supports the approved public contract. PostgreSQL owns structural guarantees: primary keys, required values, foreign-key attribution, unique Minecraft identity, case-insensitive username uniqueness, and unique slugs. Cross-field event-range, publication, and audit-time rules are validated in Go when protected write paths arrive. Public read queries must still require both published state and publication time. Include only indexes supported by actual lookup, pagination, filtering, and ordering behaviour, and be ready to explain the query each index supports.

The migration must be reversible in local development and must not modify an already-applied shared migration. Keep image handling to replaceable static references; media records and object storage belong to Phase 7.

### 3. Write Focused Read Queries

Add handwritten queries for the paginated player directory, case-insensitive individual profile lookup, published story archive and slug lookup, published event archives and slug lookup, the three-story homepage feed, and the single next-event homepage feed. Queries must enforce public visibility themselves rather than fetching private rows and relying on the handler to hide them.

Make ordering deterministic. Think through page boundaries, equal usernames ignoring case, equal publication times, equal event times, empty result sets, and records that exist but are not public.

### 4. Generate and Integrate Database Access

Run sqlc after the migration and queries are ready. Treat generated files as output: inspect them to confirm the types and nullability match your model, but never edit them manually.

Connect the generated operations to the Go application using the repository's existing handler flow. Keep HTTP decoding and encoding in handlers; introduce service logic only where it owns a real rule rather than wrapping generated methods one-for-one.

Keep database startup and failure behaviour explicit. The health endpoint must remain independent of PostgreSQL.

### 5. Expose the Public Read Contract

Add the Phase 3 player, story, and event list/detail routes already assigned by the roadmap. Use stable response fields that express public product concepts rather than leaking generated database types. Validate all page, page-size, username, and slug input in Go.

Return only publishable content. Preserve the shared JSON error format, distinguish an empty list from a failed request, and treat a private or missing slug as not found from a public caller's perspective. Do not leak SQL errors, table structure, or internal identifiers the frontend does not need.

Before frontend integration begins, bring me the proposed response fields and representative state descriptions in prose. We will agree on nullability, timestamps, ordering, and not-found behaviour together.

### 6. Prove the Behaviour

Add focused tests at the lowest useful boundary and integration tests where PostgreSQL behaviour matters. Your test plan should cover:

- Migration up and down in a disposable local database
- Required structural relationships and uniqueness rules
- UUID-backed identity, case-preserved display names, and case-insensitive username lookup
- Deterministic list ordering
- Pagination defaults, limits, metadata, and stable page boundaries
- Published versus non-public filtering
- Empty lists
- Existing but non-public slugs returning the public not-found result
- Missing slugs
- Nullable optional fields
- Event boundary behaviour around the chosen current time and timezone policy
- Go validation of event ranges, publication consistency, and audit timestamps when the owning write endpoints arrive
- Homepage limits of exactly three stories and one next event
- Database failure translation without internal detail leakage
- Existing health, server-status, timeout, logging, and CORS behaviour remaining intact

Do not make tests depend on the live Minecraft server or production Neon database.

## Concepts I Expect You to Practise

- Translating product rules into domain invariants
- Choosing deliberately between structural database guarantees and cross-field Go validation
- Separating persistent identity, authentication identity, and transient presence
- Publication filtering as a security and product boundary
- Deterministic ordering and stable public contracts
- Timestamp and timezone semantics
- Migration discipline and generated-code ownership
- Testing PostgreSQL behaviour without coupling tests to production
- Keeping handlers focused and avoiding one-for-one abstraction layers

When you ask for help, tell me which concept is unclear, what you currently believe, and what behaviour you observed. I will help you reason through it without taking the implementation away from you.

## Guardrails

- Do not add authentication, sessions, protected writes, join applications, admin actions, image uploads, R2, BlueMap work, RCON, or a Fabric integration.
- Do not store routine Minecraft status or infer persistent player presence from the public status sample.
- Do not model a player profile as an authenticated user merely to save a later migration.
- Do not add Discord fields, roles, screenshot records, gameplay-statistic columns, schedulers, or a Fabric statistics integration in Phase 3.
- Do not manually edit generated sqlc files.
- Do not point development or tests at production Neon.
- Do not create generic repository interfaces that only mirror sqlc.
- Do not change the accepted Phase 1 frontend visual baseline while enabling the new data.

## Definition of Done

This backend assignment is ready for review when:

- The implementation follows the approved product direction, and any proposed deviation has explicit owner approval.
- Migrations, queries, and generated access code are current and reproducible.
- Public list and detail routes return only the approved fields and publishable records.
- Player, story, and event archives paginate deterministically and return the metadata agreed at the contract checkpoint.
- The homepage queries return at most three latest stories and one next upcoming event.
- Empty, not-found, invalid, and database-failure outcomes follow the agreed contract.
- The health route still does not depend on PostgreSQL.
- Focused tests cover structural guarantees, Go validation where applicable, filtering, ordering, boundary cases, and failure translation.
- Go formatting, vetting, normal tests, race-enabled tests where relevant, and the server build pass.
- Migration and sqlc checks pass against local PostgreSQL.
- New environment or operator steps are documented without secrets.
- No later-phase infrastructure or permissions were introduced.

## What to Bring to Review

Ask Codex for review at two checkpoints.

The first checkpoint accepted the domain model and migrations on 9 August 2026. No production content or roster input was required.

Second, after implementation, bring the focused diff, a short explanation of the decisions you made, migration and generation evidence, test results, and any part you are least confident about. I will review the backend with concrete file-and-line findings and will not replace your implementation.
