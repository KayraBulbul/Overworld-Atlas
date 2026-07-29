import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ScrollToLocation } from './ScrollToLocation'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('ScrollToLocation', () => {
  it('aligns the requested homepage subject below the header', () => {
    const section = document.createElement('div')
    const scrollIntoView = vi.fn()

    section.id = 'map'
    section.scrollIntoView = scrollIntoView
    document.body.append(section)

    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(0)
      return 1
    })
    vi.stubGlobal('cancelAnimationFrame', vi.fn())
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: false }))

    render(
      <MemoryRouter initialEntries={['/#map']}>
        <ScrollToLocation />
      </MemoryRouter>,
    )

    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    })

    section.remove()
  })
})
