package minecraft

import (
	"context"
	"sync"
	"time"
)

type Cache struct {
	status    Status
	expiresAt time.Time
	hasValue  bool
	ttl       time.Duration
	mu        sync.Mutex
	query     func(context.Context, string) (Status, error)
}

func NewCache(
	ttl time.Duration,
	query func(context.Context, string) (Status, error),
) *Cache {
	return &Cache{
		ttl:   ttl,
		query: query,
	}
}

func (c *Cache) Get(ctx context.Context, address string) (Status, error) {
	c.mu.Lock()
	defer c.mu.Unlock()

	if c.hasValue && time.Now().Before(c.expiresAt) {
		cached := c.status
		cached.Cached = true
		cached.Stale = false

		return cached, nil
	}

	status, err := c.query(ctx, address)
	if err != nil {
		if c.hasValue {
			stale := c.status
			stale.Cached = true
			stale.Stale = true
			return stale, nil
		}

		return Status{}, err
	}

	status.Stale = false
	status.Cached = false
	c.status = status
	c.hasValue = true
	c.expiresAt = time.Now().Add(c.ttl)

	return c.status, nil
}
