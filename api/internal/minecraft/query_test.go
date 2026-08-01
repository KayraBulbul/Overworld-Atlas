package minecraft

import (
	"context"
	"net"
	"testing"
	"time"
)

func TestQueryStatusReturnsOfflineWhenConnectionIsRefused(t *testing.T) {
	listener, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		t.Fatalf("net.Listen() error = %v", err)
	}

	address := listener.Addr().String()

	if err := listener.Close(); err != nil {
		t.Fatalf("listener.Close() error = %v", err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	defer cancel()

	status, err := QueryStatus(ctx, address)
	if err != nil {
		t.Fatalf("QueryStatus() error = %v", err)
	}

	if status.State != StateOffline {
		t.Fatalf("status.State = %v, want %v", status.State, StateOffline)
	}

	if status.OnlinePlayers != nil {
		t.Fatalf(
			"status.OnlinePlayers = %v, want nil",
			status.OnlinePlayers,
		)
	}

	if status.MaxPlayers != nil {
		t.Fatalf(
			"status.MaxPlayers = %v, want nil",
			status.MaxPlayers,
		)
	}

	if status.Version != nil {
		t.Fatalf("status.Version = %v, want nil", status.Version)
	}

	if status.ProtocolVersion != nil {
		t.Fatalf(
			"status.ProtocolVersion = %v, want nil",
			status.ProtocolVersion,
		)
	}

	if status.CheckedAt.IsZero() {
		t.Fatal("status.CheckedAt is zero, want query timestamp")
	}

	if status.Stale {
		t.Fatal("status.Stale = true, want false")
	}
}

func TestQueryStatusReturnsUnavailableOnTimeout(t *testing.T) {
	listener, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		t.Fatalf("net.Listen() error = %v", err)
	}
	defer listener.Close()

	go func() {
		conn, err := listener.Accept()
		if err != nil {
			return
		}
		defer conn.Close()

		// Keep the connection open without sending a response.
		time.Sleep(200 * time.Millisecond)
	}()

	ctx, cancel := context.WithTimeout(context.Background(), 50*time.Millisecond)
	defer cancel()

	status, err := QueryStatus(ctx, listener.Addr().String())
	if err != nil {
		t.Fatalf("QueryStatus() error = %v", err)
	}

	if status.State != StateUnavailable {
		t.Fatalf(
			"status.State = %v, want %v",
			status.State,
			StateUnavailable,
		)
	}

	if status.OnlinePlayers != nil {
		t.Fatalf(
			"status.OnlinePlayers = %v, want nil",
			status.OnlinePlayers,
		)
	}

	if status.Version != nil {
		t.Fatalf("status.Version = %v, want nil", status.Version)
	}

	if status.CheckedAt.IsZero() {
		t.Fatal("status.CheckedAt is zero, want query timestamp")
	}

	if status.Stale {
		t.Fatal("status.Stale = true, want false")
	}
}
