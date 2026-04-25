/**
 * src/screens/OwnerSetup.jsx
 * ---------------------------
 * Shown when no owner exists yet (GET /owner returned 404).
 * A centered, welcoming card with a single name input.
 */

import { useState } from 'react'
import { PawPrint } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function OwnerSetup({ onOwnerCreated }) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) { setError('Please enter your name.'); return }

    setLoading(true)
    setError('')
    try {
      await onOwnerCreated(trimmed)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <PawPrint className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl">Welcome to PawPal++</CardTitle>
          <CardDescription>Enter your name to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="owner-name">Your name</Label>
              <Input
                id="owner-name"
                placeholder="e.g. Alex"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating…' : 'Get started'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
