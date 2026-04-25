/**
 * src/components/layout/ThemeToggle.jsx
 * --------------------------------------
 * Icon button that cycles through light → dark → auto themes.
 * Reads and writes via ThemeContext.
 */

import { Sun, Moon, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/context/ThemeContext'

const CYCLE = ['light', 'dark', 'auto']
const LABELS = { light: 'Light mode', dark: 'Dark mode', auto: 'System theme' }
const ICONS  = { light: Sun, dark: Moon, auto: Monitor }

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const next = () => {
    const idx = CYCLE.indexOf(theme)
    setTheme(CYCLE[(idx + 1) % CYCLE.length])
  }

  const Icon = ICONS[theme] ?? Monitor

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={next}
      title={LABELS[theme]}
      aria-label={LABELS[theme]}
    >
      <Icon className="h-4 w-4" />
    </Button>
  )
}
