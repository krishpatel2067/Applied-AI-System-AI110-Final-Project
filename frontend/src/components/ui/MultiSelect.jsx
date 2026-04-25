/**
 * src/components/ui/MultiSelect.jsx
 * -----------------------------------
 * Reusable multi-select dropdown built from Shadcn Popover + Checkbox.
 *
 * Props:
 *   options   — [{ value: string, label: string }]
 *   selected  — string[]  (array of selected values)
 *   onChange  — (newSelected: string[]) => void
 *   placeholder — string shown when nothing is selected
 */

import { useState } from 'react'
import { ChevronsUpDown } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export default function MultiSelect({
  options = [],
  selected = [],
  onChange,
  placeholder = 'Select…',
}) {
  const [open, setOpen] = useState(false)

  const toggle = (value) => {
    onChange(
      selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value]
    )
  }

  // Build the trigger label from selected option labels
  const triggerLabel = selected.length
    ? options
        .filter((o) => selected.includes(o.value))
        .map((o) => o.label)
        .join(', ')
    : placeholder

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'w-full justify-between font-normal',
            !selected.length && 'text-muted-foreground'
          )}
        >
          <span className="truncate">{triggerLabel}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-56 p-2" align="start">
        {options.length === 0 ? (
          <p className="text-sm text-muted-foreground px-2 py-1.5">No options available.</p>
        ) : (
          <div className="flex flex-col gap-1">
            {options.map((opt) => {
              const checked = selected.includes(opt.value)
              return (
                <div
                  key={opt.value}
                  className="flex items-center gap-2 rounded px-2 py-1.5 hover:bg-accent cursor-pointer"
                  onClick={() => toggle(opt.value)}
                >
                  <Checkbox
                    id={`ms-${opt.value}`}
                    checked={checked}
                    onCheckedChange={() => toggle(opt.value)}
                    // Stop propagation so the div click doesn't double-fire
                    onClick={(e) => e.stopPropagation()}
                  />
                  <Label
                    htmlFor={`ms-${opt.value}`}
                    className="text-sm cursor-pointer flex-1"
                  >
                    {opt.label}
                  </Label>
                </div>
              )
            })}
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
