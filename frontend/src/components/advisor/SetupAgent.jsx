/**
 * src/components/advisor/SetupAgent.jsx
 * ----------------------------------------
 * Agentic care-plan wizard. Two-step human-in-the-loop flow:
 *
 *  1. User describes their situation in free text → "Plan it"
 *  2. Agent returns a structured preview (reasoning steps, pets, tasks)
 *  3. User approves → plan is persisted; or discards to start over
 *
 * Props:
 *   onConfirmed — () => void   called after a successful confirm so the
 *                              parent can refresh its pet and task lists
 */

import { useState } from 'react';
import { Wand2, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { agentPlan, agentConfirm } from '@/api/client';

// ── Small presentational helpers ─────────────────────────────────────────────

function ReasoningSteps({ steps }) {
  return (
    <div className="flex flex-col gap-2">
      {steps.map((s, i) => (
        <p key={i} className="text-sm leading-relaxed">
          <span className="font-semibold">{s.step}:</span>{' '}
          <span className="text-muted-foreground">{s.detail}</span>
        </p>
      ))}
    </div>
  );
}

function PetCard({ pet }) {
  return (
    <div className="rounded-md border p-3 flex flex-col gap-0.5">
      <p className="font-medium text-sm">{pet.name}</p>
      <p className="text-xs text-muted-foreground">
        {pet.species} · {pet.age_years} yr{pet.age_years !== 1 ? 's' : ''}
      </p>
      {pet.notes && <p className="text-xs text-muted-foreground italic">{pet.notes}</p>}
    </div>
  );
}

const PRIORITY_COLOURS = {
  HIGH:   'text-destructive',
  MEDIUM: 'text-yellow-600 dark:text-yellow-400',
  LOW:    'text-muted-foreground',
};

function TaskRow({ task }) {
  const colour = PRIORITY_COLOURS[task.priority] ?? 'text-muted-foreground';
  const petLabel = task.pet_names?.length ? task.pet_names.join(', ') : 'General';
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b last:border-0">
      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{task.name}</p>
        <p className="text-xs text-muted-foreground">
          {task.frequency} · {task.date}{task.time_start ? ` at ${task.time_start}` : ''}
          {task.duration_minutes ? ` · ${task.duration_minutes} min` : ''}
        </p>
        <p className="text-xs text-muted-foreground">For: {petLabel}</p>
      </div>
      <span className={`text-xs font-semibold shrink-0 ${colour}`}>{task.priority}</span>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function SetupAgent({ onConfirmed }) {
  const [prompt, setPrompt]       = useState('');
  const [plan, setPlan]           = useState(null);   // AgentPlanOut | null
  const [planning, setPlanning]   = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [result, setResult]       = useState(null);   // AgentConfirmOut | null
  const [error, setError]         = useState('');

  const handlePlan = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setPlanning(true);
    setError('');
    setPlan(null);
    setResult(null);
    try {
      const data = await agentPlan(prompt.trim());
      setPlan(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setPlanning(false);
    }
  };

  const handleConfirm = async () => {
    if (!plan) return;
    setConfirming(true);
    setError('');
    try {
      const data = await agentConfirm({ pets: plan.pets, tasks: plan.tasks });
      setResult(data);
      setPlan(null);
      setPrompt('');
      onConfirmed?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setConfirming(false);
    }
  };

  const handleDiscard = () => {
    setPlan(null);
    setError('');
  };

  return (
    <div className="flex flex-col gap-4">

      {/* ── Success banner ── */}
      {result && (
        <div className="rounded-md border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-700 dark:text-green-400 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Added {result.pets_created} pet{result.pets_created !== 1 ? 's' : ''} and{' '}
          {result.tasks_created} task{result.tasks_created !== 1 ? 's' : ''} successfully.
        </div>
      )}

      {/* ── Prompt input (hidden while preview is showing) ── */}
      {!plan && (
        <form onSubmit={handlePlan} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="agent-prompt">Describe your situation</Label>
            <Textarea
              id="agent-prompt"
              placeholder="e.g. I just adopted a 2-year-old golden retriever named Buddy and a kitten named Luna."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={planning}
              rows={3}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={planning || !prompt.trim()} className="self-start">
            <Wand2 className="h-4 w-4 mr-1.5" />
            {planning ? 'Planning…' : 'Plan it'}
          </Button>
        </form>
      )}

      {/* ── Plan preview ── */}
      {plan && (
        <div className="flex flex-col gap-5">

          {/* Reasoning */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              How I planned this
            </p>
            <ReasoningSteps steps={plan.reasoning} />
          </div>

          <Separator />

          {/* Pets */}
          {plan.pets.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Pets to add ({plan.pets.length})
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {plan.pets.map((p, i) => <PetCard key={i} pet={p} />)}
              </div>
            </div>
          )}

          {/* Tasks */}
          {plan.tasks.length > 0 && (
            <div className="flex flex-col gap-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Tasks to schedule ({plan.tasks.length})
              </p>
              <div>
                {plan.tasks.map((t, i) => <TaskRow key={i} task={t} />)}
              </div>
            </div>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}

          {/* Actions */}
          <div className="flex gap-2">
            <Button onClick={handleConfirm} disabled={confirming}>
              <CheckCircle2 className="h-4 w-4 mr-1.5" />
              {confirming ? 'Adding…' : 'Approve & add'}
            </Button>
            <Button variant="outline" onClick={handleDiscard} disabled={confirming}>
              <XCircle className="h-4 w-4 mr-1.5" />
              Discard
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
