/**
 * src/components/layout/Header.jsx
 * ----------------------------------
 * Sticky top bar with the app name and theme toggle.
 */

import { PawPrint } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2 font-semibold text-lg tracking-tight">
          <PawPrint className="h-5 w-5 text-primary" />
          <span>PawPal++</span>
        </div>
        <ThemeToggle />
      </div>
    </header>
  )
}
