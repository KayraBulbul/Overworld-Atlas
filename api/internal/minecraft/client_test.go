package minecraft

import (
	"bytes"
	"testing"
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
