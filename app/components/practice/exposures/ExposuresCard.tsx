"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { LuChevronDown } from "react-icons/lu";
import HorizontalDivider from "@/app/components/common/HorizontalDivider";
import ExposuresCardLoader from "@/app/components/loaders/ExposuresCardLoader";
import LoadingSpinner from "@/app/components/loaders/LoadingSpinner";
import { THEMES } from "@/app/constants/fears/themes";
import { cn } from "@/app/lib/cn";
import {
  ExposuresResponseSchema,
  type Exposure,
} from "@/app/lib/zod/exposure-schema";

type Theme = (typeof THEMES)[number];
type FearGroup = {
  fearId: string;
  fearName: string;
  themes: Theme[];
  situations: Exposure[];
};

export default function ExposuresCard() {
  const [exposures, setExposures] = useState<Exposure[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [openFearId, setOpenFearId] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadExposures() {
      try {
        const response = await fetch("/api/exposures", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            response.status === 401
              ? "Please sign in to view your practice situations."
              : "We couldn’t load your practice situations. You can try again.",
          );
        }

        const data = ExposuresResponseSchema.parse(await response.json());

        if (!controller.signal.aborted) {
          setExposures(data.exposures);
          setError(null);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setError(
            error instanceof Error && error.message.startsWith("Please sign in")
              ? error.message
              : "We couldn’t load your practice situations. You can try again.",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsRetrying(false);
        }
      }
    }

    void loadExposures();

    return () => controller.abort();
  }, [attempt]);

  const themeSet = new Set<Theme>();
  const groupsByFearId = new Map<string, FearGroup>();
  let visibleSituationCount = 0;

  for (const exposure of exposures ?? []) {
    for (const theme of exposure.themes) {
      themeSet.add(theme);
    }

    if (selectedTheme !== null && !exposure.themes.includes(selectedTheme)) {
      continue;
    }

    visibleSituationCount += 1;
    const group = groupsByFearId.get(exposure.fearId);
    if (group) {
      group.situations.push(exposure);
    } else {
      groupsByFearId.set(exposure.fearId, {
        fearId: exposure.fearId,
        fearName: exposure.fearName,
        themes: exposure.themes,
        situations: [exposure],
      });
    }
  }

  const availableThemes = THEMES.filter(
    (theme) => theme === selectedTheme || themeSet.has(theme),
  );

  const visibleFearGroups = [...groupsByFearId.values()];

  const situationWord =
    visibleSituationCount === 1 ? "situation" : "situations";
  const fearWord = visibleFearGroups.length === 1 ? "fear" : "fears";
  const countSummary = `${visibleSituationCount} ${situationWord} in ${visibleFearGroups.length} ${fearWord}`;

  return (
    <section
      aria-labelledby="exposures-heading"
      className="bg-card border border-subtle rounded-xl p-4 flex flex-col gap-4 card-medium"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2
            id="exposures-heading"
            className="text-sm font-semibold text-primary"
          >
            Exposure practice
          </h2>
          <p className="mt-1 text-xs text-muted">
            Situations you have recorded for possible practice.
          </p>
        </div>

        <span aria-live="polite" className="shrink-0 text-xs text-muted">
          {!error && exposures !== null && countSummary}
        </span>
      </div>

      {!error && exposures !== null && exposures.length > 0 && (
        <div
          aria-label="Filter practice situations by theme"
          className="flex min-h-8 flex-wrap items-center gap-2"
          role="group"
        >
          {[null, ...availableThemes].map((theme) => {
            const isSelected = selectedTheme === theme;

            return (
              <button
                key={theme ?? "all"}
                type="button"
                aria-pressed={isSelected}
                onClick={() => {
                  setSelectedTheme(theme);
                  setOpenFearId(null);
                }}
                className={cn(
                  "cursor-pointer rounded-full border px-3 py-1.5 text-xs transition-colors duration-fast focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                  isSelected
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-subtle text-muted hover:border-accent hover:text-primary",
                )}
              >
                {theme ?? "All themes"}
              </button>
            );
          })}
        </div>
      )}

      <div className="flex-1 min-h-0 overflow-y-auto pr-1">
        {error ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <p role="alert" className="text-sm text-muted">
              {error}
            </p>
            <button
              type="button"
              className="btn-accent flex h-8 min-w-24 cursor-pointer items-center justify-center px-4 py-0"
              disabled={isRetrying}
              onClick={() => {
                setIsRetrying(true);
                setAttempt((current) => current + 1);
              }}
            >
              {isRetrying ? <LoadingSpinner /> : "Try again"}
            </button>
          </div>
        ) : exposures === null ? (
          <ExposuresCardLoader />
        ) : exposures.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-1 text-center">
            <p className="text-sm font-medium text-primary">
              No practice situations yet
            </p>
            <p className="max-w-sm text-xs text-muted">
              Situations saved in <strong>Prepare</strong> will appear here.
            </p>
          </div>
        ) : (
          <ul className="relative">
            <AnimatePresence initial={false} mode="popLayout">
              {visibleFearGroups.map((group) => (
                <motion.li
                  key={group.fearId}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h3>
                    <button
                      type="button"
                      aria-expanded={openFearId === group.fearId}
                      aria-controls={`exposure-group-${group.fearId}`}
                      onClick={() =>
                        setOpenFearId((current) =>
                          current === group.fearId ? null : group.fearId,
                        )
                      }
                      className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg px-2 py-3 text-left transition-colors duration-fast hover:bg-accent/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    >
                      <span className="min-w-0">
                        <span className="block wrap-break-words text-sm font-semibold text-primary">
                          {group.fearName}
                        </span>
                        <span className="mt-0.5 block text-xs text-muted">
                          {group.themes.length > 0 &&
                            `${group.themes.join(", ")} · `}
                          {group.situations.length}{" "}
                          {group.situations.length === 1
                            ? "situation"
                            : "situations"}
                        </span>
                      </span>
                      <LuChevronDown
                        aria-hidden="true"
                        className={cn(
                          "shrink-0 text-muted transition-transform duration-fast ease-out",
                          openFearId === group.fearId && "rotate-180",
                        )}
                      />
                    </button>
                  </h3>

                  <AnimatePresence initial={false}>
                    {openFearId === group.fearId && (
                      <motion.div
                        id={`exposure-group-${group.fearId}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-2 pb-3">
                          <HorizontalDivider />
                          <ul className="space-y-3 pt-3">
                            {group.situations.map((situation) => (
                              <li
                                key={situation.id}
                                className="flex items-start justify-between gap-4"
                              >
                                <p className="min-w-0 wrap-break-words text-xs leading-relaxed text-muted">
                                  {situation.evidence}
                                </p>
                                <span
                                  aria-label={
                                    situation.currentSuds === null
                                      ? `Initial distress ${situation.initialSuds} out of 10`
                                      : `Distress changed from ${situation.initialSuds} to ${situation.currentSuds} out of 10`
                                  }
                                  className="shrink-0 rounded-lg bg-surface px-2.5 py-1.5 text-xs font-medium text-primary"
                                >
                                  {situation.currentSuds === null
                                    ? `${situation.initialSuds}/10`
                                    : `${situation.initialSuds} → ${situation.currentSuds}`}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <HorizontalDivider />
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </section>
  );
}
