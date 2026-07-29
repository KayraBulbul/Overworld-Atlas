import { Link } from 'react-router-dom'

type PageMastheadProps = {
  index: string
  eyebrow: string
  title: string
  description: string
  note: string
}

export function PageMasthead({
  index,
  eyebrow,
  title,
  description,
  note,
}: PageMastheadProps) {
  return (
    <header className="page-masthead page-shell">
      <div className="page-index" aria-hidden="true">
        {index}
      </div>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
      </div>
      <div className="masthead-summary">
        <p>{description}</p>
        <p className="preview-note">{note}</p>
        <Link className="text-link" to="/#home">
          Return to the homepage
        </Link>
      </div>
    </header>
  )
}
