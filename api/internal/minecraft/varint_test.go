package minecraft

import (
	"bytes"
	"testing"
)

func TestWriteVarInt(t *testing.T) {
	tests := []struct {
		name     string
		value    int32
		expected []byte
	}{
		{
			name:     "zero",
			value:    0,
			expected: []byte{0x00},
		},
		{
			name:     "one",
			value:    1,
			expected: []byte{0x01},
		},
		{
			name:     "largest one-byte value",
			value:    127,
			expected: []byte{0x7F},
		},
		{
			name:     "smallest two-byte value",
			value:    128,
			expected: []byte{0x80, 0x01},
		},
		{
			name:     "two hundred and fifty five",
			value:    255,
			expected: []byte{0xFF, 0x01},
		},
		{
			name:     "largest three-byte positive value",
			value:    2097151,
			expected: []byte{0xFF, 0xFF, 0x7F},
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			var buffer bytes.Buffer

			err := writeVarInt(&buffer, test.value)
			if err != nil {
				t.Fatalf("writeVarInt returned an error: %v", err)
			}

			if !bytes.Equal(buffer.Bytes(), test.expected) {
				t.Errorf("expected % X, got % X", test.expected, buffer.Bytes())
			}
		})
	}
}

func TestReadVarInt(t *testing.T) {
	tests := []struct {
		name     string
		value    []byte
		expected int32
		wantErr  bool
	}{
		{
			name:     "zero",
			value:    []byte{0x00},
			expected: 0,
			wantErr:  false,
		},
		{
			name:     "one",
			value:    []byte{0x01},
			expected: 1,
			wantErr:  false,
		},
		{
			name:     "largest one-byte value",
			value:    []byte{0x7F},
			expected: 127,
			wantErr:  false,
		},
		{
			name:     "smallest two-byte value",
			value:    []byte{0x80, 0x01},
			expected: 128,
			wantErr:  false,
		},
		{
			name:     "two hundred and fifty five",
			value:    []byte{0xFF, 0x01},
			expected: 255,
			wantErr:  false,
		},
		{
			name:     "largest three-byte positive value",
			value:    []byte{0xFF, 0xFF, 0x7F},
			expected: 2097151,
			wantErr:  false,
		},
		{
			name:     "malformed case",
			value:    []byte{0x80, 0x80, 0x80, 0x80, 0x80},
			expected: 0,
			wantErr:  true,
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			reader := bytes.NewReader(test.value)

			value, err := readVarInt(reader)

			if test.wantErr {
				if err == nil {
					t.Fatal("expected an error, got nil")
				}
				return
			}

			if err != nil {
				t.Fatalf("readVarInt returned an error: %v", err)
			}

			if value != test.expected {
				t.Errorf("expected % X, got % X", test.expected, value)
			}
		})
	}
}
