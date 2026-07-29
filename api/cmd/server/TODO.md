# First Backend Task

Implement the smallest Phase 0 Go server yourself:

1. Create `main.go` in this directory.
2. Read the listen address from `API_ADDR`.
3. Configure a Chi router and structured logging with `log/slog`.
4. Add `GET /api/v1/health` returning `{"status":"ok"}` as JSON.
5. Start the server with sensible HTTP timeouts.
6. Add a focused test for the health route.

Do not connect PostgreSQL to the health route. Database connectivity can be introduced separately after the HTTP path works.
