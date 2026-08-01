# Phase 3 Backend Assignment: Persistent Public Community Content

Status: active design assignment. Do not begin the first migration until the product decisions below are settled.

## Why I Am Assigning This Work

Phase 2 proved that the site can expose live, transient Minecraft state safely. Phase 3 introduces a different kind of backend responsibility: durable community content whose meaning must remain correct after restarts, deployments, and later authentication work.

Your job is to design and implement the first PostgreSQL-backed public read path for players, stories, and events. The important lesson is not merely how to create tables. It is how to turn product language into durable constraints, focused queries, and a stable public contract without pulling Phase 5 authentication into the design early.

## Expected Outcome

By the end of this assignment, public visitors can read a persistent player directory, published stories, and published events through the Go API. Individual story and event routes return one publishable record or the repository's standard not-found response. The homepage can request the latest published stories and relevant upcoming events without knowing anything about the database.

The backend remains read-only to public users. Initial trusted content may be loaded through an agreed seed or operator workflow, but there are no browser write endpoints, Discord accounts, sessions, ownership permissions, uploads, or admin tools in this phase.

## Decisions to Bring Back Before Implementation

Write down your recommendation and reasoning for each item. I want to review the model with you before you create the migration.

- Confirm the initial real player roster and which profile fields are public.
- Define the minimum public fields for players, stories, and events. Separate a field the product needs now from one that is only imagined for a later phase.
- Decide how author and organiser attribution works before authenticated user records exist. Leave a deliberate path for Phase 5 without pretending the two identities are already the same.
- Define publication semantics for stories and events, including what makes a record visible and how publication time differs from creation time.
- Decide how slugs are created, kept unique, and treated when a title changes.
- Define event time semantics, including the stored instant, the display timezone expectation, and what qualifies an event as upcoming or past.
- Decide whether the first list endpoints need pagination. If you believe they do not, state the expected data size and the point at which you would add it.
- Choose the trusted initial-content workflow and explain why it is appropriate for a read-only phase.

Do not resolve privacy, roster, or authorship policy silently. These are product decisions, not database implementation details.

## Your Assignment

### 1. Model the Domain Before the Tables

Describe each persistent concept in plain language and list its invariants. Pay particular attention to identity boundaries:

- A persistent player profile is not a live presence record.
- A Minecraft identity is not automatically a Discord-authenticated user.
- An author or organiser attribution in Phase 3 is not automatically an ownership permission in Phase 5.
- Publication state is not the same as whether a row exists.

Bring this model to review before translating it into schema details.

### 2. Design the First Migration

Create the smallest schema that fully supports the approved public contract. Use database constraints for facts that must always be true, not only application validation. Include the indexes required by the actual list and lookup behaviour, and be ready to explain what query each index supports.

The migration must be reversible in local development and must not modify an already-applied shared migration. Keep image handling to replaceable static references; media records and object storage belong to Phase 7.

### 3. Write Focused Read Queries

Add handwritten queries for the approved player directory, individual public profile lookup if retained, published story list and slug lookup, and published event list and slug lookup. Queries must enforce public visibility themselves rather than fetching private rows and relying on the handler to hide them.

Make ordering deterministic. Think through equal publication times, equal event times, empty result sets, and records that exist but are not public.

### 4. Generate and Integrate Database Access

Run sqlc after the migration and queries are ready. Treat generated files as output: inspect them to confirm the types and nullability match your model, but never edit them manually.

Connect the generated operations to the Go application using the repository's existing handler flow. Keep HTTP decoding and encoding in handlers; introduce service logic only where it owns a real rule rather than wrapping generated methods one-for-one.

Keep database startup and failure behaviour explicit. The health endpoint must remain independent of PostgreSQL.

### 5. Expose the Public Read Contract

Add the Phase 3 player, story, and event list/detail routes already assigned by the roadmap. Use stable response fields that express public product concepts rather than leaking generated database types.

Return only publishable content. Preserve the shared JSON error format, distinguish an empty list from a failed request, and treat a private or missing slug as not found from a public caller's perspective. Do not leak SQL errors, table structure, or internal identifiers the frontend does not need.

Before frontend integration begins, bring me the proposed response fields and representative state descriptions in prose. We will agree on nullability, timestamps, ordering, and not-found behaviour together.

### 6. Prove the Behaviour

Add focused tests at the lowest useful boundary and integration tests where PostgreSQL behaviour matters. Your test plan should cover:

- Migration up and down in a disposable local database
- Required constraints and uniqueness rules
- Deterministic list ordering
- Published versus non-public filtering
- Empty lists
- Existing but non-public slugs returning the public not-found result
- Missing slugs
- Nullable optional fields
- Event boundary behaviour around the chosen current time and timezone policy
- Database failure translation without internal detail leakage
- Existing health, server-status, timeout, logging, and CORS behaviour remaining intact

Do not make tests depend on the live Minecraft server or production Neon database.

## Concepts I Expect You to Practise

- Translating product rules into domain invariants
- Choosing database constraints instead of relying only on application checks
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
- Do not manually edit generated sqlc files.
- Do not point development or tests at production Neon.
- Do not create generic repository interfaces that only mirror sqlc.
- Do not change the accepted Phase 1 frontend visual baseline while enabling the new data.

## Definition of Done

This backend assignment is ready for review when:

- The unresolved product decisions have explicit owner-approved answers.
- Migrations, queries, and generated access code are current and reproducible.
- Public list and detail routes return only the approved fields and publishable records.
- Empty, not-found, invalid, and database-failure outcomes follow the agreed contract.
- The health route still does not depend on PostgreSQL.
- Focused tests cover constraints, filtering, ordering, boundary cases, and failure translation.
- Go formatting, vetting, normal tests, race-enabled tests where relevant, and the server build pass.
- Migration and sqlc checks pass against local PostgreSQL.
- New environment or operator steps are documented without secrets.
- No later-phase infrastructure or permissions were introduced.

## What to Bring to Review

Ask Codex for review at two checkpoints.

First, before implementation, bring your domain model, unresolved decisions, proposed constraints, query behaviours, and public response fields in prose.

Second, after implementation, bring the focused diff, a short explanation of the decisions you made, migration and generation evidence, test results, and any part you are least confident about. I will review the backend with concrete file-and-line findings and will not replace your implementation.
