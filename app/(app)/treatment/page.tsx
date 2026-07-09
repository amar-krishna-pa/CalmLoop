"use client";

import { useState } from "react";
import { cn } from "@/app/lib/cn/cn";
import FearHierarchyCard from "@/app/components/treatment/FearHierarchyCard";
import ErpTrackerCard from "@/app/components/dashboard/ErpTrackerCard";
import TriggerLogCard from "@/app/components/treatment/TriggerLogCard";
import SafetyBehavioursCard from "@/app/components/dashboard/SafetyBehavioursCard";
import ThoughtRecordsCard from "@/app/components/dashboard/ThoughtRecordsCard";
import BehaviouralExperimentsCard from "@/app/components/dashboard/BehaviouralExperimentsCard";
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
    label: "Plan",
    sublabel: "Therapist homework & relapse prevention",
  },
];

export default function TreatmentPage() {
  const [activeTab, setActiveTab] = useState<Tab>("prepare");

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-primary">Treatment</h1>
        <p className="text-sm text-muted mt-1">Your active clinical tools</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TriggerLogCard />
          <FearHierarchyCard />
          <SafetyBehavioursCard />
        </div>
      )}

      {activeTab === "practice" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ErpTrackerCard />
          <ThoughtRecordsCard />
          <BehaviouralExperimentsCard />
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
