"use client";

import { useEffect } from "react";
import { Skeleton } from "@/app/components/loaders/LoadingSkeleton";
import { setStreak, useUserStore } from "@/app/lib/stores/user";

type StaticStat = {
  label: string;
  value: string;
  sub: string;
};

const STATIC_STATS: StaticStat[] = [
  { label: "ERP sessions", value: "—", sub: "this month" },
  { label: "Thought records", value: "—", sub: "this month" },
  { label: "Mood logs", value: "—", sub: "this month" },
];

export default function ProgressCard() {
  const streak = useUserStore((s) => s.streak);

  useEffect(() => {
    fetch("/api/streak")
      .then((r) => r.json())
      .then((data) => setStreak(data.currentStreak));
  }, []);

  return (
    <div className="bg-card border border-subtle rounded-xl p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-primary">Your Progress</h2>
        <span className="text-xs text-muted">
          {new Date().toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-surface border border-subtle rounded-lg p-3">
          {streak === null ? (
            <Skeleton className="h-8 w-12 mb-1" />
          ) : (
            <p className="text-2xl font-bold text-accent">{streak}</p>
          )}
          <p className="text-xs text-muted mt-0.5">days</p>
          <p className="text-xs text-primary mt-1 font-medium">
            Current streak
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
