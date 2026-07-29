import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { ThemeProvider } from '../../features/theme/ThemeProvider'
import { SiteHeader } from './SiteHeader'

describe('SiteHeader', () => {
  it('links every content destination to its homepage section', () => {
    render(
      <MemoryRouter>
        <ThemeProvider>
          <SiteHeader />
        </ThemeProvider>
      </MemoryRouter>,
    )

    for (const destination of [
      'Home',
      'Map',
      'Players',
      'Stories',
      'Events',
      'Screenshots',
    ]) {
      expect(screen.getByRole('link', { name: destination })).toHaveAttribute(
        'href',
        `/#${destination.toLowerCase()}`,
      )
    }

    expect(screen.getByRole('button', { name: 'Join' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Log In' })).toBeDisabled()
  })
})
