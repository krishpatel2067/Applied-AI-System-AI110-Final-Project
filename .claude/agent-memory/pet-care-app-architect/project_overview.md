---
name: Project Overview
description: PawPal+ pet care scheduling app — goals, stack, entry point, and current state
type: project
---

PawPal+ is a Streamlit app for busy pet owners to plan daily pet care tasks.

**Why:** Busy owners need consistency with tasks like walks, feeding, meds, enrichment, and grooming. The app generates a prioritized daily schedule and explains its reasoning.

**Stack:** Python 3.12, Streamlit >= 1.30, pytest >= 7.0. No external logic libraries — pure Python OOP for all business logic.

**Entry point:** `app.py` — currently a thin Streamlit starter with demo inputs and a non-functional "Generate schedule" button. All logic must be built in separate Python modules and imported into `app.py`.

**Key requirements from README:**
- Owner + pet info input
- Task input: name, duration (minutes), priority (low/medium/high)
- Scheduler generates a daily plan respecting time budget and priority
- Plan displayed with reasoning per task (why scheduled or skipped)
- Pytest tests for critical scheduling behaviors

**How to apply:** Every new module must be importable by `app.py`. Keep business logic entirely out of `app.py`.
