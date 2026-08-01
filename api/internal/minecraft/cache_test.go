package minecraft

import (
	"context"
	"errors"
	"slices"
	"sync"
	"testing"
	"time"
)

func TestCacheReturnsCachedStatus(t *testing.T) {
	calls := 0

	query := func(ctx context.Context, address string) (Status, error) {
		calls++
		onlinePlayers := 10

		return Status{
			State:         StateOnline,
			OnlinePlayers: &onlinePlayers,
			Players: []Player{
				{
					Username: "MagicGN",
					UUID:     "testUUID",
				},
				{
					Username: "Zings",
					UUID:     "testUUID",
				},
			},
		}, nil
	}

	cache := NewCache(time.Minute, query)

	first, err := cache.Get(context.Background(), "localhost:25565")
	if err != nil {
		t.Fatalf("first Get() error: %v", err)
	}

	second, err := cache.Get(context.Background(), "localhost:25565")
	if err != nil {
		t.Fatalf("second Get() error: %v", err)
	}

	if calls != 1 {
		t.Fatalf("query calls: %d, want 1", calls)
	}

	if first.State != second.State {
		t.Fatalf("cached state: %v, want %v", second.State, first.State)
	}

	if first.OnlinePlayers != second.OnlinePlayers {
		t.Fatalf("cached OnlinePlayers: %v, want %v", second.OnlinePlayers, first.OnlinePlayers)
	}

	if !slices.Equal(first.Players, second.Players) {
		t.Fatalf("cached players differ from original")
	}

	if first.Cached {
		t.Fatal("first.Cached = true, want false")
	}

	if !second.Cached {
		t.Fatal("second.Cached = false, want true")
	}
}

func TestCacheRefreshesAfterExpiry(t *testing.T) {
	calls := 0

	query := func(ctx context.Context, address string) (Status, error) {
		calls++

		onlinePlayers := calls

		return Status{
			State:         StateOnline,
			OnlinePlayers: &onlinePlayers,
		}, nil
	}

	cache := NewCache(10*time.Millisecond, query)

	first, err := cache.Get(context.Background(), "localhost:25565")
	if err != nil {
		t.Fatalf("first Get() error: %v", err)
	}

	time.Sleep(20 * time.Millisecond)

	second, err := cache.Get(context.Background(), "localhost:25565")
	if err != nil {
		t.Fatalf("second Get() error: %v", err)
	}

	if calls != 2 {
		t.Fatalf("query calls: %d, want 2", calls)
	}

	if first.OnlinePlayers == nil || second.OnlinePlayers == nil {
		t.Fatal("OnlinePlayers = nil, want values")
	}

	if *first.OnlinePlayers == *second.OnlinePlayers {
		t.Fatal("cache did not refresh after expiry")
	}

	if second.Cached {
		t.Fatal("second.Cached = true, want false after refresh")
	}
}

func TestCacheReturnsStaleValueAfterRefreshFailure(t *testing.T) {
	shouldFail := false

	query := func(ctx context.Context, address string) (Status, error) {
		if shouldFail {
			return Status{}, errors.New("query failed")
		}

		onlinePlayers := 10

		return Status{
			State:         StateOnline,
			OnlinePlayers: &onlinePlayers,
		}, nil
	}

	cache := NewCache(10*time.Millisecond, query)

	_, err := cache.Get(context.Background(), "localhost:25565")
	if err != nil {
		t.Fatalf("first Get() error: %v", err)
	}

	time.Sleep(20 * time.Millisecond)
	shouldFail = true

	status, err := cache.Get(context.Background(), "localhost:25565")
	if err != nil {
		t.Fatalf("stale Get() error: %v", err)
	}

	if !status.Stale {
		t.Fatal("status.Stale = false, want true")
	}

	if *status.OnlinePlayers != 10 {
		t.Fatalf("OnlinePlayers = %d, want 10", status.OnlinePlayers)
	}

	if !status.Cached {
		t.Fatal("status.Cached = false, want true")
	}

	if !status.Stale {
		t.Fatal("status.Stale = false, want true")
	}
}

func TestCacheReturnsErrorWithoutCachedValue(t *testing.T) {
	expectedErr := errors.New("query failed")

	query := func(ctx context.Context, address string) (Status, error) {
		return Status{}, expectedErr
	}

	cache := NewCache(time.Minute, query)

	_, err := cache.Get(context.Background(), "localhost:25565")
	if !errors.Is(err, expectedErr) {
		t.Fatalf("Get() error = %v, want %v", err, expectedErr)
	}
}

