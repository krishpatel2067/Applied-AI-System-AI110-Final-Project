/**
 * src/components/pets/AddPetForm.jsx
 * ------------------------------------
 * Controlled form for adding a new pet.
 * Resets all fields after a successful submission.
 */

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const EMPTY = { name: '', species: '', age_years: '', notes: '' }

export default function AddPetForm({ onAdd }) {
  const [form, setForm] = useState(EMPTY)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim())    { setError('Name is required.'); return }
    if (!form.species.trim()) { setError('Species is required.'); return }

    setLoading(true)
    setError('')
    try {
      await onAdd({
        name: form.name.trim(),
        species: form.species.trim(),
        age_years: parseFloat(form.age_years) || 0,
        notes: form.notes.trim(),
      })
      setForm(EMPTY)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="pet-name">Name</Label>
          <Input id="pet-name" placeholder="Mochi" value={form.name} onChange={set('name')} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="pet-species">Species</Label>
          <Input id="pet-species" placeholder="Cat" value={form.species} onChange={set('species')} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="pet-age">Age (years)</Label>
          <Input id="pet-age" type="number" min="0" step="0.5" placeholder="3" value={form.age_years} onChange={set('age_years')} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="pet-notes">Notes</Label>
          <Input id="pet-notes" placeholder="Optional" value={form.notes} onChange={set('notes')} />
        </div>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={loading} className="self-start">
        {loading ? 'Adding…' : 'Add pet'}
      </Button>
    </form>
  )
}
