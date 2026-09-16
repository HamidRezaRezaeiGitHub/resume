import { useEffect, useState } from 'react'

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
  const [theme, setTheme] = useState<Theme>(
    () => storedTheme() ?? systemTheme(),
  )
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'dark' ? '#181c19' : '#f5f5ed')
  }, [theme])

  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)')
    const followSystem = () => {
      if (!storedTheme()) setTheme(systemTheme())
    }
    query.addEventListener('change', followSystem)
    return () => query.removeEventListener('change', followSystem)
  }, [])

  function selectTheme(next: Theme) {
    setTheme(next)
    try {
      localStorage.setItem(THEME_KEY, next)
    } catch {
      /* Theme selection still works when storage is unavailable. */
    }
  }
  return { theme, selectTheme }
}
