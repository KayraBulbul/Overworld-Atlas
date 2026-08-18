import { tw } from '../../styles/tailwindStyles'
import { Link } from 'react-router-dom'

export function SiteFooter() {
  return (
    <footer className={tw('site-footer')}>
      <div className={tw('footer-inner')}>
        <Link className={tw('footer-brand')} to="/">
          <img
            src="/images/branding/overworld-atlas-logo.png"
            alt="Overworld Atlas"
          />
        </Link>
        <p className={tw('footer-credit')}>
          Built by the people who document it.
        </p>
        <nav className={tw('footer-links')} aria-label="Footer navigation">
          <Link to="/map">Map</Link>
          <Link to="/stories">Archive</Link>
          <Link to="/events">Events</Link>
        </nav>
      </div>
    </footer>
  )
}
