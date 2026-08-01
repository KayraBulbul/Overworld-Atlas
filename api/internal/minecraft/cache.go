package minecraft

import (
	"context"
	"sync"
	"time"
)

const staleRetryInterval = 5 * time.Second

type Cache struct {
	status    Status
	expiresAt time.Time
	hasValue  bool
	ttl       time.Duration
	mu        sync.Mutex
	query     func(context.Context, string) (Status, error)
	now       func() time.Time
}

func NewCache(
	ttl time.Duration,
	query func(context.Context, string) (Status, error),
) *Cache {
	return &Cache{
		ttl:   ttl,
		query: query,
		now:   time.Now,
	}
}

func isUsableStatus(status Status) bool {
	return status.State == StateOnline || status.State == StateOffline
}

func (c *Cache) Get(ctx context.Context, address string) (Status, error) {
	c.mu.Lock()
	defer c.mu.Unlock()

	nowFunc := c.now
	if nowFunc == nil {
		nowFunc = time.Now
	}

	now := nowFunc()

	// The cached value is still valid. Preserve whether it is stale
	if c.hasValue && now.Before(c.expiresAt) {
		cached := c.status
		cached.Cached = true

		return cached, nil
	}

	previous := c.status
	hadPrevious := c.hasValue

	status, err := c.query(ctx, address)
	if err != nil {
		if hadPrevious && isUsableStatus(previous) {
			stale := previous
			stale.Cached = true
			stale.Stale = true

			c.status = stale
			c.expiresAt = now.Add(staleRetryInterval)

			return stale, nil
		}

		return Status{}, err
	}

	// QueryStatus represents probe failures as unavailable with no Go error
	// Do not let that replace a previously usable status
	if status.State == StateUnavailable && hadPrevious && isUsableStatus(previous) {
		stale := previous
		stale.Cached = true
		stale.Stale = true

		c.status = stale
		c.expiresAt = now.Add(staleRetryInterval)

		return stale, nil
	}

	// The refresh produced a valid new result, including unavailable when
	// there is no previously usable value
	status.Stale = false
	status.Cached = false

	c.status = status
	c.hasValue = true
	c.expiresAt = now.Add(c.ttl)

	return status, nil
}
