package minecraft

import "io"

func writeString(w io.Writer, value string) error {
	if err := writeVarInt(w, int32(len(value))); err != nil {
		return err
	}

	numberOfBytesWritten, err := io.WriteString(w, value)
	if err != nil {
		return err
	}

	if numberOfBytesWritten < len(value) {
		return io.ErrShortWrite
	}

	return nil
}
