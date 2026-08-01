# Phase 2 Backend TODO: Live Minecraft Status

Owner implementation brief. Codex may review this work, but must not implement or edit the backend code unless the owner explicitly requests a one-off exception.

## Outcome

Add a public, read-only Minecraft status endpoint:

```http
GET /api/v1/server/status
```

The endpoint should query the Fabric server through the Minecraft server-list status protocol, return a stable public-safe response, and shield the server from a status request on every website poll.

Phase 2 must not add database tables, migrations, authentication, RCON, WiseHosting credentials, a Fabric mod, or persistent status history.

## Decide the Response Contract First

Before coding, settle and document one response shape that lets the frontend distinguish:

- Server online
- Server offline
- Status temporarily unavailable
- Zero players online
- A known player count whose player-name sample is unavailable
- Fresh data and cached or stale data

A suitable shape would include:

- A state such as `online`, `offline`, or `unavailable`
- Current and maximum player counts when known
- An explicit player-sample availability flag
- Sampled player usernames and UUIDs only when the server exposes them
- Minecraft version name and protocol when known
- The time the Minecraft server was checked
- An explicit stale or cache indicator if old successful data can be served after a failed refresh

Do not infer an empty player list from a missing sample. Do not expose the server description payload, favicon, internal errors, addresses that are not already public, or any management credentials unless the product explicitly needs them.

Use the repository's consistent JSON error envelope for request-level failures. Agree with the frontend contract before changing a settled response shape.

## Implementation Tasks

- [x] Add environment-backed Minecraft status configuration to `api/.env.example`.
  - Host and port should be independently configurable.
  - Keep the committed local/default value public-safe.
  - Add a bounded query timeout.
- [x] Create a focused Minecraft status client under `api/internal/minecraft/`.
  - Perform the standard server-list status handshake and decode the response safely.
  - Bound packet sizes and reject malformed or unexpectedly large responses.
  - Close connections and honour timeouts on every path.
  - Keep transport/protocol errors distinct from a valid status response.
- [x] Define the public API response separately from the raw Minecraft protocol payload.
  - Return only fields required by Phase 2.
  - Represent unavailable optional data explicitly.
  - Use UTC RFC 3339 timestamps.
- [x] Add a short, concurrency-safe in-memory cache.
  - Use a TTL short enough for the approximately 30-second frontend polling interval.
  - Avoid duplicate simultaneous upstream queries when the cache expires.
  - Decide whether the last successful value may be returned as stale after a refresh failure.
  - Never persist routine status checks.
- [ ] Add the handler and register `GET /api/v1/server/status` beneath `/api/v1`.
- [ ] Keep handler responsibilities narrow: call the status service/client, translate the result, and encode JSON.
- [ ] Add structured logs without leaking raw packets, credentials, or unnecessary player data.
- [ ] Preserve the existing health route and CORS behaviour.

## Tests

- [ ] Unit-test protocol decoding with deterministic byte fixtures; do not require the real Minecraft server.
- [ ] Test online status with zero players.
- [ ] Test online status with a player sample.
- [ ] Test a non-zero player count with no sample.
- [ ] Test malformed, truncated, and oversized responses.
- [ ] Test connection timeout or upstream failure behaviour.
- [ ] Test cache hits, expiry, concurrent callers, and the chosen stale-data policy.
- [ ] Test the HTTP route, content type, public response shape, timestamps, and error envelope.
- [ ] Confirm CORS still allows the configured frontend origin.

## Verification

Run:

```bash
gofmt -w .
go vet ./...
go test ./...
go test -race ./...
go build ./cmd/server
```

Then run the API locally and verify:

```bash
curl --fail --show-error \
  -H 'Origin: http://localhost:5173' \
  http://localhost:8080/api/v1/server/status
```

Before handing the backend to frontend work, ask Codex for a review of the diff and the final JSON examples for online, offline, unavailable, and missing-player-sample cases.

## Current Integration Facts to Recheck

Observed on 30 July 2026:

- `51.161.199.235:25584` accepted a TCP connection and answered a server-list status request.
- The response reported Minecraft `26.2`, protocol `776`, maximum players `20`, and zero online players at the time of the check.
- No player sample was present, which is valid with zero online players and does not yet prove how the server behaves when populated.

These observations are diagnostic only. Do not make tests depend on the live server or treat them as permanent product configuration.

## Separate Phase 2 Integration Work

BlueMap is reachable at `http://51.161.199.235:25674/` and reported BlueMap `5.22` on 30 July 2026, but HTTPS negotiation failed. Before the frontend embed can be approved:

- [ ] Put BlueMap behind a stable HTTPS URL, preferably the planned map subdomain or another owner-approved endpoint.
- [ ] Verify iframe embedding headers and the final site's Content Security Policy.
- [ ] Verify stable deep-link or initial-camera support for Goon Squad Mountain at `-1129, 119, 1030` in the Overworld.
- [ ] Decide the secure external-link fallback.
- [ ] Discuss and approve the frontend map experience before Codex implements it.

Player heads are also a separate decision:

- [ ] Choose the provider or self-hosted approach.
- [ ] Decide caching, fallback artwork, alt text, and privacy behaviour.
- [ ] Discuss and approve the live-player presentation before Codex implements it.
