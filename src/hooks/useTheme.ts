import { useEffect, useState, useSyncExternalStore } from 'react'

export type Theme = 'light' | 'dark'
export const THEME_KEY = 'resume-theme'

function storedTheme(): Theme | null {
  try {
    const value = localStorage.getItem(THEME_KEY)
    return value === 'light' || value === 'dark' ? value : null
  } catch {
    return null
  }
}

function systemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export function useTheme() {
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null)
  // React uses the null server snapshot for hydration, then reads the browser
  // preference. theme.js already sets the page colors before paint.
  const preference = useSyncExternalStore(
    subscribeTheme,
    browserTheme,
    serverTheme,
  )
  const theme = selectedTheme ?? preference
  useEffect(() => {
    if (!theme) return
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'dark' ? '#191d20' : '#faf9f6')
  }, [theme])

  function selectTheme(next: Theme) {
    setSelectedTheme(next)
    try {
      localStorage.setItem(THEME_KEY, next)
    } catch {
      /* Theme selection still works when storage is unavailable. */
    }
  }
  return { theme, selectTheme }
}

function browserTheme(): Theme {
  return storedTheme() ?? systemTheme()
}

function serverTheme(): null {
  return null
}

function subscribeTheme(onChange: () => void) {
  const query = window.matchMedia('(prefers-color-scheme: dark)')
  query.addEventListener('change', onChange)
  window.addEventListener('storage', onChange)
  return () => {
    query.removeEventListener('change', onChange)
    window.removeEventListener('storage', onChange)
  }
}
