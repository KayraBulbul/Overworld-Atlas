import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { EventsPage } from './EventsPage'
import { MapPage } from './MapPage'
import { PlayersPage } from './PlayersPage'
import { ScreenshotsPage } from './ScreenshotsPage'
import { StoriesPage } from './StoriesPage'

function renderPage(page: React.ReactNode) {
  return render(<MemoryRouter>{page}</MemoryRouter>)
}

describe('public preview pages', () => {
  it('shows every fixture player and their statistics', () => {
    renderPage(<PlayersPage />)

    expect(screen.getAllByTestId('player-record')).toHaveLength(6)
    expect(screen.getAllByText('Playtime')).toHaveLength(6)
  })

  it('keeps the map as a secure static preview', () => {
    const { container } = renderPage(<MapPage />)

    expect(screen.getByText('Secure integration pending')).toBeInTheDocument()
    expect(container.querySelector('iframe')).not.toBeInTheDocument()
  })

  it('lists all fixture stories', () => {
    renderPage(<StoriesPage />)

    expect(screen.getByText('The Bridge Beneath the Fog')).toBeInTheDocument()
    expect(screen.getAllByText('Preview entry')).toHaveLength(4)
  })

  it('separates upcoming and past events', () => {
    renderPage(<EventsPage />)

    expect(
      screen.getByRole('heading', { name: 'Upcoming events' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Past events' }),
    ).toBeInTheDocument()
  })

  it('shows the complete screenshot fixture gallery', () => {
    renderPage(<ScreenshotsPage />)

    expect(screen.getAllByTestId('screenshot-entry')).toHaveLength(6)
  })
})
