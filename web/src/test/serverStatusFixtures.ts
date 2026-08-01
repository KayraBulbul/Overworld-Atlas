import { vi } from 'vitest'

export const onlineStatusPayload = {
  state: 'online',
  online_players: 5,
  max_players: 20,
  player_sample_available: true,
  players: [
    {
      username: 'MagicGN',
      uuid: '00000000-0000-0000-0000-000000000001',
    },
    {
      username: 'Aurahimself',
      uuid: '00000000-0000-0000-0000-000000000002',
    },
    {
      username: 'Goose',
      uuid: '00000000-0000-0000-0000-000000000003',
    },
    {
      username: 'Pickle',
      uuid: '00000000-0000-0000-0000-000000000004',
    },
    {
      username: 'Moss',
      uuid: '00000000-0000-0000-0000-000000000005',
    },
  ],
  version: '26.2',
  protocol_version: 776,
  checked_at: '2026-08-01T04:07:17Z',
  stale: false,
  cached: false,
} as const

export function mockServerStatusFetch(
  payload: unknown = onlineStatusPayload,
  ok = true,
) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok,
    json: vi.fn().mockResolvedValue(payload),
  })

  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}
