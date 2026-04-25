/**
 * src/components/tasks/TaskCard.jsx
 * -----------------------------------
 * Displays a single task with all its details, a complete button, and a
 * delete button. Pet IDs are resolved to names via the pets prop.
 */

import { Check, Trash2, TriangleAlert } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Maps priority name → Tailwind colour classes for the badge
const PRIORITY_CLASSES = {
  HIGH:   'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-transparent',
  MEDIUM: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-transparent',
  LOW:    'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-transparent',
}

/** Format "HH:MM" + duration into "HH:MM–HH:MM (N min)". */
function formatTimeRange(timeStart, durationMinutes) {
  if (!timeStart) return null
  const [h, m] = timeStart.split(':').map(Number)
  const endTotalMin = h * 60 + m + (durationMinutes || 0)
  const pad = (n) => String(n).padStart(2, '0')
  const endStr = `${pad(Math.floor(endTotalMin / 60) % 24)}:${pad(endTotalMin % 60)}`
  return durationMinutes
    ? `${timeStart}–${endStr} (${durationMinutes} min)`
    : timeStart
}

/** Format ISO date string "YYYY-MM-DD" → "Mon DD, YYYY". */
function formatDate(iso) {
  const [y, mo, d] = iso.split('-').map(Number)
  return new Date(y, mo - 1, d).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

export default function TaskCard({ task, pets, onComplete, onDelete }) {
  // Resolve pet UUIDs to display names; fall back to the raw id if not found
  const petNames = task.pet_ids.length
    ? task.pet_ids.map((id) => pets.find((p) => p.id === id)?.name ?? id).join(', ')
    : 'No pets'

  const timeLabel = formatTimeRange(task.time_start, task.duration_minutes)

  return (
    <div
      className={cn(
        'rounded-lg border border-border px-4 py-3 flex gap-3 items-start',
        task.completed && 'opacity-60'
      )}
    >
      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col gap-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={cn('font-medium', task.completed && 'line-through')}>
            {task.name}
          </span>

          {/* Priority badge */}
          <Badge className={cn('text-xs', PRIORITY_CLASSES[task.priority])}>
            {task.priority}
          </Badge>

          {/* Conflict warning */}
          {task.conflicted && (
            <Badge variant="outline" className="text-xs gap-1 text-yellow-600 border-yellow-400">
              <TriangleAlert className="h-3 w-3" />
              Conflict
            </Badge>
          )}
        </div>

        {/* Date · time range · frequency · pets */}
        <p className="text-sm text-muted-foreground">
          {formatDate(task.date)}
          {timeLabel && <> · {timeLabel}</>}
          {' · '}{task.frequency}
          {' · '}{petNames}
        </p>

        {task.description && (
          <p className="text-sm text-muted-foreground italic">{task.description}</p>
        )}
      </div>

      {/* ── Action buttons ── */}
      <div className="flex gap-1 shrink-0">
        {!task.completed && (
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-green-600"
            onClick={() => onComplete(task.id)}
            aria-label="Mark complete"
          >
            <Check className="h-4 w-4" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-destructive"
          onClick={() => onDelete(task.id)}
          aria-label="Delete task"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
