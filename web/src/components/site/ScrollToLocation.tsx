import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function ScrollToLocation() {
  const location = useLocation()

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0 })
      return
    }

    const sectionId = decodeURIComponent(location.hash.slice(1))
    const frame = window.requestAnimationFrame(() => {
      const section = document.getElementById(sectionId)
      const reduceMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches

      section?.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',
        block: 'start',
      })
    })

    return () => {
      window.cancelAnimationFrame(frame)
    }
  }, [location.hash, location.pathname])

  return null
}
