import { Link } from 'react-router-dom'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <Link className="footer-brand" to="/#home">
          <img src="/images/branding/goon-squad-logo.png" alt="Goon Squad" />
        </Link>
        <p className="footer-credit">Built by the people who document it.</p>
        <nav className="footer-links" aria-label="Footer navigation">
          <Link to="/#map">Map</Link>
          <Link to="/#stories">Archive</Link>
          <Link to="/#events">Events</Link>
        </nav>
      </div>
    </footer>
  )
}
