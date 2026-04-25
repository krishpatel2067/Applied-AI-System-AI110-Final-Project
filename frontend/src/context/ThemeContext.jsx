/**
 * src/context/ThemeContext.jsx
 * ----------------------------
 * Provides app-wide theme management: 'light' | 'dark' | 'auto'.
 *
 * - 'light' / 'dark': force that mode regardless of system preference.
 * - 'auto': follow the OS/browser prefers-color-scheme media query, and
 *   update automatically if the system setting changes at runtime.
 *
 * Dark mode is applied by toggling the 'dark' class on <html>, which is
 * what Shadcn's CSS variable block uses as its selector.
 *
 * The chosen theme is persisted to localStorage so it survives page reloads.
 */

import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('pawpal-theme') ?? 'auto'
  )

  useEffect(() => {
    const root = document.documentElement
    localStorage.setItem('pawpal-theme', theme)

    const apply = (dark) => root.classList.toggle('dark', dark)

    if (theme === 'light') {
      apply(false)
      return
    }

    if (theme === 'dark') {
      apply(true)
      return
    }

    // 'auto' — mirror the system preference and react to live changes
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    apply(mq.matches)
    const handler = (e) => apply(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

/** Returns { theme, setTheme } where theme is 'light' | 'dark' | 'auto'. */
export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}
