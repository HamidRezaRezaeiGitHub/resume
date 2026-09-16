import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'

export function ThemeToggle() {
  const { theme, selectTheme } = useTheme()
  return (
    <div className="theme-control" role="group" aria-label="Color theme">
      <button
        type="button"
        onClick={() => selectTheme('light')}
        aria-label="Light mode"
        aria-pressed={theme === 'light'}
        title="Light mode"
      >
        <Sun size={17} />
      </button>
      <button
        type="button"
        onClick={() => selectTheme('dark')}
        aria-label="Dark mode"
        aria-pressed={theme === 'dark'}
        title="Dark mode"
      >
        <Moon size={17} />
      </button>
    </div>
  )
}
