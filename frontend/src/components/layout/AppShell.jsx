/**
 * src/components/layout/AppShell.jsx
 * ------------------------------------
 * Outermost layout wrapper. Renders the Header, a growing <main> content
 * area, and the Footer. All screens are rendered as children of <main>.
 */

import Header from './Header'
import Footer from './Footer'

export default function AppShell({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
    </div>
  )
}
