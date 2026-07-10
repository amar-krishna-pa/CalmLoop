import SafetyBehaviourForm from "@/app/components/treatment/SafetyBehaviourForm";
import {
  useTreatmentStore,
  type SafetyBehaviour,
} from "@/app/lib/stores/treatment";

const FREQUENCY_COLOR: Record<SafetyBehaviour["frequency"], string> = {
  Rarely: "bg-success/10 text-success border-success/20",
  Sometimes: "bg-warning-bg text-warning-text border-warning-border",
  Often: "bg-danger/10 text-danger border-danger/20",
  Always: "bg-danger/20 text-danger border-danger/30",
};

export default function SafetyBehavioursCard() {
  const entries = useTreatmentStore((state) => state.safetyBehaviours) ?? [];

  return (
    <div className="bg-card border border-subtle rounded-xl p-4 flex flex-col gap-4">
      <div>
        <h2 className="text-sm font-semibold text-primary">Safety Behaviours</h2>
        <p className="text-xs text-muted mt-0.5">Subtle compulsions to work on dropping</p>
      </div>

      <SafetyBehaviourForm />

      <ul className="space-y-2">
        {entries.map((b) => (
          <li key={b.id} className="p-3 rounded-lg bg-surface border border-subtle space-y-1.5">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm text-primary leading-snug">{b.behaviour}</p>
              <span
                className={`shrink-0 text-[10px] font-medium border rounded-full px-2 py-0.5 ${FREQUENCY_COLOR[b.frequency]}`}
              >
                {b.frequency}
              </span>
            </div>
            <p className="text-xs text-muted">{b.category}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
