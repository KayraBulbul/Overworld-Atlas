import { tw } from '../../styles/tailwindStyles'
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
    <header className={tw('page-masthead page-shell')}>
      <div className={tw('page-index')} aria-hidden="true">
        {index}
      </div>
      <div>
        <p className={tw('eyebrow')}>{eyebrow}</p>
        <h1>{title}</h1>
      </div>
      <div className={tw('masthead-summary')}>
        <p>{description}</p>
        <p className={tw('preview-note')}>{note}</p>
        <Link className={tw('text-link')} to="/">
          Return to the homepage
        </Link>
      </div>
    </header>
  )
}
