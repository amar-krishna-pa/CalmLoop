type TriggerEntry = {
  id: string;
  trigger: string;
  context: string;
  anxietyLevel: number;
  time: string;
};

const PLACEHOLDER_ENTRIES: TriggerEntry[] = [
  {
    id: "1",
    trigger: "Saw a news story about an accident",
    context: "Evening, at home, tired",
    anxietyLevel: 7,
    time: "Today, 9pm",
  },
  {
    id: "2",
    trigger: "Shook hands with a stranger",
    context: "Work meeting, moderate stress",
    anxietyLevel: 6,
    time: "Yesterday, 2pm",
  },
  {
    id: "3",
    trigger: "Left house in a hurry",
    context: "Running late, high stress",
    anxietyLevel: 8,
    time: "Jun 27, 8am",
  },
];

function AnxietyDot({ level }: { level: number }) {
  const color =
    level <= 3 ? "bg-success" : level <= 6 ? "bg-warning-text" : "bg-danger";

  return (
    <span
      className={`inline-block w-2 h-2 rounded-full ${color} shrink-0 mt-1.5`}
    />
  );
}

export default function TriggerLogCard() {
  return (
    <div className="bg-card border border-subtle rounded-xl p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-primary">Trigger Log</h2>
          <p className="text-xs text-muted mt-0.5">
            Track what sets off your OCD
          </p>
        </div>
        <button className="btn-accent">Log trigger</button>
      </div>

      <ul className="space-y-2">
        {PLACEHOLDER_ENTRIES.map((e) => (
          <li
            key={e.id}
            className="flex gap-3 p-3 rounded-lg bg-surface border border-subtle"
          >
            <AnxietyDot level={e.anxietyLevel} />
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm text-primary leading-snug">{e.trigger}</p>
                <span className="text-xs text-muted shrink-0">
                  {e.anxietyLevel}/10
                </span>
              </div>
              <p className="text-xs text-muted">{e.context}</p>
              <p className="text-[10px] text-muted">{e.time}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
