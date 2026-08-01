import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PlayerHead } from './PlayerHead'

describe('PlayerHead', () => {
  it('uses an overlay-aware head render first and falls back locally without looping', () => {
    const { container } = render(<PlayerHead uuid="player-id" />)
    const image = container.querySelector('img')

    expect(image).toHaveAttribute(
      'src',
      'https://api.mineatar.io/face/player-id?scale=8&overlay=true',
    )
    expect(image).toHaveAttribute('alt', '')

    fireEvent.error(image!)
    expect(image).toHaveAttribute('src', '/images/players/steve-head.png')

    fireEvent.error(image!)
    expect(image).toHaveAttribute('src', '/images/players/steve-head.png')
  })
})
