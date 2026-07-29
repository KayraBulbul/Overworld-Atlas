import { Link } from 'react-router-dom'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div>
          <p className="footer-mark">GS</p>
          <p>A private Fabric world, documented by the people who built it.</p>
        </div>
        <div className="footer-links" aria-label="Footer navigation">
          <Link to="/#home">Return home</Link>
          <Link to="/#screenshots">Browse screenshots</Link>
        </div>
        <p className="footer-note">Phase 1 world archive preview</p>
      </div>
    </footer>
  )
}