func TestCacheDeduplicatesConcurrentQueries(t *testing.T) {
	var calls int
	var callsMu sync.Mutex

	query := func(ctx context.Context, address string) (Status, error) {
		callsMu.Lock()
		calls++
		callsMu.Unlock()

		time.Sleep(20 * time.Millisecond)

		return Status{
			State: StateOnline,
		}, nil
	}

	cache := NewCache(time.Minute, query)

	const goroutines = 10
	var wg sync.WaitGroup
	wg.Add(goroutines)

	for range goroutines {
		go func() {
			defer wg.Done()

			_, err := cache.Get(context.Background(), "localhost:25565")
			if err != nil {
				t.Errorf("Get() error: %v", err)
			}
		}()
	}

	wg.Wait()

	callsMu.Lock()
	defer callsMu.Unlock()

	if calls != 1 {
		t.Fatalf("query calls: %d, want 1", calls)
	}
}

func TestCachePreservesUsableStatusWhenRefreshIsUnavailable(t *testing.T) {
	tests := []struct {
		name           string
		initialState   State
		recoveredState State
	}{
		{
			name:           "preserves online status",
			initialState:   StateOnline,
			recoveredState: StateOffline,
		},
		{
			name:           "preserves offline status",
			initialState:   StateOffline,
			recoveredState: StateOnline,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			currentTime := time.Date(
				2026,
				time.August,
				1,
				12,
				0,
				0,
				0,
				time.UTC,
			)

			queryCalls := 0

			cache := &Cache{
				ttl: 15 * time.Second,
				now: func() time.Time {
					return currentTime
				},
				query: func(
					ctx context.Context,
					address string,
				) (Status, error) {
					queryCalls++

					switch queryCalls {
					case 1:
						return Status{
							State:     tt.initialState,
							CheckedAt: currentTime,
						}, nil

					case 2:
						return Status{
							State:     StateUnavailable,
							CheckedAt: currentTime,
						}, nil

					case 3:
						return Status{
							State:     tt.recoveredState,
							CheckedAt: currentTime,
						}, nil

					default:
						t.Fatalf(
							"unexpected query call number: %d",
							queryCalls,
						)

						return Status{}, nil
					}
				},
			}

			first, err := cache.Get(
				context.Background(),
				"localhost:25565",
			)
			if err != nil {
				t.Fatalf("first Get returned an error: %v", err)
			}

			if first.State != tt.initialState {
				t.Fatalf(
					"expected initial state %q, got %q",
					tt.initialState,
					first.State,
				)
			}

			if first.Cached {
				t.Fatal("expected initial result not to be cached")
			}

			if first.Stale {
				t.Fatal("expected initial result not to be stale")
			}

			if queryCalls != 1 {
				t.Fatalf(
					"expected 1 query call, got %d",
					queryCalls,
				)
			}

			initialCheckedAt := first.CheckedAt

			// Expire the normal cache entry.
			currentTime = currentTime.Add(
				cache.ttl + time.Nanosecond,
			)

			stale, err := cache.Get(
				context.Background(),
				"localhost:25565",
			)
			if err != nil {
				t.Fatalf(
					"Get after unavailable refresh returned an error: %v",
					err,
				)
			}

			if stale.State != tt.initialState {
				t.Fatalf(
					"expected previous state %q, got %q",
					tt.initialState,
					stale.State,
				)
			}

			if !stale.Cached {
				t.Fatal("expected fallback result to be cached")
			}

			if !stale.Stale {
				t.Fatal("expected fallback result to be stale")
			}

			if !stale.CheckedAt.Equal(initialCheckedAt) {
				t.Fatalf(
					"expected stale result to preserve CheckedAt %v, got %v",
					initialCheckedAt,
					stale.CheckedAt,
				)
			}

			if queryCalls != 2 {
				t.Fatalf(
					"expected 2 query calls, got %d",
					queryCalls,
				)
			}

			// This request occurs inside the short stale retry window.
			staleAgain, err := cache.Get(
				context.Background(),
				"localhost:25565",
			)
			if err != nil {
				t.Fatalf(
					"Get during retry window returned an error: %v",
					err,
				)
			}

			if staleAgain.State != tt.initialState {
				t.Fatalf(
					"expected stale state %q, got %q",
					tt.initialState,
					staleAgain.State,
				)
			}

			if !staleAgain.Cached {
				t.Fatal("expected retry-window result to be cached")
			}

			if !staleAgain.Stale {
				t.Fatal("expected retry-window result to remain stale")
			}

			if queryCalls != 2 {
				t.Fatalf(
					"expected no additional query during retry window; got %d calls",
					queryCalls,
				)
			}

			// Move beyond the short retry window.
			currentTime = currentTime.Add(
				staleRetryInterval + time.Nanosecond,
			)

			recovered, err := cache.Get(
				context.Background(),
				"localhost:25565",
			)
			if err != nil {
				t.Fatalf(
					"Get after retry interval returned an error: %v",
					err,
				)
			}

			if recovered.State != tt.recoveredState {
				t.Fatalf(
					"expected recovered state %q, got %q",
					tt.recoveredState,
					recovered.State,
				)
			}

			if recovered.Cached {
				t.Fatal("expected recovered result not to be cached")
			}

			if recovered.Stale {
				t.Fatal("expected recovered result not to be stale")
			}

			if queryCalls != 3 {
				t.Fatalf(
					"expected 3 query calls after recovery, got %d",
					queryCalls,
				)
			}
		})
	}
}

