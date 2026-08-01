export type ServerStatusState = 'online' | 'offline' | 'unavailable'

export type ServerStatusPlayer = {
  username: string
  uuid: string
}

export type ServerStatus = {
  state: ServerStatusState
  onlinePlayers: number | null
  maxPlayers: number | null
  playerSampleAvailable: boolean | null
  players: ServerStatusPlayer[] | null
  version: string | null
  protocolVersion: number | null
  checkedAt: string
  stale: boolean
  cached: boolean
}

type ServerStatusPayload = {
  state: unknown
  online_players: unknown
  max_players: unknown
  player_sample_available: unknown
  players: unknown
  version: unknown
  protocol_version: unknown
  checked_at: unknown
  stale: unknown
  cached: unknown
}

const defaultApiBaseUrl = 'http://localhost:6969/api/v1'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function readNullableInteger(value: unknown, field: string) {
  if (value === null) {
    return null
  }

  if (!Number.isInteger(value) || (value as number) < 0) {
    throw new Error(`Invalid ${field} in server status response.`)
  }

  return value as number
}

function readNullableBoolean(value: unknown, field: string) {
  if (value === null) {
    return null
  }

  if (typeof value !== 'boolean') {
    throw new Error(`Invalid ${field} in server status response.`)
  }

  return value
}

function readNullableString(value: unknown, field: string) {
  if (value === null) {
    return null
  }

  if (typeof value !== 'string') {
    throw new Error(`Invalid ${field} in server status response.`)
  }

  return value
}

function readPlayers(value: unknown): ServerStatusPlayer[] | null {
  if (value === null) {
    return null
  }

  if (!Array.isArray(value)) {
    throw new Error('Invalid players in server status response.')
  }

  return value.map((player) => {
    if (
      !isRecord(player) ||
      typeof player.username !== 'string' ||
      player.username.length === 0 ||
      typeof player.uuid !== 'string' ||
      player.uuid.length === 0
    ) {
      throw new Error('Invalid player in server status response.')
    }

    return {
      username: player.username,
      uuid: player.uuid,
    }
  })
}

export function parseServerStatus(value: unknown): ServerStatus {
  if (!isRecord(value)) {
    throw new Error('Invalid server status response.')
  }

  const payload = value as ServerStatusPayload
  if (
    payload.state !== 'online' &&
    payload.state !== 'offline' &&
    payload.state !== 'unavailable'
  ) {
    throw new Error('Invalid state in server status response.')
  }

  if (
    typeof payload.checked_at !== 'string' ||
    Number.isNaN(Date.parse(payload.checked_at))
  ) {
    throw new Error('Invalid checked_at in server status response.')
  }

  if (typeof payload.stale !== 'boolean') {
    throw new Error('Invalid stale in server status response.')
  }

  if (typeof payload.cached !== 'boolean') {
    throw new Error('Invalid cached in server status response.')
  }

  return {
    state: payload.state,
    onlinePlayers: readNullableInteger(
      payload.online_players,
      'online_players',
    ),
    maxPlayers: readNullableInteger(payload.max_players, 'max_players'),
    playerSampleAvailable: readNullableBoolean(
      payload.player_sample_available,
      'player_sample_available',
    ),
    players: readPlayers(payload.players),
    version: readNullableString(payload.version, 'version'),
    protocolVersion: readNullableInteger(
      payload.protocol_version,
      'protocol_version',
    ),
    checkedAt: payload.checked_at,
    stale: payload.stale,
    cached: payload.cached,
  }
}

function apiBaseUrl() {
  return (import.meta.env.VITE_API_BASE_URL || defaultApiBaseUrl).replace(
    /\/+$/,
    '',
  )
}

export async function fetchServerStatus(signal?: AbortSignal) {
  const response = await fetch(`${apiBaseUrl()}/server/status`, {
    headers: { Accept: 'application/json' },
    signal,
  })

  if (!response.ok) {
    throw new Error('The server status request failed.')
  }

  return parseServerStatus(await response.json())
}

export function buildPlayerHeadUrl(uuid: string) {
  return `https://api.mineatar.io/face/${encodeURIComponent(uuid)}?scale=8&overlay=true`
}

export const playerHeadFallbackUrl = '/images/players/steve-head.png'
