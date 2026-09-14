"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import SavedFearsLoader from "@/app/components/loaders/SavedFearsLoader";
import { THEMES } from "@/app/constants/fears/themes";
import SavedFearsThemeFilter from "@/app/components/practice/prepare/saved-fears/SavedFearsThemeFilter";
import { AnimatePresence, motion } from "motion/react";
import { SavedFearSchema, type SavedFear } from "@/app/lib/zod/saved-schema";
import SavedFearDialog from "@/app/components/practice/prepare/saved-fears/SavedFearDialog";
import SavedFearItem from "@/app/components/practice/prepare/saved-fears/SavedFearItem";

const SavedFearsSchema = z.object({ fears: z.array(SavedFearSchema) });

export default function SavedFearsCard() {
  const [fears, setFears] = useState<SavedFear[] | null>(null);
  const [openFearId, setOpenFearId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [selectedTheme, setSelectedTheme] = useState<
    (typeof THEMES)[number] | null
  >(null);

  const openFear = fears?.find((fear) => fear.id === openFearId);

  const availableThemes = THEMES.filter(
    (theme) =>
      theme === selectedTheme ||
      fears?.some((fear) => fear.themes.includes(theme)),
  );

  const visibleFears = fears?.filter(
    (fear) => selectedTheme === null || fear.themes.includes(selectedTheme),
  );

  useEffect(() => {
    const controller = new AbortController();

    async function loadFears() {
      try {
        const response = await fetch("/api/fears", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            response.status === 401
              ? "Please sign in again to load your saved fears."
              : "Could not load your saved fears. Please try again.",
          );
        }

        const data = SavedFearsSchema.parse(await response.json());

        if (!controller.signal.aborted) {
          setFears(data.fears);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setError(
            error instanceof Error && error.message.startsWith("Please sign in")
              ? error.message
              : "Could not load your saved fears. Please try again.",
          );
        }
      }
    }

    void loadFears();

    return () => controller.abort();
  }, [attempt]);

  return (
    <section
      aria-labelledby="saved-fears-heading"
      className="bg-card border border-subtle rounded-xl p-4 flex flex-col gap-4 card-medium"
    >
      <div className="flex items-center justify-between gap-3">
        <h2
          id="saved-fears-heading"
          className="text-sm font-semibold text-primary"
        >
          Saved fears
        </h2>

        {fears !== null && (
          <span aria-live="polite" className="text-xs text-muted">
            {selectedTheme !== null ? `${visibleFears?.length ?? 0} of ` : ""}
            {fears.length} {fears.length === 1 ? "fear" : "fears"}
          </span>
        )}
      </div>

      {!error && fears !== null && fears.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <SavedFearsThemeFilter
            themes={availableThemes}
            value={selectedTheme}
            onChange={({ theme }) => setSelectedTheme(theme)}
          />
        </div>
      )}

      <div className="flex-1 min-h-0 overflow-y-auto">
        {error ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <p role="alert" className="text-sm text-muted">
              {error}
            </p>

            <button
              type="button"
              className="btn-accent px-4 py-2 cursor-pointer"
              onClick={() => {
                setError(null);
                setAttempt((current) => current + 1);
              }}
            >
              Try again
            </button>
          </div>
        ) : fears === null ? (
          <SavedFearsLoader />
        ) : fears.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-1 text-center">
            <p className="text-sm font-medium text-primary">
              No saved fears yet
            </p>

            <p className="max-w-sm text-xs text-muted">
              Describe what you went through above, then review and save your
              entry.
            </p>
          </div>
        ) : (
          <ul className="relative divide-y divide-subtle">
            <AnimatePresence initial={false} mode="popLayout">
              {visibleFears?.map((fear) => (
                <motion.li
                  key={fear.id}
                  layout="position"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-4 first:pt-0 last:pb-0"
                >
                  <SavedFearItem
                    fear={fear}
                    onOpen={() => setOpenFearId(fear.id)}
                  />
                </motion.li>
              ))}

              {visibleFears?.length === 0 && (
                <motion.li
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-muted"
                >
                  No saved fears match this theme. Choose another theme or All
                  themes.
                </motion.li>
              )}
            </AnimatePresence>
          </ul>
        )}
      </div>

      <AnimatePresence initial={false}>
        {openFear && (
          <SavedFearDialog
            key={openFear.id}
            fear={openFear}
            onClose={() => setOpenFearId(null)}
            onSaved={({ fear: updated }) =>
              setFears(
                (current) =>
                  current
                    ?.map((fear) => (fear.id === updated.id ? updated : fear))
                    .sort(
                      (left, right) =>
                        left.name.localeCompare(right.name) ||
                        left.id.localeCompare(right.id),
                    ) ?? null,
              )
            }
          />
        )}
      </AnimatePresence>
    </section>
  );
}
