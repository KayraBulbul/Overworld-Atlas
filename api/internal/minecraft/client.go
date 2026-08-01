// Package minecraft handles all Minecraft related requests
package minecraft

import (
	"bufio"
	"bytes"
	"context"
	"encoding/binary"
	"encoding/json"
	"errors"
	"fmt"
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

type statusResponse struct {
	Version statusVersion `json:"version"`
	Players statusPlayers `json:"players"`
}

type statusVersion struct {
	Name     string `json:"name"`
	Protocol int    `json:"protocol"`
}

type statusPlayers struct {
	Max    int             `json:"max"`
	Online int             `json:"online"`
	Sample []sampledPlayer `json:"sample"`
}

type sampledPlayer struct {
	Name string `json:"name"`
	ID   string `json:"id"`
}

var (
	ErrTransport = errors.New("minecraft transport error")
	ErrProtocol  = errors.New("minecraft protocol error")
)

const maxPacketSize int32 = 1 << 20

func GetStatus(ctx context.Context, address string) (Status, error) {
	dialer := net.Dialer{}

	conn, err := dialer.DialContext(ctx, "tcp", address)
	if err != nil {
		return Status{}, fmt.Errorf("%w: connect: %w", ErrTransport, err)
	}
	defer conn.Close()

	if deadline, ok := ctx.Deadline(); ok {
		if err := conn.SetDeadline(deadline); err != nil {
			return Status{}, fmt.Errorf("set connection deadline: %w", err)
		}
	}

	host, portText, err := net.SplitHostPort(address)
	if err != nil {
		return Status{}, fmt.Errorf("invalid Minecraft address %q: %w", address, err)
	}

	portNumber, err := strconv.ParseUint(portText, 10, 16)
	if err != nil {
		return Status{}, fmt.Errorf("invalid Minecraft port %q: %w", portText, err)
	}

	payload, err := buildHandshakePayload(
		-1,
		host,
		uint16(portNumber),
	)
	if err != nil {
		return Status{}, fmt.Errorf("%w: build handshake: %v", ErrProtocol, err)
	}

	if err = writePacket(conn, 0, payload); err != nil {
		return Status{}, fmt.Errorf("%w: send handshake: %w", ErrTransport, err)
	}
	if err = writePacket(conn, 0, nil); err != nil {
		return Status{}, fmt.Errorf("%w: send status request: %w", ErrTransport, err)
	}

	reader := bufio.NewReader(conn)
	packetID, payload, err := readPacket(reader, maxPacketSize)
	if err != nil {
		return Status{}, fmt.Errorf("%w: read status response: %w", ErrTransport, err)
	}

	if packetID != 0 {
		return Status{}, fmt.Errorf("%w: unexpected status response packed ID %d", ErrProtocol, packetID)
	}

	payloadReader := bytes.NewReader(payload)
	statusJSON, err := readString(payloadReader, maxPacketSize)
	if err != nil {
		return Status{}, fmt.Errorf("%w: decode status response string: %v", ErrProtocol, err)
	}

	var response statusResponse

	if err := json.Unmarshal([]byte(statusJSON), &response); err != nil {
		return Status{}, fmt.Errorf("%w: decode status response JSON: %v", ErrProtocol, err)
	}

	players := make([]Player, 0, len(response.Players.Sample))

	for _, sampled := range response.Players.Sample {
		players = append(players, Player{
			Username: sampled.Name,
			UUID:     sampled.ID,
		})
	}

	sampleAvailable := response.Players.Sample != nil

	return Status{
		State:                 StateOnline,
		OnlinePlayers:         response.Players.Online,
		MaxPlayers:            response.Players.Max,
		PlayerSampleAvailable: sampleAvailable,
		Players:               players,
		Version:               response.Version.Name,
		ProtocolVersion:       response.Version.Protocol,
		CheckedAt:             time.Now().UTC(),
		Stale:                 false,
	}, nil
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
