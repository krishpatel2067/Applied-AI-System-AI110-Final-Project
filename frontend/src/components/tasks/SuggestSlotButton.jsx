/**
 * src/components/tasks/SuggestSlotButton.jsx
 * --------------------------------------------
 * Calls POST /suggest-slot and passes the result up via onSlotSuggested.
 * Shows inline controls for duration and optional pet filter before
 * making the request.
 */

import { useState } from 'react'
import { Lightbulb } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { suggestSlot } from '@/api/client'

export default function SuggestSlotButton({ pets, onSlotSuggested }) {
  const [open, setOpen] = useState(false)
  const [duration, setDuration] = useState(30)
  const [petId, setPetId] = useState('any')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSuggest = async () => {
    setLoading(true)
    setError('')
    try {
      const result = await suggestSlot({
        duration_minutes: duration,
        pet_id: petId === 'any' ? null : petId,
      })
      if (!result) {
        setError('No available slot found in the next 30 days.')
        return
      }
      onSlotSuggested(result.date, result.time_start)
      setOpen(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen((o) => !o)}
        className="self-start gap-2"
      >
        <Lightbulb className="h-4 w-4" />
        Suggest next slot
      </Button>

      {open && (
        <div className="rounded-lg border border-border p-4 flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="suggest-duration">Duration (min)</Label>
            <Input
              id="suggest-duration"
              type="number"
              min={15}
              step={15}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-28"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>For pet</Label>
            <Select value={petId} onValueChange={setPetId}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                {pets.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleSuggest} disabled={loading} size="sm">
            {loading ? 'Searching…' : 'Find slot'}
          </Button>

          {error && <p className="text-sm text-destructive w-full">{error}</p>}
        </div>
      )}
    </div>
  )
}
