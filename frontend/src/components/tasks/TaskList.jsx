/**
 * src/components/tasks/TaskList.jsx
 * -----------------------------------
 * Renders the filtered, sorted list of TaskCards, or an empty-state message.
 * Receives the pets list so TaskCard can resolve UUIDs to names.
 */

import TaskCard from './TaskCard'

export default function TaskList({ tasks, pets, onComplete, onDelete }) {
  if (!tasks.length) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        No tasks match the current filters.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          pets={pets}
          onComplete={onComplete}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
