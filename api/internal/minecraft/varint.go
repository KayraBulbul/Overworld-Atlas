package minecraft

import (
	"errors"
	"io"
)

func writeVarInt(w io.Writer, value int32) error {
	unsigned := uint32(value)

	for {
		currentByte := byte(unsigned & 0x7F)

		// Remove the seven bits that were extracted
		unsigned >>= 7

		// If more data remains, set the continuation bit
		if unsigned != 0 {
			currentByte |= 0x80
		}

		_, err := w.Write([]byte{currentByte})
		if err != nil {
			return err
		}

		if unsigned == 0 {
			return nil
		}
	}
}

func readVarInt(r io.ByteReader) (int32, error) {
	var result uint32
	var position uint

	for {
		currentByte, err := r.ReadByte()
		if err != nil {
			return 0, err
		}

		value := uint32(currentByte & 0x7F)
		result |= value << position
		position += 7

		if currentByte&0x80 == 0 {
			return int32(result), nil
		}

		if position >= 35 {
			return 0, errors.New("VarInt exceeds 5 bytes")
		}
	}
}
