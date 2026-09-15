"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/app/components/loaders/LoadingSkeleton";
import { setStreak, useUserStore } from "@/app/stores/user";

type StaticStat = {
  label: string;
  value: string;
  sub: string;
};

const STATIC_STATS: StaticStat[] = [
  { label: "Practice sessions", value: "—", sub: "this month" },
  { label: "Thought records", value: "—", sub: "this month" },
  { label: "Mood logs", value: "—", sub: "this month" },
];

export default function ProgressCard() {
  const streak = useUserStore((s) => s.streak);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/streak")
      .then((r) => {
        if (!r.ok) throw new Error("Could not load streak");
        return r.json();
      })
      .then((data) => setStreak(data.currentStreak))
      .catch(() => setError(true));
  }, []);

  return (
    <div className="bg-card border border-subtle rounded-xl p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-primary">Your activity</h2>
        <span className="text-xs text-muted">
          {new Date().toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </span>
      </div>

      <p className="text-xs text-muted">Breaks are part of life. This count does not measure your progress.</p>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-surface border border-subtle rounded-lg p-3">
          {streak === null && error ? (
            <p className="h-8 text-2xl leading-8 text-muted" aria-label="We couldn’t load your activity">—</p>
          ) : streak === null ? (
            <Skeleton className="h-8 w-12" />
          ) : (
            <p className="h-8 text-2xl leading-8 font-bold text-accent">{streak}</p>
          )}
          <p className="text-xs text-muted mt-0.5">days</p>
          <p className="text-xs text-primary mt-1 font-medium">
            Consecutive active days
          </p>
        </div>

        {STATIC_STATS.map((s) => (
          <div
            key={s.label}
            className="bg-surface border border-subtle rounded-lg p-3"
          >
            <p className="text-2xl font-bold text-accent">{s.value}</p>
            <p className="text-xs text-muted mt-0.5">{s.sub}</p>
            <p className="text-xs text-primary mt-1 font-medium">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
