---
name: Architecture Decisions
description: Class responsibilities, scheduling algorithm, interface contracts, and naming conventions for PawPal+
type: project
---

## Phase completed: Phase 2 (Python OOP Skeleton)

## Class Responsibilities

| Class | Module | Role |
|---|---|---|
| `Priority` | `models.py` | Enum: HIGH=1, MEDIUM=2, LOW=3. Lower int = higher priority (heapq-friendly). |
| `TaskCategory` | `models.py` | Enum: WALK, FEEDING, MEDICATION, ENRICHMENT, GROOMING, OTHER |
| `Task` | `models.py` | Dataclass. Single pet care activity: name, duration_minutes, priority, category, is_mandatory, cooldown_hours |
| `Pet` | `models.py` | Dataclass. Pet info: name, species, age_years, notes. Composed into Owner. |
| `Owner` | `models.py` | Dataclass. Owner info + time budget. Composes Pet(s) and holds task list. |
| `ScheduledTask` | `models.py` | Dataclass. A Task placed at a specific start_time with a reasoning string. |
| `Schedule` | `models.py` | Dataclass. Result of scheduling: list of ScheduledTask, list of skipped tasks with reasons, date. |
| `Constraint` | `constraints.py` | ABC. Abstract base for all constraint types. Method: `is_satisfied(task, context) -> bool` |
| `TimeBudgetConstraint` | `constraints.py` | Concrete. Checks remaining minutes >= task.duration_minutes |
| `CooldownConstraint` | `constraints.py` | Concrete. Checks task not performed within cooldown_hours window |
| `SchedulerContext` | `pawpal_system.py` | Dataclass. Typed context passed to constraints: remaining_minutes, recently_done, elapsed_minutes |
| `MandatoryOverrideConstraint` | `pawpal_system.py` | Concrete. Always returns True (mandatory tasks bypass time check). Renamed from MandatoryTaskConstraint. |
| `Scheduler` | `pawpal_system.py` | Core logic. Takes Owner + constraints, runs priority-queue algorithm, returns Schedule |

## Algorithm

Priority-queue (heapq) greedy approach:
1. Push all tasks onto heap keyed by (priority.value, task_name) for stable ordering
2. Pop tasks in priority order
3. For mandatory tasks: schedule regardless of time budget, check other constraints only
4. For non-mandatory tasks: check all constraints; schedule if all pass, else skip with reason
5. Assign start_time = sum of previously scheduled task durations (sequential, no gaps)
6. Collect reasoning string per task: "Scheduled [task]: priority=HIGH, 45 min remaining" or "Skipped [task]: insufficient time (need 30 min, 10 remaining)"

## Interface Contracts

- `Scheduler.generate_plan(owner: Owner, date: date) -> Schedule`
- `Constraint.is_satisfied(task: Task, context: SchedulerContext) -> bool` — typed context dataclass, not a raw dict
- `Schedule.scheduled` — list of `ScheduledTask`, sorted by start_time
- `Schedule.skipped` — list of `(Task, reason: str)` tuples
- `ScheduledTask.start_time` — `datetime.time` object
- `ScheduledTask.end_time` — `datetime.time` object (stored as attribute, not derived)

## Conventions

- Priority values: HIGH=1, MEDIUM=2, LOW=3 (lower int = higher priority, heapq pops smallest first)
- Task duration always stored as integer minutes
- All business logic in `pawpal_system.py` (single module for skeleton phase; may be split in later phases)
- `app.py` imports from `pawpal_system.py` only — zero logic in the UI layer
- Tests live in `tests/test_scheduler.py`
- Scheduler helper methods use `_` prefix: `_build_heap`, `_check_constraints`, `_assign_start_time`, `_format_reasoning`

## File Layout (current)

```
app.py                  # Streamlit UI only
pawpal_system.py        # All classes: enums, dataclasses, constraints, scheduler skeleton
tests/
    test_scheduler.py   # pytest tests for scheduling behaviors (Phase 4)
```
