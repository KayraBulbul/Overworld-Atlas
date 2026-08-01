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
		t.Fatalf("error creating listener: %v", err)
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
		t.Fatalf("error creating listener: %v", err)
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
