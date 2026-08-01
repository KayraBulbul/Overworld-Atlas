package minecraft

import (
	"bufio"
	"bytes"
	"context"
	"errors"
	"net"
	"testing"
	"time"
)

func startStatusTestServer(t *testing.T, payload []byte) net.Listener {
	t.Helper()

	listener, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		t.Fatalf("error creating listener: %v", err)
	}
	go func() {
		conn, err := listener.Accept()
		if err != nil {
			return
		}
		defer conn.Close()

		reader := bufio.NewReader(conn)

		if _, _, err := readPacket(reader, maxPacketSize); err != nil {
			return
		}

		if _, _, err := readPacket(reader, maxPacketSize); err != nil {
			return
		}

		var response bytes.Buffer

		if err := writeString(&response, string(payload)); err != nil {
			return
		}

		if err := writePacket(conn, 0, response.Bytes()); err != nil {
			return
		}
	}()

	t.Cleanup(func() {
		if err := listener.Close(); err != nil {
			t.Errorf("closing listener: %v", err)
		}
	})
	return listener
}

func TestBuildHandshakePayload(t *testing.T) {
	tests := []struct {
		name            string
		protocolVersion int32
		host            string
		port            uint16
		expected        []byte
	}{
		{
			name:            "easy values",
			protocolVersion: int32(47),
			host:            "a",
			port:            uint16(25565),
			expected: []byte{
				0x2F,
				0x01, 'a',
				0x63, 0xDD,
				0x01,
			},
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			payload, err := buildHandshakePayload(test.protocolVersion, test.host, test.port)
			if err != nil {
				t.Fatalf("buildHandshakePayload returned an error: %v", err)
			}

			if !bytes.Equal(payload, test.expected) {
				t.Errorf("expected % X, got % X", test.expected, payload)
			}
		})
	}
}

func TestGetStatusTransportError(t *testing.T) {
	ctx := context.Background()

	_, err := GetStatus(ctx, "127.0.0.1:1")
	if err == nil {
		t.Fatal("expected an error")
	}

	if !errors.Is(err, ErrTransport) {
		t.Fatalf("expected ErrTransport, got %v", err)
	}
}

func TestGetStatusProtocolError(t *testing.T) {
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

		reader := bufio.NewReader(conn)

		_, _, _ = readPacket(reader, maxPacketSize) // handshake
		_, _, _ = readPacket(reader, maxPacketSize) // status request

		_ = writePacket(conn, 1, nil) // wrong response packet ID
	}()

	_, err = GetStatus(context.Background(), listener.Addr().String())
	if !errors.Is(err, ErrProtocol) {
		t.Fatalf("expected ErrProtocol, got %v", err)
	}
}

func TestGetStatusTimeout(t *testing.T) {
	listener, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		t.Fatalf("net.Listen() error = %v", err)
	}
	defer listener.Close()

	ctx, cancel := context.WithTimeout(context.Background(), 50*time.Millisecond)
	defer cancel()

	_, err = GetStatus(ctx, listener.Addr().String())
	if err == nil {
		t.Fatal("GetStatus() error: nil, want timeout error")
	}

	var netErr net.Error
	if !errors.As(err, &netErr) || !netErr.Timeout() {
		t.Fatalf("expected timeout error, got %v", err)
	}
}

func TestGetStatusRejectsMissingRequiredFields(t *testing.T) {
	testCases := []struct {
		name    string
		payload string
	}{
		{
			name:    "empty object",
			payload: `{}`,
		},
		{
			name: "missing version",
			payload: `{
				"players": {
					"max": 20,
					"online": 0
				}
			}`,
		},
		{
			name: "missing players",
			payload: `{
				"version": {
					"name": "1.21",
					"protocol": 767
				}
			}`,
		},
	}

	for _, testCase := range testCases {
		t.Run(testCase.name, func(t *testing.T) {
			listener := startStatusTestServer(
				t,
				[]byte(testCase.payload),
			)

			_, err := GetStatus(
				context.Background(),
				listener.Addr().String(),
			)

			if !errors.Is(err, ErrProtocol) {
				t.Fatalf("GetStatus() error = %v, want ErrProtocol", err)
			}
		})
	}
}

