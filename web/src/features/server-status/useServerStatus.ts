import { queryOptions, useQuery } from '@tanstack/react-query'
import { fetchServerStatus } from './serverStatusApi'
import type { ServerStatus } from './serverStatusApi'

export const serverStatusQueryKey = ['server-status'] as const
export const serverStatusRefetchInterval = 30_000
export const serverStatusUnavailableRefetchInterval = 5_000
export const serverStatusStaleTime = 15_000

export function getServerStatusRefetchInterval(
  status: Pick<ServerStatus, 'state'> | undefined,
  requestFailed = false,
) {
  return requestFailed || status?.state === 'unavailable'
    ? serverStatusUnavailableRefetchInterval
    : serverStatusRefetchInterval
}

export function serverStatusQueryOptions() {
  return queryOptions({
    queryKey: serverStatusQueryKey,
    queryFn: ({ signal }) => fetchServerStatus(signal),
    refetchInterval: (query) =>
      getServerStatusRefetchInterval(
        query.state.data,
        query.state.error !== null,
      ),
    refetchOnWindowFocus: true,
    retry: 1,
    staleTime: serverStatusStaleTime,
  })
}

export function useServerStatus() {
  return useQuery(serverStatusQueryOptions())
}
