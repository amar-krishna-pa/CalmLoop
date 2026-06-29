type HierarchyItem = {
  id: string;
  situation: string;
  suds: number;
  practiced: boolean;
};

const PLACEHOLDER_ITEMS: HierarchyItem[] = [
  { id: "1", situation: "Thinking about leaving the stove on", suds: 3, practiced: true },
  { id: "2", situation: "Touching a public door handle", suds: 5, practiced: true },
  { id: "3", situation: "Leaving home without checking locks", suds: 7, practiced: false },
  { id: "4", situation: "Sitting with an intrusive harm thought", suds: 9, practiced: false },
];

function SudsBar({ value }: { value: number }) {
  const color =
    value <= 3 ? "bg-success" : value <= 6 ? "bg-warning-text" : "bg-danger";

  return (
    <div className="flex items-center gap-2">
      <div className="w-16 bg-surface rounded-full h-1.5">
        <div
          className={`${color} rounded-full h-1.5 transition-all duration-500`}
          style={{ width: `${(value / 10) * 100}%` }}
        />
      </div>
      <span className="text-xs text-muted w-4">{value}</span>
    </div>
  );
}

export default function FearHierarchyCard() {
  return (
    <div className="bg-card border border-subtle rounded-xl p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-primary">Fear Hierarchy</h2>
          <p className="text-xs text-muted mt-0.5">SUDS: 0 = no anxiety · 10 = worst imaginable</p>
        </div>
        <button className="btn-accent">Add item</button>
      </div>

      <ul className="space-y-2">
        {PLACEHOLDER_ITEMS.sort((a, b) => a.suds - b.suds).map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-3 p-3 rounded-lg bg-surface border border-subtle"
          >
            <span
              className={`shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                item.practiced ? "border-success bg-success" : "border-muted"
              }`}
            >
              {item.practiced && (
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path d="M1 4l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
            <div className="flex-1 min-w-0">
              <p className={`text-sm truncate ${item.practiced ? "text-muted line-through" : "text-primary"}`}>
                {item.situation}
              </p>
              <SudsBar value={item.suds} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
