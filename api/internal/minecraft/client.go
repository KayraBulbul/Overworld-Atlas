// Package minecraft handles all Minecraft related requests
package minecraft

import (
	"context"
	"net"
	"time"
)

type State string

const (
	StateOnline      State = "online"
	StateOffline     State = "offline"
	StateUnavailable State = "unavailable"
)

type Player struct {
	Username string
	UUID     string
}

type Status struct {
	State                 State
	OnlinePlayers         int
	MaxPlayers            int
	PlayerSampleAvailable bool
	Players               []Player
	Version               string
	ProtocolVersion       int
	CheckedAt             time.Time
	Stale                 bool
}

func GetStatus(ctx context.Context, address string) (Status, error) {
	dialer := net.Dialer{}

	conn, err := dialer.DialContext(ctx, "tcp", address)
	if err != nil {
		return Status{}, err
	}
	defer conn.Close()

	return Status{}, nil
}
