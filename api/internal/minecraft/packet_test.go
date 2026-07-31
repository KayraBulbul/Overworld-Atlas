package minecraft

import (
	"bufio"
	"bytes"
	"testing"
)

func TestWriteString(t *testing.T) {
	tests := []struct {
		name     string
		value    string
		expected []byte
	}{
		{
			name:     "abc",
			value:    "abc",
			expected: []byte{0x03, 'a', 'b', 'c'},
		},
		{
			name:     "empty string",
			value:    "",
			expected: []byte{0x00},
		},
		{
			name:     "UTF-8 example",
			value:    "é",
			expected: []byte{0x02, 0xC3, 0xA9},
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			var buffer bytes.Buffer

			err := writeString(&buffer, test.value)
			if err != nil {
				t.Fatalf("writeString returned an error: %v", err)
			}

			if !bytes.Equal(buffer.Bytes(), test.expected) {
				t.Errorf("expected % X, got % X", test.expected, buffer.Bytes())
			}
		})
	}
}

func TestWritePacket(t *testing.T) {
	tests := []struct {
		name     string
		packetID int32
		payload  []byte
		expected []byte
	}{
		{
			name:     "Empty payload",
			packetID: int32(0),
			payload:  []byte{},
			expected: []byte{0x01, 0x00},
		},
		{
			name:     "Regular payload",
			packetID: int32(1),
			payload:  []byte{0xAA, 0xBB},
			expected: []byte{0x03, 0x01, 0xAA, 0xBB},
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			var buffer bytes.Buffer

			err := writePacket(&buffer, test.packetID, test.payload)
			if err != nil {
				t.Fatalf("writePacket returned an error: %v", err)
			}

			if !bytes.Equal(buffer.Bytes(), test.expected) {
				t.Errorf("expected % X, got % X", test.expected, buffer.Bytes())
			}
		})
	}
}

func TestReadPacket(t *testing.T) {
	tests := []struct {
		name            string
		input           []byte
		maxSize         int32
		expectedID      int32
		expectedPayload []byte
		wantErr         bool
	}{
		{
			name:            "status request packet",
			input:           []byte{0x01, 0x00},
			maxSize:         1024,
			expectedID:      0,
			expectedPayload: []byte{},
		},
		{
			name:            "packet with payload",
			input:           []byte{0x03, 0x01, 0xAA, 0xBB},
			maxSize:         1024,
			expectedID:      1,
			expectedPayload: []byte{0xAA, 0xBB},
		},
		{
			name:    "zero packet length",
			input:   []byte{0x00},
			maxSize: 1024,
			wantErr: true,
		},
		{
			name:    "packet exceeds maximum size",
			input:   []byte{0x05, 0x00, 0x01, 0x02, 0x03, 0x04},
			maxSize: 4,
			wantErr: true,
		},
		{
			name:    "truncated packet",
			input:   []byte{0x03, 0x00},
			maxSize: 1024,
			wantErr: true,
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			reader := bufio.NewReader(bytes.NewReader(test.input))

			packetID, payload, err := readPacket(reader, test.maxSize)

			if test.wantErr {
				if err == nil {
					t.Fatal("expected an error, got nil")
				}
				return
			}

			if err != nil {
				t.Fatalf("readPacket returned an unexpected error: %v", err)
			}

			if packetID != test.expectedID {
				t.Errorf(
					"expected packet ID %d, got %d",
					test.expectedID,
					packetID,
				)
			}

			if !bytes.Equal(payload, test.expectedPayload) {
				t.Errorf(
					"expected payload % X, got % X",
					test.expectedPayload,
					payload,
				)
			}
		})
	}
}

func TestReadString(t *testing.T) {
	tests := []struct {
		name      string
		input     []byte
		maxLength int32
		expected  string
		wantErr   bool
	}{
		{
			name:      "abc",
			input:     []byte{0x03, 'a', 'b', 'c'},
			maxLength: 100,
			expected:  "abc",
		},
		{
			name:      "empty",
			input:     []byte{0x00},
			maxLength: 100,
			expected:  "",
		},
		{
			name:      "UTF-8",
			input:     []byte{0x02, 0xC3, 0xA9},
			maxLength: 100,
			expected:  "é",
		},
		{
			name:      "exceeds maximum",
			input:     []byte{0x03, 'a', 'b', 'c'},
			maxLength: 2,
			wantErr:   true,
		},
		{
			name:      "truncated",
			input:     []byte{0x03, 'a'},
			maxLength: 100,
			wantErr:   true,
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			reader := bufio.NewReader(bytes.NewReader(test.input))

			actual, err := readString(reader, test.maxLength)
			if test.wantErr {
				if err == nil {
					t.Fatal("expected an error, got nil")
				}
				return
			}

			if err != nil {
				t.Fatalf("readString returned an unexpected error: %v", err)
			}

			if actual != test.expected {
				t.Errorf(
					"expected % X, got % X",
					test.expected,
					actual,
				)
			}
		})
	}
}
