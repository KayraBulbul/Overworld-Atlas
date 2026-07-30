type ContentStateProps = {
  kind: 'loading' | 'error' | 'unavailable'
  title: string
  message: string
  actionLabel?: string
  onAction?: () => void
}

const labels = {
  loading: 'Loading',
  error: 'Something went wrong',
  unavailable: 'Currently unavailable',
} as const

export function ContentState({
  kind,
  title,
  message,
  actionLabel,
  onAction,
}: ContentStateProps) {
  return (
    <section
      className="content-state"
      data-kind={kind}
      role={kind === 'error' ? 'alert' : 'status'}
      aria-live={kind === 'error' ? 'assertive' : 'polite'}
      aria-busy={kind === 'loading' ? true : undefined}
    >
      <span className="content-state-marker" aria-hidden="true" />
      <div>
        <p className="eyebrow">{labels[kind]}</p>
        <strong>{title}</strong>
        <p>{message}</p>
      </div>
      {actionLabel && onAction ? (
        <button
          className="content-state-action"
          type="button"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      ) : null}
    </section>
  )
}
