type ThoughtRecord = {
  id: string;
  thought: string;
  emotion: string;
  reframe: string;
  date: string;
};

const PLACEHOLDER_RECORDS: ThoughtRecord[] = [
  {
    id: "1",
    thought: "I left the door unlocked and something bad will happen",
    emotion: "Anxiety",
    reframe: "I checked the door twice. The feeling isn't evidence of danger.",
    date: "Today",
  },
  {
    id: "2",
    thought: "That intrusive thought means I'm a bad person",
    emotion: "Shame",
    reframe: "Having a thought doesn't reflect my character or intentions.",
    date: "Jun 27",
  },
];

import { LuTag } from "react-icons/lu";

export default function ThoughtRecordsCard() {
  return (
    <div className="bg-card border border-subtle rounded-xl p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-primary">Thought Records</h2>
        <button className="btn-accent">New record</button>
      </div>

      <ul className="space-y-2">
        {PLACEHOLDER_RECORDS.map((r) => (
          <li key={r.id} className="p-3 rounded-lg bg-surface border border-subtle space-y-2">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm text-primary leading-snug">{r.thought}</p>
              <span className="text-xs text-muted shrink-0">{r.date}</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-block text-xs bg-warning-bg text-warning-text border border-warning-border rounded-full px-2 py-0.5">
                {r.emotion}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-muted border border-subtle rounded-full px-2 py-0.5 opacity-50">
                <LuTag size={10} />
                Identify distortion
              </span>
            </div>
            <p className="text-xs text-muted leading-relaxed border-l-2 border-accent/40 pl-2">
              {r.reframe}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