func TestGetStatusRejectsInvalidPlayerCounts(t *testing.T) {
	testCases := []struct {
		name    string
		payload string
	}{
		{
			name: "negative online count",
			payload: `{
				"version": {
					"name": "1.21",
					"protocol": 767
				},
				"players": {
					"max": 20,
					"online": -1
				}
			}`,
		},
		{
			name: "negative maximum count",
			payload: `{
				"version": {
					"name": "1.21",
					"protocol": 767
				},
				"players": {
					"max": -1,
					"online": 0
				}
			}`,
		},
		{
			name: "online exceeds maximum",
			payload: `{
				"version": {
					"name": "1.21",
					"protocol": 767
				},
				"players": {
					"max": 5,
					"online": 10
				}
			}`,
		},
	}

	for _, testCase := range testCases {
		t.Run(testCase.name, func(t *testing.T) {
			listener := startStatusTestServer(
				t,
				[]byte(testCase.payload),
			)

			_, err := GetStatus(
				context.Background(),
				listener.Addr().String(),
			)

			if !errors.Is(err, ErrProtocol) {
				t.Fatalf("GetStatus() error = %v, want ErrProtocol", err)
			}
		})
	}
}

func TestGetStatusHandlesZeroPlayers(t *testing.T) {
	payload := `{
		"version": {
			"name": "1.21",
			"protocol": 767
		},
		"players": {
			"max": 20,
			"online": 0
		}
	}`

	listener := startStatusTestServer(t, []byte(payload))

	status, err := GetStatus(
		context.Background(),
		listener.Addr().String(),
	)
	if err != nil {
		t.Fatalf("GetStatus() error = %v", err)
	}

	if status.State != StateOnline {
		t.Fatalf("State = %v, want %v", status.State, StateOnline)
	}

	if status.OnlinePlayers == nil || *status.OnlinePlayers != 0 {
		t.Fatalf(
			"OnlinePlayers = %v, want pointer to 0",
			status.OnlinePlayers,
		)
	}

	if len(status.Players) != 0 {
		t.Fatalf("Players = %v, want empty", status.Players)
	}
}

func TestGetStatusMapsSampledPlayers(t *testing.T) {
	payload := `{
		"version": {
			"name": "1.21",
			"protocol": 767
		},
		"players": {
			"max": 20,
			"online": 2,
			"sample": [
				{
					"name": "MagicGN",
					"id": "uuid-one"
				},
				{
					"name": "Zings",
					"id": "uuid-two"
				}
			]
		}
	}`

	listener := startStatusTestServer(t, []byte(payload))

	status, err := GetStatus(
		context.Background(),
		listener.Addr().String(),
	)
	if err != nil {
		t.Fatalf("GetStatus() error = %v", err)
	}

	if len(status.Players) != 2 {
		t.Fatalf("len(Players) = %d, want 2", len(status.Players))
	}

	if status.Players[0].Username != "MagicGN" {
		t.Fatalf(
			"Players[0].Username = %q, want %q",
			status.Players[0].Username,
			"MagicGN",
		)
	}

	if status.Players[0].UUID != "uuid-one" {
		t.Fatalf(
			"Players[0].UUID = %q, want %q",
			status.Players[0].UUID,
			"uuid-one",
		)
	}
}

func TestGetStatusAllowsOnlinePlayersWithoutSample(t *testing.T) {
	payload := `{
		"version": {
			"name": "1.21",
			"protocol": 767
		},
		"players": {
			"max": 20,
			"online": 5
		}
	}`

	listener := startStatusTestServer(t, []byte(payload))

	status, err := GetStatus(
		context.Background(),
		listener.Addr().String(),
	)
	if err != nil {
		t.Fatalf("GetStatus() error = %v", err)
	}

	if status.OnlinePlayers == nil || *status.OnlinePlayers != 5 {
		t.Fatalf(
			"OnlinePlayers = %v, want pointer to 5",
			status.OnlinePlayers,
		)
	}

	if status.PlayerSampleAvailable == nil {
		t.Fatal("PlayerSampleAvailable = nil, want false")
	}

	if *status.PlayerSampleAvailable {
		t.Fatal("PlayerSampleAvailable = true, want false")
	}

	if len(status.Players) != 0 {
		t.Fatalf("len(Players) = %d, want 0", len(status.Players))
	}
}

func TestGetStatusUsesUTCTimestamp(t *testing.T) {
	payload := `{
		"version": {
			"name": "1.21",
			"protocol": 767
		},
		"players": {
			"max": 20,
			"online": 0
		}
	}`

	listener := startStatusTestServer(t, []byte(payload))

	status, err := GetStatus(
		context.Background(),
		listener.Addr().String(),
	)
	if err != nil {
		t.Fatalf("GetStatus() error = %v", err)
	}

	if status.CheckedAt.Location() != time.UTC {
		t.Fatalf(
			"CheckedAt location = %v, want UTC",
			status.CheckedAt.Location(),
		)
	}
}
