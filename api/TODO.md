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
  Sampled player usernames and UUIDs only when the server exposes them
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
- [x] Add the handler and register `GET /api/v1/server/status` beneath `/api/v1`.
- [x] Keep handler responsibilities narrow: call the status service/client, translate the result, and encode JSON.
- [x] Add structured logs without leaking raw packets, credentials, or unnecessary player data.
- [x] Preserve the existing health route and CORS behaviour.

## Tests

- [x] Unit-test protocol decoding with deterministic byte fixtures; do not require the real Minecraft server.
- [x] Test online status with zero players.
- [x] Test online status with a player sample.
- [x] Test a non-zero player count with no sample.
- [x] Test malformed, truncated, and oversized responses.
- [x] Test connection timeout or upstream failure behaviour.
- [x] Test cache hits, expiry, concurrent callers, and the chosen stale-data policy.
- [x] Test the HTTP route, content type, public response shape, timestamps, and error envelope.
- [x] Confirm CORS still allows the configured frontend origin.

## Accepted Response Contract

Codex reviewed and accepted the initial backend status slice on 1 August 2026. Normal Minecraft reachability outcomes return HTTP `200`; unknown optional values are explicit JSON `null` values. `cached` identifies an unexpired cache hit, while `stale` is reserved for an older cached value returned after a refresh failure. The follow-up reliability finding below supersedes the original decision to cache a transient `unavailable` probe over a previously usable status.

## Follow-up Reliability Finding — 1 August 2026

A refresh can appear to make server status and players unavailable when it lands after the 15-second cache TTL and the resulting Minecraft probe fails transiently. The browser refresh is not the cause: it merely triggers the expired cache path. `QueryStatus` currently converts transport and protocol failures into a successful `Status{State: unavailable}` result with no Go error, so the cache's error-based stale fallback does not run. The unavailable result then replaces the last usable status for a full cache TTL, and the former 30-second frontend polling policy made the failure remain visible even longer.

- [ ] When an expired cache has a prior usable `online` or `offline` result and the refresh produces `unavailable`, return the prior result with `cached: true` and `stale: true` instead of replacing it.
- [ ] Advance or bound the next refresh attempt so requests during an upstream failure do not probe Minecraft continuously.
- [ ] Preserve the existing first-check behaviour: when no usable cached result exists, return the public `unavailable` state normally.
- [ ] Add a deterministic cache test proving an unavailable refresh cannot overwrite a previously usable result and that the stale metadata is correct.
- [ ] Retain the existing HTTP `200` public contract for normal online, offline, and unavailable outcomes.

The frontend now retries a returned `unavailable` state or failed API request after approximately 5 seconds as a recovery measure. That improves the visible recovery time but does not replace the backend cache correction above.

Online with a player sample:

```json
{
  "state": "online",
  "online_players": 2,
  "max_players": 20,
  "player_sample_available": true,
  "players": [
    {
      "username": "MagicGN",
      "uuid": "00000000-0000-0000-0000-000000000001"
    }
  ],
  "version": "26.2",
  "protocol_version": 776,
  "checked_at": "2026-08-01T04:07:17Z",
  "stale": false,
  "cached": false
}
```

Online with a known count but no player sample:

```json
{
  "state": "online",
  "online_players": 5,
  "max_players": 20,
  "player_sample_available": false,
  "players": [],
  "version": "26.2",
  "protocol_version": 776,
  "checked_at": "2026-08-01T04:07:17Z",
  "stale": false,
  "cached": false
}
```

Offline:

```json
{
  "state": "offline",
  "online_players": null,
  "max_players": null,
  "player_sample_available": null,
  "players": null,
  "version": null,
  "protocol_version": null,
  "checked_at": "2026-08-01T04:07:17Z",
  "stale": false,
  "cached": false
}
```

Temporarily unavailable:

```json
{
  "state": "unavailable",
  "online_players": null,
  "max_players": null,
  "player_sample_available": null,
  "players": null,
  "version": null,
  "protocol_version": null,
  "checked_at": "2026-08-01T04:07:17Z",
  "stale": false,
  "cached": false
}
```

Unexpected request-level failures use the shared error envelope:

```json
{
  "error": {
    "code": "server_status_unavailable",
    "message": "error retrieving server status"
  }
}
```

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

Review completed on 1 August 2026. Go formatting, vetting, normal tests, race-enabled tests, and the server build passed. A local black-box check also confirmed the live response, configured-origin CORS headers and preflight, cache metadata, offline mapping, and the bounded unavailable response from a deliberately non-responsive upstream.

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

- [x] Use direct overlay-aware Mineatar face PNG requests keyed by sampled UUID; do not add a Phase 2 backend proxy.
- [x] Document provider/browser caching, direct-request privacy, redundant-alt-text handling, and a local Steve-head fallback.
- [x] Add the owner-supplied Steve-head fallback asset under `web/public/images/players/`.
- [x] Discuss and approve the homepage live-player presentation before Codex implements it.
- [x] Use a confirmed-online-only `/players` view until the Phase 3 database-backed directory replaces it.
