import { tw } from '../../styles/tailwindStyles'
import { useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAccessPreview } from '../../features/access/accessContext'
import { ThemeToggle } from '../../features/theme/ThemeToggle'

const navigation = [
  { label: 'Home', to: '/', end: true },
  { label: 'Players', to: '/players', end: false },
  { label: 'Map', to: '/map', end: false },
  { label: 'Stories', to: '/stories', end: false },
  { label: 'Events', to: '/events', end: false },
  { label: 'Screenshots', to: '/screenshots', end: false },
]

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const { openJoinPreview, openLoginPreview } = useAccessPreview()

  function closeMenu() {
    setIsMenuOpen(false)
  }

  return (
    <header
      className={tw('site-header')}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && isMenuOpen) {
          setIsMenuOpen(false)
          menuButtonRef.current?.focus()
        }
      }}
    >
      <div className={tw('header-inner')}>
        <Link className={tw('brand')} to="/" onClick={closeMenu}>
          <img
            className={tw('brand-logo')}
            src="/images/branding/goon-squad-logo.png"
            alt="Goon Squad"
          />
        </Link>

        <button
          ref={menuButtonRef}
          className={tw('menu-button')}
          type="button"
          aria-label={
            isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'
          }
          aria-controls="primary-navigation"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
        >
          <span aria-hidden="true">{isMenuOpen ? 'Close' : 'Menu'}</span>
          <span
            className={tw('menu-lines')}
            data-open={isMenuOpen}
            aria-hidden="true"
          />
        </button>

        <nav
          id="primary-navigation"
          className={tw('primary-navigation')}
          aria-label="Primary navigation"
          data-open={isMenuOpen}
        >
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={closeMenu}
            >
              {item.label}
            </NavLink>
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
