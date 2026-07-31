package minecraft

import (
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
