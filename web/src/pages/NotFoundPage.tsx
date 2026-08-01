import { tw } from '../styles/tailwindStyles'
import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className={tw('page-shell placeholder-page')}>
      <p className={tw('eyebrow')}>Uncharted territory</p>
      <h1>Page not found</h1>
      <p>This location has not been entered into the archive.</p>
      <Link className={tw('text-link')} to="/">
        Return home
      </Link>
    </section>
  )
}
