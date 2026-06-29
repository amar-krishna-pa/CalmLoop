"use client";

import { useState } from "react";
import { LuMoon, LuZap } from "react-icons/lu";

const WEEKLY_DATA = [
  { day: "Mon", sleep: 7, stress: 3 },
  { day: "Tue", sleep: 5, stress: 7 },
  { day: "Wed", sleep: 6, stress: 5 },
  { day: "Thu", sleep: 8, stress: 2 },
  { day: "Fri", sleep: 6, stress: 6 },
  { day: "Sat", sleep: 7, stress: 4 },
  { day: "Sun", sleep: null, stress: null },
];

type Tab = "sleep" | "stress";

export default function SleepStressCard() {
  const [tab, setTab] = useState<Tab>("sleep");

  const isSleep = tab === "sleep";
  const maxSleep = 10;
  const maxStress = 10;

  return (
    <div className="bg-card border border-subtle rounded-xl p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-primary">Sleep & Stress</h2>
        <div className="flex rounded-lg border border-subtle overflow-hidden text-xs">
          <button
            onClick={() => setTab("sleep")}
            className={`flex items-center gap-1.5 px-3 py-1.5 transition-colors cursor-pointer ${
              isSleep ? "bg-accent text-on-accent" : "text-muted hover:bg-surface"
            }`}
          >
            <LuMoon size={11} />
            Sleep
          </button>
          <button
            onClick={() => setTab("stress")}
            className={`flex items-center gap-1.5 px-3 py-1.5 transition-colors cursor-pointer ${
              !isSleep ? "bg-accent text-on-accent" : "text-muted hover:bg-surface"
            }`}
          >
            <LuZap size={11} />
            Stress
          </button>
        </div>
      </div>

      <div className="flex items-end gap-1.5" style={{ height: 64 }}>
        {WEEKLY_DATA.map((d) => {
          const value = isSleep ? d.sleep : d.stress;
          const max = isSleep ? maxSleep : maxStress;
          const barColor = isSleep
            ? "bg-accent/70"
            : (d.stress ?? 0) >= 7
            ? "bg-danger/60"
            : (d.stress ?? 0) >= 4
            ? "bg-warning-text/60"
            : "bg-success/60";

          return (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full bg-surface rounded-sm relative" style={{ height: 48 }}>
                {value != null && (
                  <div
                    className={`absolute bottom-0 w-full ${barColor} rounded-sm transition-all duration-500`}
                    style={{ height: `${(value / max) * 100}%` }}
                  />
                )}
              </div>
              <span className="text-[10px] text-muted">{d.day}</span>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-muted">
        {isSleep ? "Hours of sleep per night" : "Stress level out of 10"}
      </p>
    </div>
  );
}
