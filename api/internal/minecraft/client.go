// Package minecraft handles all Minecraft related requests
package minecraft

import (
	"bytes"
	"context"
	"encoding/binary"
	"net"
	"strconv"
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

	host, portText, err := net.SplitHostPort(address)
	if err != nil {
		return Status{}, err
	}

	portNumber, err := strconv.ParseUint(portText, 10, 16)
	if err != nil {
		return Status{}, err
	}

	payload, err := buildHandshakePayload(
		-1,
		host,
		uint16(portNumber),
	)
	if err != nil {
		return Status{}, err
	}

	if err = writePacket(conn, 0, payload); err != nil {
		return Status{}, err
	}
	if err = writePacket(conn, 0, nil); err != nil {
		return Status{}, err
	}

	return Status{}, nil
}

func buildHandshakePayload(
	ProtocolVersion int32,
	host string,
	port uint16,
) ([]byte, error) {
	var buffer bytes.Buffer

	err := writeVarInt(&buffer, ProtocolVersion)
	if err != nil {
		return []byte{}, err
	}

	err = writeString(&buffer, host)
	if err != nil {
		return []byte{}, err
	}

	err = binary.Write(&buffer, binary.BigEndian, port)
	if err != nil {
		return []byte{}, err
	}

	err = writeVarInt(&buffer, int32(1))
	if err != nil {
		return []byte{}, err
	}

	return buffer.Bytes(), nil
}
