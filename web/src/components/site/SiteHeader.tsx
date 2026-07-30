import { tw } from '../../styles/tailwindStyles'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAccessPreview } from '../../features/access/accessContext'
import { ThemeToggle } from '../../features/theme/ThemeToggle'

const navigation = [
  { label: 'Home', hash: 'home' },
  { label: 'Players', hash: 'players' },
  { label: 'Map', hash: 'map' },
  { label: 'Stories', hash: 'stories' },
  { label: 'Events', hash: 'events' },
  { label: 'Screenshots', hash: 'screenshots' },
]

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { openJoinPreview, openLoginPreview } = useAccessPreview()

  function closeMenu() {
    setIsMenuOpen(false)
  }

  return (
    <header className={tw('site-header')}>
      <div className={tw('header-inner')}>
        <Link className={tw('brand')} to="/#home" onClick={closeMenu}>
          <img
            className={tw('brand-logo')}
            src="/images/branding/goon-squad-logo.png"
            alt="Goon Squad"
          />
        </Link>

        <button
          className={tw('menu-button')}
          type="button"
          aria-controls="primary-navigation"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
        >
          <span aria-hidden="true">Menu</span>
          <span className={tw('menu-lines')} aria-hidden="true" />
        </button>

        <nav
          id="primary-navigation"
          className={tw('primary-navigation')}
          aria-label="Primary navigation"
          data-open={isMenuOpen}
        >
          {navigation.map((item) => (
            <Link key={item.hash} to={`/#${item.hash}`} onClick={closeMenu}>
              {item.label}
            </Link>
          ))}
          <button
            className={tw('nav-join')}
            type="button"
            onClick={() => {
              closeMenu()
              openJoinPreview()
            }}
          >
            Join
          </button>
        </nav>

        <div className={tw('header-actions')}>
          <ThemeToggle />
          <button
            className={tw('login-button')}
            type="button"
            onClick={openLoginPreview}
          >
            Log In
          </button>
        </div>
      </div>
    </header>
  )
}
