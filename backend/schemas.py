"""
backend/schemas.py
------------------
Pydantic models for all request bodies and response payloads in the PawPal++
API.  Keeping schemas in their own module means routers stay thin (routing
logic only) and the data contracts are easy to find and update in one place.

Naming convention:
    <Resource>In   — request body sent by the client (create / update)
    <Resource>Out  — response payload returned to the client
    <Resource>     — shared base when In and Out are identical (rare)
"""

import datetime
from typing import Optional

from pydantic import BaseModel, Field


# ── Owner ─────────────────────────────────────────────────────────────────────


class OwnerIn(BaseModel):
    """Payload for creating or replacing the owner record."""

    name: str = Field(..., min_length=1, description="Owner's display name.")


class OwnerOut(BaseModel):
    """Owner record returned in API responses."""

    name: str


# ── Pet ───────────────────────────────────────────────────────────────────────


class PetIn(BaseModel):
    """Payload for adding a new pet."""

    name: str = Field(
        ..., min_length=1, description="Pet's name (must be unique per owner)."
    )
    species: str = Field(..., min_length=1, description="e.g. Dog, Cat, Rabbit.")
    age_years: float = Field(..., ge=0, description="Age in years; decimals allowed.")
    notes: str = Field(
        default="", description="Optional free-text notes about the pet."
    )


class PetOut(BaseModel):
    """Pet record returned in API responses."""

    id: str
    name: str
    species: str
    age_years: float
    notes: str


# ── Task ──────────────────────────────────────────────────────────────────────


class TaskIn(BaseModel):
    """Payload for creating a new task."""

    name: str = Field(..., min_length=1, description="Short task label.")
    description: str = Field(default="", description="Optional longer description.")
    frequency: str = Field(..., description="Once | Daily | Weekly | Monthly | Yearly")
    date: datetime.date = Field(..., description="ISO 8601 date the task is scheduled for.")
    priority: str = Field(..., description="HIGH | MEDIUM | LOW")
    pet_ids: list[str] = Field(
        default_factory=list,
        description="Pet UUIDs this task applies to. Empty list = unassigned.",
    )
    time_start: Optional[str] = Field(
        default=None, description="Start time in HH:MM format, or null."
    )
    duration_minutes: int = Field(
        default=0, ge=0, description="Expected duration in minutes (0 = untimed)."
    )


class TaskOut(BaseModel):
    """Task record returned in API responses.

    ``id`` is a UUID v4 string that uniquely identifies this task instance.
    Clients should use this id for DELETE and complete operations.
    """

    id: str
    name: str
    description: str
    completed: bool
    frequency: str
    date: datetime.date
    priority: str
    pet_ids: list[str]
    time_start: Optional[str]  # "HH:MM" or null
    duration_minutes: int


# ── Slot suggestion ───────────────────────────────────────────────────────────


class SlotQuery(BaseModel):
    """Request body for the next-available-slot suggestion endpoint."""

    duration_minutes: int = Field(
        ..., gt=0, description="Duration of the task to schedule."
    )
    pet_id: Optional[str] = Field(
        default=None,
        description="Restrict slot search to tasks for this pet (UUID). Null = check all tasks.",
    )
    starting_from: Optional[datetime.date] = Field(
        default=None,
        description="Start searching from this date. Defaults to today.",
    )


class SlotOut(BaseModel):
    """A suggested (date, time) slot returned by the scheduler."""

    date: datetime.date
    time_start: str  # "HH:MM"


# ── Agentic Setup Planner ─────────────────────────────────────────────────────


class AgentReasoningStep(BaseModel):
    """One labeled step in the agent's planning reasoning."""

    step: str    # short name, e.g. "Species assessment"
    detail: str  # one or two sentences of explanation


class AgentPetDraft(BaseModel):
    """One pet the agent proposes to create."""

    name: str
    species: str
    age_years: float = 0.0
    notes: str = ""


class AgentTaskDraft(BaseModel):
    """One task the agent proposes to schedule."""

    name: str
    description: str = ""
    frequency: str                  # Once | Daily | Weekly | Monthly | Yearly
    priority: str                   # HIGH | MEDIUM | LOW
    date: str                       # YYYY-MM-DD (string so the draft round-trips cleanly)
    time_start: Optional[str] = None  # HH:MM or null
    duration_minutes: int = 0
    pet_names: list[str] = Field(
        default_factory=list,
        description="Names of pets this task applies to (must match draft pet names).",
    )


class AgentPlanIn(BaseModel):
    """Free-text prompt describing what the user needs."""

    prompt: str = Field(..., min_length=1)


class AgentPlanOut(BaseModel):
    """The agent's proposed care plan — not yet persisted."""

    reasoning: list[AgentReasoningStep]
    pets: list[AgentPetDraft]
    tasks: list[AgentTaskDraft]


class AgentConfirmIn(BaseModel):
    """The approved plan sent back by the client to persist."""

    pets: list[AgentPetDraft]
    tasks: list[AgentTaskDraft]


class AgentConfirmOut(BaseModel):
    """Summary of what was actually created."""

    pets_created: int
    tasks_created: int


# ── AI Advisor (RAG) ──────────────────────────────────────────────────────────


class AskIn(BaseModel):
    """Payload for the POST /ask endpoint."""

    question: str = Field(..., min_length=1, description="The user's pet-care question.")


class SourceOut(BaseModel):
    """A single retrieved knowledge chunk returned alongside the answer."""

    id: str
    title: str
    source: str  # "faq" | "user-data"


class AskOut(BaseModel):
    """Structured response returned by the AI advisor.

    answer    — main reply in Pawsley's warm, friendly tone.
    tips      — 0-3 short actionable tips the owner can act on today.
    vet_alert — non-null only when a health risk is detected and professional
                care may be needed; kept calm and clear, not alarmist.
    sources   — retrieved knowledge chunks used to ground the answer.
    """

    answer: str
    tips: list[str]
    vet_alert: Optional[str]
    sources: list[SourceOut]


# ── Generic responses ─────────────────────────────────────────────────────────


class MessageOut(BaseModel):
    """Simple acknowledgement payload for mutating endpoints."""

    message: str
