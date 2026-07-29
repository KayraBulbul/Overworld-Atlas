import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AccessPreviewProvider } from '../../features/access/AccessPreviewProvider'
import { ThemeProvider } from '../../features/theme/ThemeProvider'
import { SiteHeader } from './SiteHeader'

describe('SiteHeader', () => {
  it('links every content destination to its homepage section', () => {
    render(
      <MemoryRouter>
        <ThemeProvider>
          <AccessPreviewProvider>
            <SiteHeader />
          </AccessPreviewProvider>
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

    expect(screen.getByRole('button', { name: 'Join' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Log In' })).toBeEnabled()
  })

  it('keeps login and join as separate intents', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <ThemeProvider>
          <AccessPreviewProvider>
            <SiteHeader />
          </AccessPreviewProvider>
        </ThemeProvider>
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: 'Log In' }))
    expect(
      screen.getByRole('dialog', { name: 'Log in as a returning member' }),
    ).toBeInTheDocument()
    expect(
      screen.queryByLabelText('Minecraft Java username'),
    ).not.toBeInTheDocument()
  })
})
