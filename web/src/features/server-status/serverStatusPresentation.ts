import type { ServerStatus, ServerStatusPlayer } from './serverStatusApi'

export type ServerStatusRequestState = 'loading' | 'error' | 'success'
export type ServerStatusTone =
  'loading' | 'online' | 'offline' | 'unavailable' | 'stale'

export type ServerStatusPresentation = {
  tone: ServerStatusTone
  statusLabel: string
  statusDetail: string | null
  playerHeading: string
  playerMessage: string | null
  confirmedPlayers: ServerStatusPlayer[]
  reportedPlayerCount: string
  canRetry: boolean
}

const checkedAtFormatter = new Intl.DateTimeFormat('en-AU', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

function formatCheckedAt(checkedAt: string) {
  return checkedAtFormatter.format(new Date(checkedAt))
}

function formatPlayerNoun(count: number) {
  return count === 1 ? 'player' : 'players'
}

function formatHeroCount(status: ServerStatus) {
  if (status.onlinePlayers === null) {
    return 'player count unavailable'
  }

  if (status.maxPlayers !== null) {
    return `${status.onlinePlayers}/${status.maxPlayers} players`
  }

  return `${status.onlinePlayers} ${formatPlayerNoun(status.onlinePlayers)}`
}

function formatReportedCount(status: ServerStatus) {
  if (status.onlinePlayers === null) {
    return 'Reported count unavailable'
  }

  if (status.maxPlayers !== null) {
    return `${status.onlinePlayers}/${status.maxPlayers} reported online`
  }

  return `${status.onlinePlayers} reported online`
}

export function getServerStatusPresentation(
  status: ServerStatus | undefined,
  requestState: ServerStatusRequestState,
): ServerStatusPresentation {
  if (requestState === 'loading') {
    return {
      tone: 'loading',
      statusLabel: 'Checking server status',
      statusDetail: 'Contacting the Minecraft server…',
      playerHeading: 'Checking who is online',
      playerMessage: 'The confirmed player list is on its way.',
      confirmedPlayers: [],
      reportedPlayerCount: 'Awaiting live status',
      canRetry: false,
    }
  }

  if (requestState === 'error' || !status) {
    return {
      tone: 'unavailable',
      statusLabel: 'Status unavailable',
      statusDetail: 'Live status could not be checked.',
      playerHeading: 'Player list unavailable',
      playerMessage:
        'The live player list could not be loaded. This does not mean the server is offline.',
      confirmedPlayers: [],
      reportedPlayerCount: 'Live status unavailable',
      canRetry: true,
    }
  }

  if (status.state === 'offline') {
    return {
      tone: status.stale ? 'stale' : 'offline',
      statusLabel: 'Server offline',
      statusDetail: status.stale
        ? `Status may be out of date. Last checked ${formatCheckedAt(status.checkedAt)}.`
        : null,
      playerHeading: 'Server offline',
      playerMessage:
        'Confirmed player information is unavailable while the server is offline.',
      confirmedPlayers: [],
      reportedPlayerCount: 'Server offline',
      canRetry: false,
    }
  }

  if (status.state === 'unavailable') {
    return {
      tone: 'unavailable',
      statusLabel: 'Status unavailable',
      statusDetail: `Last checked ${formatCheckedAt(status.checkedAt)}.`,
      playerHeading: 'Player list unavailable',
      playerMessage:
        'The status check is temporarily unavailable. This does not mean the server is offline.',
      confirmedPlayers: [],
      reportedPlayerCount: 'Live status unavailable',
      canRetry: true,
    }
  }

  const onlinePlayers = status.onlinePlayers
  const sampledPlayers =
    status.playerSampleAvailable === true ? (status.players ?? []) : []
  const confirmedPlayers = onlinePlayers === 0 ? [] : sampledPlayers
  let playerMessage: string | null = null

  if (onlinePlayers === 0) {
    playerMessage = 'No one is online right now.'
  } else if (onlinePlayers === null && confirmedPlayers.length === 0) {
    playerMessage = 'The online count and player names are not available.'
  } else if (
    status.playerSampleAvailable !== true ||
    confirmedPlayers.length === 0
  ) {
    playerMessage =
      'The server reports players online, but their names are not available.'
  }

  return {
    tone: status.stale ? 'stale' : 'online',
    statusLabel: `Online · ${formatHeroCount(status)}`,
    statusDetail: status.stale
      ? `Status may be out of date. Last checked ${formatCheckedAt(status.checkedAt)}.`
      : null,
    playerHeading:
      onlinePlayers === null
        ? 'Players online'
        : `${onlinePlayers} ${formatPlayerNoun(onlinePlayers)} online`,
    playerMessage,
    confirmedPlayers,
    reportedPlayerCount: formatReportedCount(status),
    canRetry: false,
  }
}
