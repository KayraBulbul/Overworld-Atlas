import { describe, expect, it } from 'vitest'
import {
  getServerStatusRefetchInterval,
  serverStatusQueryKey,
  serverStatusQueryOptions,
  serverStatusRefetchInterval,
  serverStatusStaleTime,
  serverStatusUnavailableRefetchInterval,
} from './useServerStatus'

describe('server status query policy', () => {
  it('uses one stable key and the approved refresh behaviour', () => {
    const options = serverStatusQueryOptions()

    expect(options.queryKey).toBe(serverStatusQueryKey)
    expect(options.refetchInterval).toEqual(expect.any(Function))
    expect(options.refetchOnWindowFocus).toBe(true)
    expect(options.staleTime).toBe(serverStatusStaleTime)
  })

  it('rechecks unavailable status or a failed request sooner', () => {
    expect(getServerStatusRefetchInterval({ state: 'online' })).toBe(
      serverStatusRefetchInterval,
    )
    expect(getServerStatusRefetchInterval({ state: 'offline' })).toBe(
      serverStatusRefetchInterval,
    )
    expect(getServerStatusRefetchInterval({ state: 'unavailable' })).toBe(
      serverStatusUnavailableRefetchInterval,
    )
    expect(getServerStatusRefetchInterval(undefined, true)).toBe(
      serverStatusUnavailableRefetchInterval,
    )
  })
})
