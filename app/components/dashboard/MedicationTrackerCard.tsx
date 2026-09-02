type MedicationLog = {
  id: string;
  date: string;
  taken: boolean;
  note: string | null;
};

type Medication = {
  name: string;
  dose: string;
  frequency: string;
};

const PLACEHOLDER_MEDICATION: Medication = {
  name: "Sertraline",
  dose: "50mg",
  frequency: "Once daily",
};

const PLACEHOLDER_LOG: MedicationLog[] = [
  { id: "1", date: "Today", taken: false, note: null },
  { id: "2", date: "Yesterday", taken: true, note: null },
  { id: "3", date: "Jun 27", taken: true, note: "Felt slightly nauseous" },
  { id: "4", date: "Jun 26", taken: true, note: null },
  { id: "5", date: "Jun 25", taken: false, note: "Forgot — travel day" },
];

const takenCount = PLACEHOLDER_LOG.filter((l) => l.taken).length;
const adherencePercent = Math.round((takenCount / PLACEHOLDER_LOG.length) * 100);

export default function MedicationTrackerCard() {
  return (
    <div className="bg-card border border-subtle rounded-xl p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-primary">Medication</h2>
          <p className="text-xs text-muted mt-0.5">
            {PLACEHOLDER_MEDICATION.name} · {PLACEHOLDER_MEDICATION.dose} · {PLACEHOLDER_MEDICATION.frequency}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-accent">{adherencePercent}%</p>
          <p className="text-2xs text-muted">adherence</p>
        </div>
      </div>

      <ul className="space-y-1.5">
        {PLACEHOLDER_LOG.map((log) => (
          <li
            key={log.id}
            className="flex items-start gap-3 px-3 py-2 rounded-lg bg-surface border border-subtle"
          >
            <span
              className={`mt-0.5 shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                log.taken ? "border-success bg-success" : "border-danger bg-danger/10"
              }`}
            >
              {log.taken ? (
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path d="M1 4l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path d="M2 2l4 4M6 2l-4 4" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              )}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className={`text-sm ${log.taken ? "text-primary" : "text-muted"}`}>
                  {log.taken ? "Taken" : "Missed"}
                </p>
                <span className="text-xs text-muted shrink-0">{log.date}</span>
              </div>
              {log.note && (
                <p className="text-xs text-muted mt-0.5">{log.note}</p>
              )}
            </div>
          </li>
        ))}
      </ul>

      <button className="btn-accent self-start">Log today</button>
    </div>
  );
}
