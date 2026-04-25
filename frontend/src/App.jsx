/**
 * src/App.jsx
 * -----------
 * Root component. Wraps the app in ThemeProvider and decides which screen
 * to render based on whether an owner exists.
 */

import { ThemeProvider } from '@/context/ThemeContext'
import { useOwner } from '@/hooks/useOwner'
import AppShell from '@/components/layout/AppShell'
import OwnerSetup from '@/screens/OwnerSetup'
import Dashboard from '@/screens/Dashboard'

function AppContent() {
  const { owner, loading, error, createOwner, deleteOwner } = useOwner()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-muted-foreground text-sm">
        Loading…
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-destructive text-sm">
        Failed to load: {error}
      </div>
    )
  }

  return owner
    ? <Dashboard owner={owner} onDeleteOwner={deleteOwner} />
    : <OwnerSetup onOwnerCreated={createOwner} />
}

export default function App() {
  return (
    <ThemeProvider>
      <AppShell>
        <AppContent />
      </AppShell>
    </ThemeProvider>
  )
}
