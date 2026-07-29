import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { useAccessPreview } from './accessContext'
import { AccessPreviewProvider } from './AccessPreviewProvider'

function PreviewControls() {
  const { openJoinPreview, openLoginPreview } = useAccessPreview()

  return (
    <>
      <button type="button" onClick={openJoinPreview}>
        Open application
      </button>
      <button type="button" onClick={openLoginPreview}>
        Open login
      </button>
    </>
  )
}

describe('AccessPreviewProvider', () => {
  it('shows a fillable application preview with submission disabled', async () => {
    const user = userEvent.setup()

    render(
      <AccessPreviewProvider>
        <PreviewControls />
      </AccessPreviewProvider>,
    )

    await user.click(screen.getByRole('button', { name: 'Open application' }))

    expect(
      screen.getByRole('dialog', { name: 'Request passage' }),
    ).toBeInTheDocument()
    await user.type(
      screen.getByLabelText('Minecraft Java username'),
      'PreviewPlayer',
    )
    expect(screen.getByLabelText('Minecraft Java username')).toHaveValue(
      'PreviewPlayer',
    )
    expect(
      screen.getByRole('button', { name: 'Continue with Discord' }),
    ).toBeDisabled()
    expect(
      screen.getByRole('button', { name: 'Submit application' }),
    ).toBeDisabled()

    await user.keyboard('{Escape}')
    expect(
      screen.queryByRole('dialog', { name: 'Request passage' }),
    ).not.toBeInTheDocument()
  })

  it('opens a separate login preview without application fields', async () => {
    const user = userEvent.setup()

    render(
      <AccessPreviewProvider>
        <PreviewControls />
      </AccessPreviewProvider>,
    )

    await user.click(screen.getByRole('button', { name: 'Open login' }))

    expect(
      screen.getByRole('dialog', { name: 'Log in as a returning member' }),
    ).toBeInTheDocument()
    expect(
      screen.queryByLabelText('Minecraft Java username'),
    ).not.toBeInTheDocument()
  })
})
