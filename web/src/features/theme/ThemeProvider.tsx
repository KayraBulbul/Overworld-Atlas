import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { ThemeContext } from './themeContext'
import type { Theme } from './themeContext'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
  }, [theme])

  return (
    <ThemeContext
      value={{
        theme,
        toggleTheme: () => {
          setTheme((currentTheme) =>
            currentTheme === 'light' ? 'dark' : 'light',
          )
        },
      }}
    >
      {children}
    </ThemeContext>
  )
}
