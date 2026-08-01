import { screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AccessPreviewProvider } from '../features/access/AccessPreviewProvider'
import { renderWithQueryClient } from '../test/renderWithQueryClient'
import {
  mockServerStatusFetch,
  onlineStatusPayload,
} from '../test/serverStatusFixtures'
import { HomePage } from './HomePage'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('HomePage', () => {
  it('renders the live homepage while preserving the approved composition', async () => {
    mockServerStatusFetch()
    renderWithQueryClient(
      <MemoryRouter>
        <AccessPreviewProvider>
          <HomePage />
        </AccessPreviewProvider>
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', {
        name: 'A world shaped by the people who play it.',
      }),
    ).toBeInTheDocument()
    expect(
      screen
        .getByRole('heading', { name: 'Goon Squad Mountain' })
        .closest('.home-hero'),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('img', {
        name: /a path through goon squad mountain/i,
      }),
    ).toHaveAttribute('src', '/images/settlements/featured_settlement.webp')
    expect(screen.getByText('-1129, 119, 1030')).toBeInTheDocument()
    expect(screen.getByText('The promised land')).toBeInTheDocument()
    expect(await screen.findAllByTestId('player-preview')).toHaveLength(4)
    expect(screen.getByText('Online · 5/20 players')).toBeInTheDocument()
    expect(screen.queryByText(/Phase 1 preview data/)).not.toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /explore the full world/i }),
    ).toHaveAttribute('href', '/map')
    expect(
      screen.getByRole('link', { name: /open the gallery/i }),
    ).toHaveAttribute('href', '/screenshots')
    expect(screen.getByRole('button', { name: 'Request Access' })).toBeEnabled()

    const storiesSection = screen
      .getByRole('heading', { name: 'Recent stories' })
      .closest('section')
    const eventsSection = screen
      .getByRole('heading', { name: 'End City Expedition' })
      .closest('section')

    expect(storiesSection?.parentElement).toBe(eventsSection?.parentElement)
    expect(document.querySelector('#map')).toHaveClass('section-heading')
    expect(document.querySelector('#stories')).toHaveClass(
      'story-ledger-heading',
    )
  })

  it('preserves a known count when player names are unavailable', async () => {
    mockServerStatusFetch({
      ...onlineStatusPayload,
      player_sample_available: false,
      players: [],
    })
    renderWithQueryClient(
      <MemoryRouter>
        <AccessPreviewProvider>
          <HomePage />
        </AccessPreviewProvider>
      </MemoryRouter>,
    )

    expect(await screen.findByText('Online · 5/20 players')).toBeInTheDocument()
    expect(screen.getByText('5 players online')).toBeInTheDocument()
    expect(screen.getByText(/names are not available/)).toBeInTheDocument()
    expect(screen.queryByTestId('player-preview')).not.toBeInTheDocument()
  })
})
