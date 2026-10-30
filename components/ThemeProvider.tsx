'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type Theme = 'dark' | 'light'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
})

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('neurovoice-theme') as Theme
    const resolved = stored || 'dark'
    setTheme(resolved)
    applyTheme(resolved)
  }, [])

  const applyTheme = (t: Theme) => {
    const html = document.documentElement
    if (t === 'dark') {
      html.classList.add('dark')
      html.classList.remove('light')
    } else {
      html.classList.add('light')
      html.classList.remove('dark')
    }
  }

  const toggleTheme = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('neurovoice-theme', next)
    applyTheme(next)
  }

  if (!mounted) return <>{children}</>

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
