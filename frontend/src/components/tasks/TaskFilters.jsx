/**
 * src/components/tasks/TaskFilters.jsx
 * --------------------------------------
 * Filter controls (pet, status) and sort controls (ordered key list).
 *
 * sortBy is an ordered array — the first item is the primary sort key.
 * Checking a box appends it to the end; unchecking removes it.
 * The displayed numbers show the current sort priority.
 */

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

const SORT_KEYS = ['Priority', 'Date & Time']

export default function TaskFilters({
  pets,
  filterPet,
  filterStatus,
  sortBy,
  onFilterPetChange,
  onFilterStatusChange,
  onSortToggle,
}) {
  return (
    <div className="flex flex-wrap items-end gap-4">
      {/* ── Filter by pet ── */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs text-muted-foreground">Filter by pet</Label>
        <Select value={filterPet} onValueChange={onFilterPetChange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All pets</SelectItem>
            <SelectItem value="unassigned">Unassigned</SelectItem>
            {pets.map((p) => (
              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* ── Filter by status ── */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs text-muted-foreground">Filter by status</Label>
        <Select value={filterStatus} onValueChange={onFilterStatusChange}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="incomplete">Incomplete</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator orientation="vertical" className="h-8 hidden sm:block" />

      {/* ── Sort order — order of checking determines sort priority ── */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs text-muted-foreground">Sort by (order matters)</Label>
        <div className="flex gap-4">
          {SORT_KEYS.map((key) => {
            const idx = sortBy.indexOf(key)
            const checked = idx !== -1
            return (
              <div key={key} className="flex items-center gap-1.5">
                <Checkbox
                  id={`sort-${key}`}
                  checked={checked}
                  onCheckedChange={() => onSortToggle(key)}
                />
                <Label htmlFor={`sort-${key}`} className="text-sm cursor-pointer">
                  {checked && (
                    <span className="mr-1 text-xs font-bold text-primary">
                      {idx + 1}.
                    </span>
                  )}
                  {key}
                </Label>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
