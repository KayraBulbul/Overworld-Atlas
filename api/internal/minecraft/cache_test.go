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
