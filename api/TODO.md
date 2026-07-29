# Backend Scaffold

The backend is intentionally limited to directories and tool configuration. There are no handlers, services, database queries, migrations, or application logic yet.

The first implementation task is described in `cmd/server/TODO.md`.

## Directory responsibilities

- `cmd/server`: application entry point and dependency wiring
- `internal/auth`: Discord OAuth, sessions, roles, and distinct login/application intents in later phases
- `internal/config`: environment configuration
- `internal/database`: migrations, handwritten queries, and generated sqlc code
- `internal/handlers`: HTTP request and response handling
- `internal/middleware`: HTTP middleware
- `internal/minecraft`: Fabric-compatible BlueMap, server status, and later whitelist integrations
- `internal/models`: shared application models when needed
- `internal/services`: substantial business logic when needed
- `internal/storage`: object storage integration in a later phase
