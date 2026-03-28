from __future__ import annotations

import heapq
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import date, time
from enum import Enum
from typing import Optional


# ---------------------------------------------------------------------------
# Enumerations
# ---------------------------------------------------------------------------


class Priority(Enum):
    HIGH = 1
    MEDIUM = 2
    LOW = 3


class TaskCategory(Enum):
    WALK = "walk"
    FEEDING = "feeding"
    MEDICATION = "medication"
    ENRICHMENT = "enrichment"
    GROOMING = "grooming"
    OTHER = "other"


# ---------------------------------------------------------------------------
# Core data models
# ---------------------------------------------------------------------------


@dataclass
class Task:
    name: str
    duration_minutes: int
    priority: Priority
    category: TaskCategory
    is_mandatory: bool = False
    cooldown_hours: float = 0.0

    def __lt__(self, other: Task) -> bool: ...

    def __repr__(self) -> str: ...


@dataclass
class Pet:
    name: str
    species: str
    age_years: float
    notes: str = ""

    def __repr__(self) -> str: ...


@dataclass
class Owner:
    name: str
    time_budget_minutes: int
    pets: list[Pet] = field(default_factory=list)
    tasks: list[Task] = field(default_factory=list)
    schedules: list[Schedule] = field(default_factory=list)

    def add_task(self, task: Task, schedule: Schedule | None = None) -> None: ...

    def remove_task(self, name: str, schedule: Schedule | None = None) -> None: ...

    def __repr__(self) -> str: ...


# ---------------------------------------------------------------------------
# Schedule output models
# ---------------------------------------------------------------------------


@dataclass
class ScheduledTask:
    task: Task
    start_time: time
    end_time: time
    reasoning: str


@dataclass
class Schedule:
    schedule_date: date
    scheduled: list[ScheduledTask] = field(default_factory=list)
    skipped: list[tuple] = field(default_factory=list)
    total_minutes_used: int = 0

    def summary(self) -> str: ...

    def reasoning_report(self) -> str: ...


# ---------------------------------------------------------------------------
# Constraint system
# ---------------------------------------------------------------------------


@dataclass
class SchedulerContext:
    remaining_minutes: int
    recently_done: list[str]
    elapsed_minutes: int


class Constraint(ABC):
    name: str

    @abstractmethod
    def is_satisfied(self, task: Task, context: SchedulerContext) -> bool: ...

    @abstractmethod
    def describe(self) -> str: ...


class TimeBudgetConstraint(Constraint):
    def __init__(self) -> None:
        self.name = "TimeBudget"

    def is_satisfied(self, task: Task, context: SchedulerContext) -> bool: ...

    def describe(self) -> str: ...


class CooldownConstraint(Constraint):
    def __init__(self, recently_done: list[str] | None = None) -> None:
        self.name = "Cooldown"
        self.recently_done: list[str] = recently_done if recently_done is not None else []

    def is_satisfied(self, task: Task, context: SchedulerContext) -> bool: ...

    def describe(self) -> str: ...


class MandatoryOverrideConstraint(Constraint):
    def __init__(self) -> None:
        self.name = "MandatoryOverride"

    def is_satisfied(self, task: Task, context: SchedulerContext) -> bool: ...

    def describe(self) -> str: ...


# ---------------------------------------------------------------------------
# Scheduler (core engine)
# ---------------------------------------------------------------------------


@dataclass
class Scheduler:
    constraints: list[Constraint] = field(default_factory=list)

    def generate_plan(self, owner: Owner, schedule_date: date) -> Schedule: ...

    def _build_heap(self, tasks: list[Task]) -> list: ...

    def _check_constraints(
        self, task: Task, context: SchedulerContext
    ) -> tuple[bool, str]: ...

    def _assign_start_time(self, elapsed_minutes: int) -> time: ...

    def _format_reasoning(
        self, task: Task, passed: bool, context: SchedulerContext
    ) -> str: ...
