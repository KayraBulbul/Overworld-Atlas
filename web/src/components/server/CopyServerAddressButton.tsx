import { useEffect, useRef, useState } from 'react'

type CopyState = 'idle' | 'copied' | 'failed'

export function CopyServerAddressButton({ address }: { address: string }) {
  const [copyState, setCopyState] = useState<CopyState>('idle')
  const resetTimer = useRef<number | undefined>(undefined)

  useEffect(() => {
    return () => {
      window.clearTimeout(resetTimer.current)
    }
  }, [])

  async function copyAddress() {
    window.clearTimeout(resetTimer.current)

    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error('Clipboard API unavailable')
      }

      await navigator.clipboard.writeText(address)
      setCopyState('copied')
    } catch {
      setCopyState('failed')
    }

    resetTimer.current = window.setTimeout(() => {
      setCopyState('idle')
    }, 2200)
  }

  const feedback =
    copyState === 'copied'
      ? 'Copied to clipboard'
      : copyState === 'failed'
        ? 'Copy failed'
        : address

  return (
    <button className="copy-address-button" type="button" onClick={copyAddress}>
      <span>
        <small>Server address</small>
        <strong>{feedback}</strong>
      </span>
      <svg aria-hidden="true" viewBox="0 0 24 24">
        {copyState === 'copied' ? (
          <path d="m5 12.5 4.2 4.2L19 7" />
        ) : (
          <>
            <rect x="8" y="8" width="11" height="11" />
            <path d="M16 8V5H5v11h3" />
          </>
        )}
      </svg>
      <span className="visually-hidden" aria-live="polite">
        {copyState === 'copied'
          ? `Copied ${address}`
          : copyState === 'failed'
            ? `Could not copy ${address}`
            : ''}
      </span>
    </button>
  )
}
