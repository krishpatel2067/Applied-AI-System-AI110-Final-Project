/**
 * src/components/pets/PetList.jsx
 * --------------------------------
 * Renders all pet cards, or an empty-state message when there are none.
 */

import PetCard from './PetCard'

export default function PetList({ pets, onDelete }) {
  if (!pets.length) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        No pets yet. Add one above.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {pets.map((pet) => (
        <PetCard key={pet.id} pet={pet} onDelete={onDelete} />
      ))}
    </div>
  )
}
