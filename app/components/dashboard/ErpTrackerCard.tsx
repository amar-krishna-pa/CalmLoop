type ErpSession = {
  id: string;
  trigger: string;
  anxietyBefore: number;
  anxietyAfter: number;
  date: string;
};

const PLACEHOLDER_SESSIONS: ErpSession[] = [
  { id: "1", trigger: "Touching door handle", anxietyBefore: 8, anxietyAfter: 4, date: "Today" },
  { id: "2", trigger: "Leaving stove unchecked", anxietyBefore: 7, anxietyAfter: 3, date: "Yesterday" },
  { id: "3", trigger: "Intrusive thought — harm", anxietyBefore: 9, anxietyAfter: 6, date: "Jun 27" },
];

function AnxietyBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-16 bg-surface rounded-full h-1.5">
        <div
          className="bg-accent rounded-full h-1.5"
          style={{ width: `${(value / 10) * 100}%` }}
        />
      </div>
      <span className="text-xs text-muted">{value}/10</span>
    </div>
  );
}

export default function ErpTrackerCard() {
  return (
    <div className="bg-card border border-subtle rounded-xl p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-primary">ERP Tracker</h2>
        <button className="btn-accent">Log exercise</button>
      </div>

      <ul className="space-y-2">
        {PLACEHOLDER_SESSIONS.map((s) => (
          <li key={s.id} className="p-3 rounded-lg bg-surface border border-subtle space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-primary font-medium truncate">{s.trigger}</p>
              <span className="text-xs text-muted shrink-0 ml-2">{s.date}</span>
            </div>
            <div className="flex gap-4">
              <div>
                <p className="text-[10px] text-muted mb-1">Before</p>
                <AnxietyBar value={s.anxietyBefore} />
              </div>
              <div>
                <p className="text-[10px] text-muted mb-1">After</p>
                <AnxietyBar value={s.anxietyAfter} />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
