import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { CopyServerAddressButton } from './CopyServerAddressButton'

const address = '51.161.199.235:25584'

describe('CopyServerAddressButton', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('copies the address and resets its feedback', async () => {
    vi.useFakeTimers()
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    })

    render(<CopyServerAddressButton address={address} />)
    fireEvent.click(screen.getByRole('button', { name: /server address/i }))

    await act(async () => {
      await Promise.resolve()
    })

    expect(writeText).toHaveBeenCalledWith(address)
    expect(screen.getByText('Copied to clipboard')).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(2200)
    })

    expect(screen.getByText(address)).toBeInTheDocument()
  })

  it('reports clipboard failure', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: vi.fn().mockRejectedValue(new Error('denied')) },
    })

    render(<CopyServerAddressButton address={address} />)
    fireEvent.click(screen.getByRole('button', { name: /server address/i }))

    await waitFor(() => {
      expect(screen.getByText('Copy failed')).toBeInTheDocument()
    })
  })
})
