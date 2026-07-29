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
    expect(screen.getAllByTestId('player-preview')).toHaveLength(4)
    expect(screen.getByText('Online preview')).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /explore the full world/i }),
    ).toHaveAttribute('href', '/map')
    expect(
      screen.getByRole('link', { name: /open the gallery/i }),
    ).toHaveAttribute('href', '/screenshots')
    expect(screen.getByRole('button', { name: 'Request Access' })).toBeEnabled()
  })
})
