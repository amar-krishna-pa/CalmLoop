"use client";

import { useState } from "react";
import { cn } from "@/app/lib/cn/cn";
import HomeworkCard from "@/app/components/dashboard/HomeworkCard";
import RelapsePreventionCard from "@/app/components/dashboard/RelapsePreventionCard";

type Tab = "prepare" | "practice" | "plan";

const TABS: { id: Tab; label: string; sublabel: string }[] = [
  {
    id: "prepare",
    label: "Prepare",
    sublabel: "Map your triggers, fears & safety behaviours",
  },
  {
    id: "practice",
    label: "Practice",
    sublabel: "Log exposures, challenge thoughts & test predictions",
  },
  {
    id: "plan",
    label: "Maintain",
    sublabel: "Therapist homework & relapse prevention",
  },
];

export default function PracticePage() {
  const [activeTab, setActiveTab] = useState<Tab>("prepare");

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-primary">Practice</h1>
        <p className="text-sm text-muted mt-1">Your daily ERP practice tools</p>
      </div>

      <div className="bg-surface border border-subtle rounded-xl p-1 grid grid-cols-3 gap-1 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex flex-col items-center py-2.5 px-3 rounded-lg transition-colors duration-200 cursor-pointer focus:outline-none",
              activeTab === tab.id ? "bg-accent/10" : "hover:bg-accent/5"
            )}
          >
            <span
              className={cn(
                "text-sm font-semibold transition-colors",
                activeTab === tab.id ? "text-accent" : "text-muted"
              )}
            >
              {tab.label}
            </span>
            <span className="text-[11px] text-muted mt-0.5 hidden sm:block">
              {tab.sublabel}
            </span>
          </button>
        ))}
      </div>

      {activeTab === "prepare" && (
        <div className="bg-card border border-subtle rounded-xl p-8 flex flex-col items-center justify-center text-center card-medium">
          <p className="text-sm font-medium text-primary">Nothing here yet</p>
          <p className="text-xs text-muted mt-1 max-w-sm">
            This is being rebuilt around a single place to describe what you
            went through.
          </p>
        </div>
      )}

      {activeTab === "practice" && (
        <div className="bg-card border border-subtle rounded-xl p-8 flex flex-col items-center justify-center text-center card-medium">
          <p className="text-sm font-medium text-primary">Nothing here yet</p>
          <p className="text-xs text-muted mt-1 max-w-sm">
            Exposure practice will return once the new Prepare flow lands.
          </p>
        </div>
      )}

      {activeTab === "plan" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <HomeworkCard />
          <RelapsePreventionCard />
        </div>
      )}
    </div>
  );
}
