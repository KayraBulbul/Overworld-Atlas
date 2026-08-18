# Phase 2 Frontend TODO: Live Server Status and Player Heads

Status: complete and accepted on 1 August 2026.

Completed implementation brief for the approved Phase 2 live-status and player-presence slice. Preserve the accepted Phase 1 layout and styling. The initial secure BlueMap experience is allocated to Phase 4 and does not block Phase 2 completion.

## Implemented Scope

- Consume `GET /api/v1/server/status` through TanStack Query using `VITE_API_BASE_URL`.
- Poll online or offline status approximately every 30 seconds, retry a temporary unavailable result or failed API request after approximately 5 seconds, and refetch when the window regains focus.
- Replace the homepage's static status label, count, four fixture players, and Phase 1 status disclaimer with live data.
- Replace the Phase 1 `/players` fixtures with a confirmed-online-only view using the same status query. The Phase 3 database-backed directory will replace this temporary scope.
- Show no more than four positively identified sampled players, even when the reported online count is higher.
- Render overlay-aware player-head portraits from `https://api.mineatar.io/face/{uuid}?scale=8&overlay=true`.
- Fall back on image failure to the supplied `/images/players/steve-head.png` asset.
- Keep the visible username adjacent to each head. Give the image an empty alternative in that composition so the username is not announced twice.
- Keep Copy Server IP and Request Access behaviour unchanged.

Do not add a player-head backend endpoint, database persistence, WebSockets, a new status protocol, or BlueMap work to this slice.

## Accepted API Contract

Use the accepted decisions and verification record in `docs/phase-02-live-minecraft-status-and-player-presence.md`. The frontend must preserve these distinctions:

| Response condition                  | Presentation                                                                                        |
| ----------------------------------- | --------------------------------------------------------------------------------------------------- |
| Initial request                     | Stable loading treatment inside the existing status/player areas; do not replace the whole homepage |
| `online`, count `0`                 | `Online · 0/{max} players` when maximum is known, plus `No one is online right now.`                |
| `online`, sample available          | Show the known online count and up to four sampled usernames/heads                                  |
| `online`, count above sampled names | Keep the reported count; the strip remains limited to the sampled players available, up to four     |
| `online`, sample unavailable        | Keep the known count and say that player names are not available; do not say nobody is online       |
| `offline`                           | Show `Offline` and explain that live player information is unavailable while the server is offline  |
| `unavailable` or request failure    | Show `Status unavailable` without presenting the server as offline                                  |
| `stale: true`                       | Keep the represented state but visibly qualify it and show the last checked time                    |
| ordinary `cached: true`             | Render the normal state; do not expose cache implementation metadata to visitors                    |

Unknown maximum counts should not produce text such as `0/null`. Use a count-only phrase when `max_players` is `null`.

## Frontend Structure

- Add a focused server-status API client and public TypeScript response types under the frontend server-status feature.
- Add a stable TanStack Query key and a reusable status query hook.
- Keep response-to-copy/presentation decisions in focused feature code rather than spreading nullable-field checks throughout `HomePage`.
- Reuse the existing homepage markup and Tailwind style registry, extending it only where the accepted states require it.
- Keep the local fallback asset path centralised and replaceable.

## Accessibility and Privacy

- Status must be conveyed with text as well as the existing visual pip.
- Do not announce every background poll through an aggressive live region. Announce only a material user-relevant change if testing shows an announcement is useful.
- Player-head requests go directly from the visitor's browser to Mineatar. The provider therefore receives ordinary request metadata and the requested player identifier; this is the accepted Phase 2 tradeoff.
- A head beside its visible username uses `alt=""`; a head shown without an adjacent identity in future work will need meaningful alternative text.
- Image failure must settle on the local fallback without an error loop.

## Tests and Verification

- Test successful online rendering with a sample and verify the strip is capped at four.
- Test zero online players.
- Test a known non-zero count with no sample.
- Test an incomplete sample whose size is lower than `online_players`.
- Test offline, unavailable, request error, stale, and cached responses.
- Test unknown nullable counts and maximums.
- Test head URL construction and one-way fallback to the local Steve asset.
- Test normal and unavailable polling/refetch options without relying on the real Minecraft server or Mineatar.
- Confirm desktop and mobile layouts, keyboard navigation, light/dark themes, and no layout collapse during loading.
- Run `npm --prefix web run format:check`, `lint`, `typecheck`, `test`, and `build`.

## Completion Record

- [x] Added a runtime-validated status API client and reusable TanStack Query hook.
- [x] Added central presentation logic for loading, online, offline, unavailable, stale, cached, zero-player, missing-sample, and nullable-count states.
- [x] Replaced the homepage fixture status and fixture players with live status data and a four-player confirmed-sample strip.
- [x] Replaced `/players` fixture profiles with the temporary confirmed-online-only presentation.
- [x] Added direct UUID-based, overlay-aware Mineatar face images with a one-way local Steve fallback.
- [x] Reworked the compact navigation into an opaque, bordered two-column atlas panel with an accessible open/close control and Escape dismissal.
- [x] Changed primary navigation from homepage auto-scroll links to full public routes with an exact Home state and route-aware active styling.
- [x] Added automated coverage for parsing, status presentation, polling, player-head fallback, homepage integration, and the player page.
- [x] Verified the approved layout at desktop and 390-pixel mobile widths in light and dark themes, including zero-player and unavailable states with no horizontal overflow.
- [x] Passed formatting, linting, type checking, all 39 frontend tests, and the production build on 1 August 2026.

## Locked Player Scope

- [x] Owner supplied `web/public/images/players/steve-head.png`.
- [x] `/players` shows confirmed-online players only until Phase 3.
- [x] The status sample is never used to label absent people offline.

## Deferred Phase 4 BlueMap Work

Keep the existing static map preview and secure-integration-pending `/map` state until Phase 4 gives BlueMap a stable HTTPS URL. Caddy or Nginx remains the preferred reverse-proxy route if WiseHosting provides a viable process and HTTPS port; Cloudflare Tunnel or a separately hosted proxy remains a fallback. Recheck iframe headers, site CSP, stable map URL, and the Overworld Atlas Mountain camera target before embedding.
