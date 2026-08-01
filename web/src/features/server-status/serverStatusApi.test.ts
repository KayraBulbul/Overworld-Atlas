import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  onlineStatusPayload,
  mockServerStatusFetch,
} from '../../test/serverStatusFixtures'
import {
  buildPlayerHeadUrl,
  fetchServerStatus,
  parseServerStatus,
} from './serverStatusApi'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('server status API', () => {
  it('parses the accepted response contract into frontend fields', () => {
    expect(parseServerStatus(onlineStatusPayload)).toMatchObject({
      state: 'online',
      onlinePlayers: 5,
      maxPlayers: 20,
      playerSampleAvailable: true,
      version: '26.2',
      protocolVersion: 776,
      checkedAt: '2026-08-01T04:07:17Z',
      stale: false,
      cached: false,
    })
    expect(parseServerStatus(onlineStatusPayload).players).toHaveLength(5)
  })

  it('rejects malformed counts, timestamps, and players', () => {
    expect(() =>
      parseServerStatus({ ...onlineStatusPayload, online_players: -1 }),
    ).toThrow(/online_players/)
    expect(() =>
      parseServerStatus({ ...onlineStatusPayload, checked_at: 'yesterday' }),
    ).toThrow(/checked_at/)
    expect(() =>
      parseServerStatus({ ...onlineStatusPayload, players: [{}] }),
    ).toThrow(/player/)
  })

  it('requests the versioned endpoint and forwards the abort signal', async () => {
    const fetchMock = mockServerStatusFetch()
    const controller = new AbortController()

    await expect(fetchServerStatus(controller.signal)).resolves.toMatchObject({
      state: 'online',
    })
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:6969/api/v1/server/status',
      expect.objectContaining({
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      }),
    )
  })

  it('rejects non-successful HTTP responses', async () => {
    mockServerStatusFetch({}, false)

    await expect(fetchServerStatus()).rejects.toThrow(/request failed/)
  })

  it('builds an encoded overlay-aware Mineatar face URL', () => {
    expect(buildPlayerHeadUrl('player id')).toBe(
      'https://api.mineatar.io/face/player%20id?scale=8&overlay=true',
    )
  })
})
