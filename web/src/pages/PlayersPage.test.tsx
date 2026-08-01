import { screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderWithQueryClient } from '../test/renderWithQueryClient'
import {
  mockServerStatusFetch,
  onlineStatusPayload,
} from '../test/serverStatusFixtures'
import { PlayersPage } from './PlayersPage'

afterEach(() => {
  vi.unstubAllGlobals()
})

function renderPlayersPage() {
  return renderWithQueryClient(
    <MemoryRouter>
      <PlayersPage />
    </MemoryRouter>,
  )
}

describe('PlayersPage live states', () => {
  it('shows an honest empty state when nobody is online', async () => {
    mockServerStatusFetch({
      ...onlineStatusPayload,
      online_players: 0,
      players: [],
    })
    renderPlayersPage()

    expect(
      await screen.findByText('No one is online right now.'),
    ).toBeInTheDocument()
    expect(screen.getByText('0/20 reported online')).toBeInTheDocument()
  })

  it('offers a retry without calling a failed request offline', async () => {
    mockServerStatusFetch({}, false)
    renderPlayersPage()

    expect(
      await screen.findByText(
        /does not mean the server is offline/i,
        {},
        { timeout: 3_000 },
      ),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Try again' }),
    ).toBeInTheDocument()
    expect(screen.queryByText('Server offline')).not.toBeInTheDocument()
  })

  it('shows stale qualification without exposing ordinary cache metadata', async () => {
    mockServerStatusFetch({
      ...onlineStatusPayload,
      stale: true,
      cached: true,
    })
    renderPlayersPage()

    expect(await screen.findAllByTestId('player-record')).toHaveLength(5)
    expect(screen.getByText('5/20 reported online')).toBeInTheDocument()
    expect(screen.getByText(/Status may be out of date/)).toBeInTheDocument()
    expect(screen.queryByText(/cached/i)).not.toBeInTheDocument()
  })
})
