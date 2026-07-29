.PHONY: install web api db-up db-down check frontend-check backend-check

install:
	npm --prefix web install

web:
	npm --prefix web run dev

api:
	go -C api run ./cmd/server

db-up:
	docker compose up -d postgres

db-down:
	docker compose down

check: frontend-check backend-check

frontend-check:
	npm --prefix web run format:check
	npm --prefix web run lint
	npm --prefix web run typecheck
	npm --prefix web run build

backend-check:
	@unformatted="$$(gofmt -l api)"; \
	if [ -n "$$unformatted" ]; then \
		printf '%s\n' 'The following Go files need formatting:' "$$unformatted"; \
		exit 1; \
	fi
	go -C api vet ./...
	go -C api test ./...
	go -C api build -o /tmp/goon-squad-server ./cmd/server
