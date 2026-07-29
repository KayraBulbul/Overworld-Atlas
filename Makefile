.PHONY: install web db-up db-down check frontend-check backend-check

install:
	npm --prefix web install

web:
	npm --prefix web run dev

db-up:
	docker compose up -d postgres

db-down:
	docker compose down

check: frontend-check backend-check

frontend-check:
	npm --prefix web run lint
	npm --prefix web run typecheck
	npm --prefix web run build

backend-check:
	@if [ -n "$$(go -C api list ./... 2>/dev/null)" ]; then \
		go -C api fmt ./... && \
		go -C api vet ./... && \
		go -C api test ./... && \
		go -C api build ./...; \
	else \
		printf '%s\n' 'Skipping backend checks: no Go packages exist yet.'; \
	fi
