type HomeworkItem = {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
};

const PLACEHOLDER_HOMEWORK: HomeworkItem[] = [
  { id: "1", title: "Practice ERP exercise for 10 mins", dueDate: "Today", completed: false },
  { id: "2", title: "Write down 3 anxiety triggers", dueDate: "Tomorrow", completed: false },
  { id: "3", title: "Complete breathing log", dueDate: "Jul 2", completed: true },
];

export default function HomeworkCard() {
  return (
    <div className="bg-card border border-subtle rounded-xl p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-primary">Therapist Homework</h2>
        <span className="text-xs text-muted">
          {PLACEHOLDER_HOMEWORK.filter((h) => !h.completed).length} remaining
        </span>
      </div>

      <ul className="space-y-2">
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
              <p className="text-xs text-muted mt-0.5">Due: {h.dueDate}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
