import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className="page-shell placeholder-page">
      <p className="eyebrow">Uncharted territory</p>
      <h1>Page not found</h1>
      <p>This location has not been entered into the archive.</p>
      <Link className="text-link" to="/#home">
        Return home
      </Link>
    </section>
  )
}
