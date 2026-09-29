type HomeworkItem = {
  id: string;
  title: string;
  completed: boolean;
};

const PLACEHOLDER_HOMEWORK: HomeworkItem[] = [
  { id: "1", title: "Try a short practice exercise", completed: false },
  { id: "2", title: "Note a situation that brought up anxiety", completed: false },
  { id: "3", title: "Note a breathing exercise", completed: true },
];

export default function HomeworkCard() {
  return (
    <div className="bg-card border border-subtle rounded-xl p-4 flex flex-col gap-4 card-medium">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-primary">Practice with your therapist</h2>
        <span className="text-xs text-muted">Example tasks</span>
      </div>

      <p className="text-xs text-muted">
        Tasks to discuss with a therapist. Your own plan can begin with one.
      </p>

      <ul className="min-h-0 flex-1 overflow-y-auto space-y-2">
        {PLACEHOLDER_HOMEWORK.map((h) => (
          <li
            key={h.id}
            className="flex items-start gap-3 p-3 rounded-lg bg-surface border border-subtle"
          >
            <span
              className={`mt-0.5 shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                h.completed
                  ? "border-success bg-success"
                  : "border-muted"
              }`}
            >
              {h.completed && (
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path d="M1 4l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>

            <div className="flex-1 min-w-0">
              <p className={`text-sm ${h.completed ? "line-through text-muted" : "text-primary"}`}>
                {h.title}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
