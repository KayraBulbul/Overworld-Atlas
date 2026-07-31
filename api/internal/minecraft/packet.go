package minecraft

import (
	"bytes"
	"io"
)

func writeString(w io.Writer, value string) error {
	if err := writeVarInt(w, int32(len(value))); err != nil {
		return err
	}

	numberOfBytesWritten, err := io.WriteString(w, value)
	if err != nil {
		return err
	}

	if numberOfBytesWritten != len(value) {
		return io.ErrShortWrite
	}

	return nil
}

func writePacket(w io.Writer, packetID int32, payload []byte) error {
	var buffer bytes.Buffer

	if err := writeVarInt(&buffer, packetID); err != nil {
		return err
	}

	numberWritten, err := buffer.Write(payload)
	if err != nil {
		return err
	}

	if numberWritten != len(payload) {
		return io.ErrShortWrite
	}

	if err := writeVarInt(w, int32(buffer.Len())); err != nil {
		return err
	}

	packetBody := buffer.Bytes()
	numberWritten, err = w.Write(packetBody)
	if err != nil {
		return err
	}

	if numberWritten != len(packetBody) {
		return io.ErrShortWrite
	}

	return nil
}
