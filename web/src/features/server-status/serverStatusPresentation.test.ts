import { describe, expect, it } from 'vitest'
import { parseServerStatus } from './serverStatusApi'
import { getServerStatusPresentation } from './serverStatusPresentation'
import { onlineStatusPayload } from '../../test/serverStatusFixtures'

describe('server status presentation', () => {
  it('keeps reported counts separate from the confirmed sample', () => {
    const status = parseServerStatus({
      ...onlineStatusPayload,
      online_players: 8,
      players: onlineStatusPayload.players.slice(0, 2),
    })

    const presentation = getServerStatusPresentation(status, 'success')

    expect(presentation.statusLabel).toBe('Online · 8/20 players')
    expect(presentation.playerHeading).toBe('8 players online')
    expect(presentation.confirmedPlayers).toHaveLength(2)
    expect(presentation.reportedPlayerCount).toBe('8/20 reported online')
  })

  it('distinguishes zero players from an unavailable sample', () => {
    const zeroPlayers = getServerStatusPresentation(
      parseServerStatus({
        ...onlineStatusPayload,
        online_players: 0,
        players: [],
      }),
      'success',
    )
    const missingSample = getServerStatusPresentation(
      parseServerStatus({
        ...onlineStatusPayload,
        player_sample_available: false,
        players: [],
      }),
      'success',
    )

    expect(zeroPlayers.playerMessage).toBe('No one is online right now.')
    expect(missingSample.playerMessage).toMatch(/names are not available/)
    expect(missingSample.playerHeading).toBe('5 players online')
  })

  it('does not render a null maximum in visitor-facing copy', () => {
    const presentation = getServerStatusPresentation(
      parseServerStatus({ ...onlineStatusPayload, max_players: null }),
      'success',
    )

    expect(presentation.statusLabel).toBe('Online · 5 players')
    expect(presentation.statusLabel).not.toContain('null')
  })

  it('handles an unknown online count without implying that nobody is online', () => {
    const presentation = getServerStatusPresentation(
      parseServerStatus({
        ...onlineStatusPayload,
        online_players: null,
        max_players: null,
        player_sample_available: null,
        players: null,
      }),
      'success',
    )

    expect(presentation.statusLabel).toBe('Online · player count unavailable')
    expect(presentation.playerHeading).toBe('Players online')
    expect(presentation.playerMessage).toMatch(/count and player names/)
    expect(presentation.playerMessage).not.toMatch(/no one/i)
  })

  it('does not expose ordinary cache metadata to visitors', () => {
    const presentation = getServerStatusPresentation(
      parseServerStatus({ ...onlineStatusPayload, cached: true }),
      'success',
    )

    expect(presentation.tone).toBe('online')
    expect(presentation.statusDetail).toBeNull()
    expect(JSON.stringify(presentation)).not.toMatch(/cached/i)
  })

  it('qualifies stale status with the last checked time', () => {
    const presentation = getServerStatusPresentation(
      parseServerStatus({ ...onlineStatusPayload, stale: true, cached: true }),
      'success',
    )

    expect(presentation.tone).toBe('stale')
    expect(presentation.statusDetail).toMatch(/Status may be out of date/)
    expect(presentation.statusDetail).toMatch(/Last checked/)
  })

  it('keeps unavailable and offline states distinct', () => {
    const unavailable = getServerStatusPresentation(
      parseServerStatus({
        state: 'unavailable',
        online_players: null,
        max_players: null,
        player_sample_available: null,
        players: null,
        version: null,
        protocol_version: null,
        checked_at: '2026-08-01T04:07:17Z',
        stale: false,
        cached: false,
      }),
      'success',
    )
    const offline = getServerStatusPresentation(
      parseServerStatus({
        state: 'offline',
        online_players: null,
        max_players: null,
        player_sample_available: null,
        players: null,
        version: null,
        protocol_version: null,
        checked_at: '2026-08-01T04:07:17Z',
        stale: false,
        cached: false,
      }),
      'success',
    )

    expect(unavailable.statusLabel).toBe('Status unavailable')
    expect(unavailable.playerMessage).toMatch(/does not mean.*offline/i)
    expect(offline.statusLabel).toBe('Server offline')
  })

  it('presents request errors as unavailable rather than offline', () => {
    const presentation = getServerStatusPresentation(undefined, 'error')

    expect(presentation.statusLabel).toBe('Status unavailable')
    expect(presentation.canRetry).toBe(true)
    expect(presentation.statusLabel).not.toContain('offline')
  })
})
