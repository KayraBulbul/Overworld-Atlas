import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAccessPreview } from '../../features/access/accessContext'
import { ThemeToggle } from '../../features/theme/ThemeToggle'

const navigation = [
  { label: 'Home', hash: 'home' },
  { label: 'Map', hash: 'map' },
  { label: 'Players', hash: 'players' },
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
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" to="/#home" onClick={closeMenu}>
          <span className="brand-mark" aria-hidden="true">
            GS
          </span>
          <span className="brand-copy">
            <strong>Goon Squad</strong>
            <small>World archive</small>
          </span>
        </Link>

        <button
          className="menu-button"
          type="button"
          aria-controls="primary-navigation"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
        >
          <span aria-hidden="true">Menu</span>
          <span className="menu-lines" aria-hidden="true" />
        </button>

        <nav
          id="primary-navigation"
          className="primary-navigation"
          aria-label="Primary navigation"
          data-open={isMenuOpen}
        >
          {navigation.map((item) => (
            <Link key={item.hash} to={`/#${item.hash}`} onClick={closeMenu}>
              {item.label}
            </Link>
          ))}
          <button
            className="nav-join"
            type="button"
            onClick={() => {
              closeMenu()
              openJoinPreview()
            }}
          >
            Join
          </button>
        </nav>

        <div className="header-actions">
          <ThemeToggle />
          <button
            className="login-button"
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