func TestCacheReturnsUnavailableNormallyWithoutUsablePreviousValue(
	t *testing.T,
) {
	currentTime := time.Date(
		2026,
		time.August,
		1,
		12,
		0,
		0,
		0,
		time.UTC,
	)

	queryCalls := 0

	cache := &Cache{
		ttl: 15 * time.Second,
		now: func() time.Time {
			return currentTime
		},
		query: func(
			ctx context.Context,
			address string,
		) (Status, error) {
			queryCalls++

			return Status{
				State:     StateUnavailable,
				CheckedAt: currentTime,
			}, nil
		},
	}

	first, err := cache.Get(
		context.Background(),
		"localhost:25565",
	)
	if err != nil {
		t.Fatalf("first Get returned an error: %v", err)
	}

	if first.State != StateUnavailable {
		t.Fatalf(
			"expected state %q, got %q",
			StateUnavailable,
			first.State,
		)
	}

	if first.Cached {
		t.Fatal("expected first unavailable result not to be cached")
	}

	if first.Stale {
		t.Fatal("expected first unavailable result not to be stale")
	}

	if queryCalls != 1 {
		t.Fatalf(
			"expected 1 query call, got %d",
			queryCalls,
		)
	}

	second, err := cache.Get(
		context.Background(),
		"localhost:25565",
	)
	if err != nil {
		t.Fatalf("second Get returned an error: %v", err)
	}

	if second.State != StateUnavailable {
		t.Fatalf(
			"expected cached state %q, got %q",
			StateUnavailable,
			second.State,
		)
	}

	if !second.Cached {
		t.Fatal("expected second unavailable result to be cached")
	}

	if second.Stale {
		t.Fatal("expected cached unavailable result not to be stale")
	}

	if queryCalls != 1 {
		t.Fatalf(
			"expected unavailable result to be cached; got %d query calls",
			queryCalls,
		)
	}
}

func TestCacheDoesNotUseUnavailableStatusAsErrorFallback(
	t *testing.T,
) {
	currentTime := time.Date(
		2026,
		time.August,
		1,
		12,
		0,
		0,
		0,
		time.UTC,
	)

	queryErr := errors.New("minecraft query failed")
	queryCalls := 0

	cache := &Cache{
		ttl: 15 * time.Second,
		now: func() time.Time {
			return currentTime
		},
		query: func(
			ctx context.Context,
			address string,
		) (Status, error) {
			queryCalls++

			if queryCalls == 1 {
				return Status{
					State:     StateUnavailable,
					CheckedAt: currentTime,
				}, nil
			}

			return Status{}, queryErr
		},
	}

	first, err := cache.Get(
		context.Background(),
		"localhost:25565",
	)
	if err != nil {
		t.Fatalf("first Get returned an error: %v", err)
	}

	if first.State != StateUnavailable {
		t.Fatalf(
			"expected state %q, got %q",
			StateUnavailable,
			first.State,
		)
	}

	currentTime = currentTime.Add(
		cache.ttl + time.Nanosecond,
	)

	_, err = cache.Get(
		context.Background(),
		"localhost:25565",
	)
	if !errors.Is(err, queryErr) {
		t.Fatalf(
			"expected error %v, got %v",
			queryErr,
			err,
		)
	}

	if queryCalls != 2 {
		t.Fatalf(
			"expected 2 query calls, got %d",
			queryCalls,
		)
	}
}
