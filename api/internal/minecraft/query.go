package minecraft

import (
	"context"
	"errors"
	"syscall"
	"time"
)

func QueryStatus(ctx context.Context, address string) (Status, error) {
	status, err := GetStatus(ctx, address)
	if err == nil {
		return status, nil
	}

	state := StateUnavailable

	if errors.Is(err, syscall.ECONNREFUSED) {
		state = StateOffline
	}

	return Status{
		State:     state,
		CheckedAt: time.Now().UTC(),
	}, nil
}
