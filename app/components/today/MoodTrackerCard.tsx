"use client";

import { useState } from "react";

const MOODS = [
  { emoji: "😔", label: "Low" },
  { emoji: "😟", label: "Uneasy" },
  { emoji: "😐", label: "Neutral" },
  { emoji: "🙂", label: "Good" },
  { emoji: "😄", label: "Great" },
];

const RECENT: { day: string; mood: number }[] = [
  { day: "Mon", mood: 2 },
  { day: "Tue", mood: 3 },
  { day: "Wed", mood: 2 },
  { day: "Thu", mood: 4 },
  { day: "Fri", mood: 3 },
  { day: "Sat", mood: 4 },
  { day: "Sun", mood: null as unknown as number },
];

export default function MoodTrackerCard() {
  const [selected, setSelected] = useState<number | null>(null);

  const max = 4;

  return (
    <div className="bg-card border border-subtle rounded-xl p-4 flex flex-col gap-4">
      <h2 className="text-sm font-semibold text-primary">Mood Tracker</h2>

      <div className="flex justify-between">
        {MOODS.map((m, i) => (
          <button
            key={m.label}
            onClick={() => setSelected(i)}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors duration-150 cursor-pointer ${
              selected === i
                ? "bg-accent/10 border border-accent/30"
                : "hover:bg-surface"
            }`}
          >
            <span className="text-xl">{m.emoji}</span>
            <span className="text-xs text-muted">{m.label}</span>
          </button>
        ))}
      </div>

      <div>
        <p className="text-xs text-muted mb-2">This week</p>
        <div className="flex items-end gap-1.5 h-10">
          {RECENT.map((r) => (
            <div key={r.day} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full bg-surface rounded-sm relative" style={{ height: 32 }}>
                {r.mood != null && (
                  <div
                    className="absolute bottom-0 w-full bg-accent/60 rounded-sm transition-all duration-500"
                    style={{ height: `${(r.mood / max) * 100}%` }}
                  />
                )}
              </div>
              <span className="text-2xs text-muted">{r.day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
