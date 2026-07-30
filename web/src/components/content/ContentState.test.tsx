import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ContentState } from './ContentState'

describe('ContentState', () => {
  it('announces loading without reporting an error', () => {
    render(
      <ContentState
        kind="loading"
        title="Reading the archive"
        message="The latest entries are on their way."
      />,
    )

    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('announces an error and supports a retry action', async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()

    render(
      <ContentState
        kind="error"
        title="The archive could not be opened"
        message="Try the request again."
        actionLabel="Try again"
        onAction={onRetry}
      />,
    )

    expect(screen.getByRole('alert')).toHaveTextContent(
      'The archive could not be opened',
    )
    await user.click(screen.getByRole('button', { name: 'Try again' }))
    expect(onRetry).toHaveBeenCalledOnce()
  })

  it('presents an unavailable state without requiring an action', () => {
    render(
      <ContentState
        kind="unavailable"
        title="The world map is unavailable"
        message="Use the external map when it becomes available."
      />,
    )

    expect(screen.getByRole('status')).toHaveTextContent(
      'Currently unavailable',
    )
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
