import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AccessPreviewProvider } from '../../features/access/AccessPreviewProvider'
import { ThemeProvider } from '../../features/theme/ThemeProvider'
import { SiteHeader } from './SiteHeader'

describe('SiteHeader', () => {
  it('links every content destination to its full page', () => {
    render(
      <MemoryRouter>
        <ThemeProvider>
          <AccessPreviewProvider>
            <SiteHeader />
          </AccessPreviewProvider>
        </ThemeProvider>
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('img', { name: 'Overworld Atlas' }),
    ).toHaveAttribute('src', '/images/branding/overworld-atlas-logo.png')

    const destinations = [
      { label: 'Home', href: '/' },
      { label: 'Players', href: '/players' },
      { label: 'Map', href: '/map' },
      { label: 'Stories', href: '/stories' },
      { label: 'Events', href: '/events' },
      { label: 'Screenshots', href: '/screenshots' },
    ]

    expect(
      within(screen.getByRole('navigation', { name: 'Primary navigation' }))
        .getAllByRole('link')
        .map((link) => link.textContent),
    ).toEqual(destinations.map(({ label }) => label))

    for (const destination of destinations) {
      expect(
        screen.getByRole('link', { name: destination.label }),
      ).toHaveAttribute('href', destination.href)
    }

    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(screen.getByRole('link', { name: 'Players' })).not.toHaveAttribute(
      'aria-current',
    )
    expect(screen.getByRole('button', { name: 'Join' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Log In' })).toBeEnabled()
  })

  it('marks a section route active without leaving Home selected', () => {
    render(
      <MemoryRouter initialEntries={['/stories/bridge-beneath-the-fog']}>
        <ThemeProvider>
          <AccessPreviewProvider>
            <SiteHeader />
          </AccessPreviewProvider>
        </ThemeProvider>
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: 'Stories' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(screen.getByRole('link', { name: 'Home' })).not.toHaveAttribute(
      'aria-current',
    )
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

  it('opens and dismisses the compact navigation accessibly', async () => {
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

    const menuButton = screen.getByRole('button', {
      name: 'Open navigation menu',
    })
    const navigation = screen.getByRole('navigation', {
      name: 'Primary navigation',
    })

    await user.click(menuButton)
    expect(menuButton).toHaveAttribute('aria-expanded', 'true')
    expect(navigation).toHaveAttribute('data-open', 'true')

    await user.keyboard('{Escape}')
    expect(menuButton).toHaveAttribute('aria-expanded', 'false')
    expect(menuButton).toHaveFocus()
  })
})
