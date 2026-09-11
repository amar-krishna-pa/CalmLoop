"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/app/lib/cn";
import FearInputCard from "@/app/components/practice/prepare/fear-extraction/FearInputCard";
import SavedFearsCard from "@/app/components/practice/prepare/saved-fears/SavedFearsCard";
import HomeworkCard from "@/app/components/practice/maintain/HomeworkCard";
import RelapsePreventionCard from "@/app/components/practice/maintain/RelapsePreventionCard";

type Tab = "prepare" | "exposures" | "maintain";

const TABS: { id: Tab; label: string; sublabel: string }[] = [
  {
    id: "prepare",
    label: "Prepare",
    sublabel: "Map triggers & safety behaviours",
  },
  {
    id: "exposures",
    label: "Exposures",
    sublabel: "Log exposures & test predictions",
  },
  {
    id: "maintain",
    label: "Maintain",
    sublabel: "Homework & relapse planning",
  },
];

export default function PracticePage() {
  const [activeTab, setActiveTab] = useState<Tab>("prepare");
  const [savedFearsVersion, setSavedFearsVersion] = useState(0);

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
              "relative isolate flex flex-col items-center py-2.5 px-3 rounded-lg cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
              activeTab !== tab.id && "hover:bg-accent/5",
            )}
          >
            {activeTab === tab.id && (
              <motion.span
                layoutId="practice-tab-highlight"
                initial={false}
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 rounded-lg bg-accent/10"
              />
            )}
            <span
              className={cn(
                "text-sm font-semibold",
                activeTab === tab.id ? "text-accent" : "text-muted",
              )}
            >
              {tab.label}
            </span>
            <span className="text-2xs text-muted mt-0.5 hidden sm:block">
              {tab.sublabel}
            </span>
          </button>
        ))}
      </div>

      <div className="relative">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, pointerEvents: "none" }}
          >
            {activeTab === "prepare" && (
              <div className="flex flex-col gap-4">
                <FearInputCard
                  onSaved={() => setSavedFearsVersion((version) => version + 1)}
                />

                <SavedFearsCard key={savedFearsVersion} />
              </div>
            )}

            {activeTab === "exposures" && (
              <div className="bg-card border border-subtle rounded-xl p-8 flex flex-col items-center justify-center text-center card-medium">
                <p className="text-sm font-medium text-primary">Nothing here yet</p>
                <p className="text-xs text-muted mt-1 max-w-sm">
                  Exposure practice will return once the new Prepare flow lands.
                </p>
              </div>
            )}

            {activeTab === "maintain" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <HomeworkCard />
                <RelapsePreventionCard />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
