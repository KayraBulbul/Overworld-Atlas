# Phase 2 Report: Live Minecraft Status and Player Presence

Status: complete and accepted on 1 August 2026.

## Outcome and Scope Boundary

Phase 2 replaced static server-presence previews with a public-safe live Minecraft status path. The Go API now queries the Fabric server through the standard server-list status protocol, protects the upstream with a short concurrency-safe cache, and exposes a stable read-only response. The frontend presents live server state and only positively identified sampled players, with explicit loading, offline, unavailable, partial-data, zero-player, and stale states.

The phase did not add PostgreSQL application data, authentication, writes, RCON, WiseHosting management access, a Fabric-side mod, or persistent status history. BlueMap remained a secure static fallback because the available endpoint did not yet provide the HTTPS and embedding policy required for a production browser integration; that work moved to Phase 4.

## Frontend Work Implemented by Codex

- Added a runtime-validated server-status client and a reusable TanStack Query hook.
- Applied a moderate healthy polling interval and a shorter retry interval for unavailable responses or failed requests.
- Centralised the translation from nullable API data into visitor-facing states instead of spreading response checks throughout page components.
- Replaced the homepage's fixture status and players while preserving the accepted Phase 1 composition and styling.
- Reworked `/players` as a temporary confirmed-online-only view and avoided labelling absent players as offline.
- Limited the homepage strip to four positively identified players while preserving the authoritative online count.
- Added direct UUID-based Mineatar faces with the overlay layer, redundant-alt-text handling, and a one-way local Steve-head fallback.
- Made primary navigation route-aware and improved the compact navigation's accessibility and responsive treatment.
- Added focused tests for parsing, presentation states, polling options, player caps, head fallback, homepage integration, navigation, and the player page.

## Backend Work Implemented by the Owner

- Built the Minecraft protocol work incrementally, including bounded integer, string, packet, handshake, response-query, and decoding responsibilities.
- Distinguished valid online and offline results from transport, protocol, and temporarily unavailable outcomes.
- Applied connection and socket I/O timeouts so an upstream server cannot hold the API request indefinitely.
- Defined a public response separate from the raw Minecraft payload and omitted internal errors, packets, management data, and unnecessary fields.
- Added a concurrency-safe in-memory cache with a short freshness window and duplicate-query protection.
- Added the public handler, route, configuration, CORS compatibility, structured logging, and shared error-envelope behaviour.
- Covered online, offline, unavailable, malformed, truncated, oversized, timeout, caching, concurrency, route, and response cases with deterministic tests.
- Diagnosed and fixed the follow-up cache case where a temporarily unavailable value was a valid domain result rather than a Go error, which had allowed it to replace a prior usable status. The corrected policy serves the prior result as stale for a bounded retry window.

## Shared Contracts and Decisions

- Online, offline, and unavailable are distinct public states.
- Unknown optional values remain unknown rather than being converted to zero or an empty list.
- Player-sample availability is independent of the known online count.
- Absence from the sample is never evidence that a player is offline.
- Routine status checks remain in memory and are not written to PostgreSQL.
- A previously usable result may be served as explicitly stale after a transient unavailable refresh, but a first-ever unavailable check remains unavailable.
- The browser requests player heads directly from Mineatar. The accepted privacy tradeoff and local fallback are documented.
- BlueMap integration waits for a stable HTTPS route, verified iframe policy, and a secure external fallback.

## Concepts Covered

### Backend

- Binary protocol framing and bounded decoding of untrusted network input
- Separation between transport errors, protocol errors, and valid domain outcomes
- Deadlines across connection establishment and subsequent socket I/O
- Public data-transfer contracts separated from raw upstream payloads
- Concurrency-safe caching, freshness, stale fallback, and retry windows
- Deterministic tests for network protocol and time-dependent cache behaviour
- Structured logging and error translation without leaking internals

### Frontend

- TanStack Query ownership of remote server state and adaptive refetch timing
- Runtime validation at the API boundary
- Presentation modelling for nullable and partial server data
- Accessible status text, restrained background updates, and non-duplicative image alternatives
- Image-provider failure recovery without loops
- Preserving a visual baseline while replacing fixtures with live data

### Cross-Cutting

- Contract-first integration between Go and React
- Honest representation of incomplete data
- Phase boundaries as an architectural control
- Privacy and failure-mode decisions for third-party player images
- Verification that combines deterministic automation with a bounded live smoke check

## Verification Evidence

- Go formatting, vetting, normal tests, race-enabled tests, and the server build passed.
- The recorded backend suite contained 75 passing test and subtest events.
- One hundred repeated executions of the unavailable-refresh regression test passed.
- A local black-box check confirmed the live response, configured-origin CORS behaviour, preflight handling, cache metadata, offline mapping, and bounded unavailable behaviour.
- Frontend formatting, linting, type checking, all 39 tests, and the production build passed.
- Desktop and 390-pixel mobile layouts were checked in light and dark themes, including zero-player and unavailable states without horizontal overflow.

## Senior Engineer Report on the Owner

### Strengths Demonstrated

You decomposed an unfamiliar binary protocol into small, reviewable responsibilities and commits before composing the full query path. That is good engineering practice: it reduced the number of unknowns in each step and made malformed-input behaviour testable without relying on the live Minecraft server.

Your strongest work in this phase was defensive backend thinking. The bounded decoders, packet limits, I/O deadlines, error classification, deterministic fixtures, concurrency checks, and race-enabled verification show that you treated the Minecraft server as an unreliable external system rather than a trusted local function.

You also handled the cache follow-up well. The first policy had a subtle mismatch: temporarily unavailable was represented as a valid domain result, while stale fallback originally reacted to Go errors. Once that was identified, you corrected the state transition, added a focused regression test, and verified it repeatedly. Responding to a concrete failure by fixing the model and preserving it with a test is exactly the habit I want you to carry forward.

Finally, you respected the scope boundary. Phase 2 did not grow into database persistence, RCON, a custom mod, or BlueMap infrastructure simply because those systems were nearby.

### Development Focus

The main opportunity is to define state machines and invariants earlier, before implementation details settle. The cache bug was not primarily a syntax problem; it came from two different meanings of failure living on separate control paths. For future work, write down the meaningful states, transitions, and replacement rules first, including whether each outcome is an error or a valid value. That exercise should happen before you choose function return shapes or cache behaviour.

Phase 3 raises the same challenge in a more durable form. Focus on explaining the domain in plain language before writing migrations: what makes content public, which identities are distinct, what the database must prevent, what ordering is guaranteed, and how time affects event visibility. If you can defend those invariants before showing the schema, the SQL and handlers will become implementation details rather than the place where product rules are accidentally invented.

### Assessment Limits

This report is based on the committed backend sequence, accepted review findings, test evidence, and documented follow-up. It does not assess unrecorded reasoning or work that was not presented for review.

## Deferred Work

- PostgreSQL-backed player profiles, stories, and events move to Phase 3.
- Production domains, deployment hardening, and the first secure BlueMap embed move to Phase 4.
- Authentication, ownership, protected writes, applications, admin work, uploads, persistent statistics, and whitelist automation remain in their assigned later phases.
