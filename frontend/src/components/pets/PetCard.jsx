/**
 * src/components/pets/PetCard.jsx
 * --------------------------------
 * Displays a single pet's details with a delete button.
 */

import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function PetCard({ pet, onDelete }) {
  const handleDelete = () => {
    if (window.confirm(`Remove ${pet.name}? This will also remove them from all tasks.`)) {
      onDelete(pet.id)
    }
  }

  return (
    <div className="flex items-start justify-between rounded-lg border border-border px-4 py-3 gap-3">
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="font-medium truncate">{pet.name}</span>
        <span className="text-sm text-muted-foreground">
          {pet.species} · {pet.age_years}y
        </span>
        {pet.notes && (
          <span className="text-xs text-muted-foreground truncate">{pet.notes}</span>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0 text-muted-foreground hover:text-destructive"
        onClick={handleDelete}
        aria-label={`Remove ${pet.name}`}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}
