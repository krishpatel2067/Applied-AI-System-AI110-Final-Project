/**
 * src/components/tasks/TaskForm.jsx
 * -----------------------------------
 * Full task creation form.
 *
 * Accepts an optional `suggestedSlot` prop { date, time_start } to pre-fill
 * the date and time fields (e.g. from SuggestSlotButton).
 * Resets to empty defaults after a successful submission.
 */

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import MultiSelect from '@/components/ui/MultiSelect'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const FREQUENCIES = ['Once', 'Daily', 'Weekly', 'Monthly', 'Yearly']
const PRIORITIES   = ['HIGH', 'MEDIUM', 'LOW']

const EMPTY = {
  name: '', description: '', frequency: '', priority: '',
  date: '', time_start: '', duration_minutes: 0, pet_ids: [],
}

export default function TaskForm({ pets, suggestedSlot, onSuggestedSlotUsed, onAdd }) {
  const [form, setForm] = useState(EMPTY)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Pre-fill date/time whenever a new suggested slot arrives
  useEffect(() => {
    if (suggestedSlot) {
      setForm((f) => ({
        ...f,
        date: suggestedSlot.date,
        time_start: suggestedSlot.time_start,
      }))
    }
  }, [suggestedSlot])

  const set = (field) => (value) => setForm((f) => ({ ...f, [field]: value }))
  const setInput = (field) => (e) => set(field)(e.target.value)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim())  { setError('Task name is required.'); return }
    if (!form.frequency)    { setError('Frequency is required.'); return }
    if (!form.priority)     { setError('Priority is required.'); return }
    if (!form.date)         { setError('Date is required.'); return }
    if (form.time_start && !form.duration_minutes) {
      setError('Duration is required when a start time is set.')
      return
    }

    setLoading(true)
    setError('')
    try {
      await onAdd({
        name: form.name.trim(),
        description: form.description.trim(),
        frequency: form.frequency,
        priority: form.priority,
        date: form.date,
        time_start: form.time_start || null,
        duration_minutes: Number(form.duration_minutes),
        pet_ids: form.pet_ids,
      })
      setForm(EMPTY)
      onSuggestedSlotUsed?.()  // clear the suggested slot in the parent
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Row 1: name + description */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="task-name">Task name *</Label>
          <Input id="task-name" placeholder="Morning walk" value={form.name} onChange={setInput('name')} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="task-desc">Description</Label>
          <Input id="task-desc" placeholder="Optional details" value={form.description} onChange={setInput('description')} />
        </div>
      </div>

      {/* Row 2: frequency + priority */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label>Frequency *</Label>
          <Select value={form.frequency} onValueChange={set('frequency')}>
            <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
            <SelectContent>
              {FREQUENCIES.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Priority *</Label>
          <Select value={form.priority} onValueChange={set('priority')}>
            <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
            <SelectContent>
              {PRIORITIES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Row 3: date + time + duration */}
      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="task-date">Date *</Label>
          <Input id="task-date" type="date" value={form.date} onChange={setInput('date')} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="task-time">Start time</Label>
          <Input id="task-time" type="time" value={form.time_start} onChange={setInput('time_start')} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="task-dur">Duration (min)</Label>
          <Input id="task-dur" type="number" min={0} value={form.duration_minutes} onChange={setInput('duration_minutes')} />
        </div>
      </div>

      {/* Row 4: pet assignment */}
      {pets.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <Label>Assign to pets</Label>
          <MultiSelect
            options={pets.map((p) => ({ value: p.id, label: p.name }))}
            selected={form.pet_ids}
            onChange={(ids) => setForm((f) => ({ ...f, pet_ids: ids }))}
            placeholder="No pets assigned"
          />
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" disabled={loading} className="self-start">
        {loading ? 'Adding…' : 'Add task'}
      </Button>
    </form>
  )
}
