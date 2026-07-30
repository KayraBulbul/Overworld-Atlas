import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AccessPreviewProvider } from '../features/access/AccessPreviewProvider'
import { HomePage } from './HomePage'

describe('HomePage', () => {
  it('renders the complete static homepage preview', () => {
    render(
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
    expect(screen.getAllByTestId('player-preview')).toHaveLength(4)
    expect(screen.getByText('Online preview')).toBeInTheDocument()
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
})
