package minecraft

import (
	"bufio"
	"bytes"
	"errors"
	"io"
)

type byteReader interface {
	io.Reader
	io.ByteReader
}

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

func readPacket(reader *bufio.Reader, maxSize int32) (int32, []byte, error) {
	length, err := readVarInt(reader)
	if err != nil {
		return 0, nil, err
	}
	if length <= 0 || length > maxSize {
		return 0, nil, errors.New("invalid packet length")
	}

	packetData := make([]byte, length)
	_, err = io.ReadFull(reader, packetData)
	if err != nil {
		return 0, nil, err
	}

	packetReader := bytes.NewReader(packetData)
	packetID, err := readVarInt(packetReader)
	if err != nil {
		return 0, nil, err
	}
	payload, err := io.ReadAll(packetReader)
	if err != nil {
		return 0, nil, err
	}

	return packetID, payload, nil
}

func readString(r byteReader, maxLength int32) (string, error) {
	length, err := readVarInt(r)
	if err != nil {
		return "", err
	}
	if length < 0 || length > maxLength {
		return "", errors.New("invalid string length")
	}

	data := make([]byte, length)
	if _, err := io.ReadFull(r, data); err != nil {
		return "", err
	}

	return string(data), nil
}
