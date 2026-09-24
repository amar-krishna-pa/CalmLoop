"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/app/lib/cn";
import FearInputCard from "@/app/components/practice/prepare/fear-extraction/FearInputCard";
import SavedFearsCard from "@/app/components/practice/prepare/saved-fears/SavedFearsCard";
import HomeworkCard from "@/app/components/practice/maintain/HomeworkCard";
import RelapsePreventionCard from "@/app/components/practice/maintain/RelapsePreventionCard";
import ExposuresCard from "@/app/components/practice/exposures/ExposuresCard";

type Tab = "prepare" | "exposures" | "maintain";

const TABS: { id: Tab; label: string; sublabel: string }[] = [
  {
    id: "prepare",
    label: "Prepare",
    sublabel: "Map out triggers and responses",
  },
  {
    id: "exposures",
    label: "Exposures",
    sublabel: "Explore situations to practise",
  },
  {
    id: "maintain",
    label: "Maintain",
    sublabel: "Plan practice and support",
  },
];

export default function PracticeTabs() {
  const searchParams = useSearchParams();
  const requestedTab = searchParams.get("tab");
  const activeTab =
    TABS.find((tab) => tab.id === requestedTab)?.id ?? "prepare";

  const [savedFearsVersion, setSavedFearsVersion] = useState(0);

  function selectTab(tab: Tab) {
    const url = new URL(window.location.href);
    if (url.searchParams.get("tab") === tab) return;

    url.searchParams.set("tab", tab);
    window.history.pushState(null, "", url);
  }

  return (
    <>
      <div className="bg-surface border border-subtle rounded-xl p-1 grid grid-cols-3 gap-1 mb-6 min-h-16 sm:min-h-20">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => selectTab(tab.id)}
            className={cn(
              "relative isolate flex min-w-0 flex-col items-center justify-center rounded-lg px-3 py-2.5 text-center cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
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

            <span className="mt-0.5 hidden text-2xs leading-tight text-muted sm:block">
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
              <ExposuresCard />
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
    </>
  );
}
