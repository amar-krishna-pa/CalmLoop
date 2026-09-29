"use client";

import { Fragment, useRef, useState, type ReactNode } from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxTrigger,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
  ComboboxStatus,
} from "@/app/components/ui/combobox";
import LoadingSpinner from "@/app/components/loaders/LoadingSpinner";
import HorizontalDivider from "@/app/components/common/HorizontalDivider";
import { AnimatePresence, motion } from "motion/react";
import { LuChevronDown } from "react-icons/lu";
import { cn } from "@/app/lib/cn";

type Props = {
  leadingAction?: ReactNode;
  triggerLabel?: string;
  savedFears: { id: string; name: string }[] | null;
  isLoading: boolean;
  error: string | null;
  onLoad: () => void;
  onSelect: ({ fear }: { fear: { id: string; name: string } }) => void;
};

export default function SavedFearCombobox({
  savedFears,
  isLoading,
  error,
  onLoad,
  onSelect,
  leadingAction,
  triggerLabel = "Match an existing fear",
}: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const inputGroupRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative flex w-full flex-wrap items-center gap-x-2"
      onKeyDown={(event) => {
        if (open && event.key === "Escape") event.stopPropagation();
      }}
    >
      <Combobox<{ id: string; name: string }>
        items={savedFears ?? []}
        itemToStringLabel={(fear) => fear.name}
        itemToStringValue={(fear) => fear.id}
        onValueChange={(fear) => {
          if (fear === null) return;
          setOpen(false);
          setIsExpanded(false);
          onSelect({ fear });
        }}
        openOnInputClick
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
          if (nextOpen) onLoad();
        }}
      >
        <AnimatePresence initial={false} mode="popLayout">
          {leadingAction && (
            <motion.div
              key="leading-action"
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              {leadingAction}
              <span aria-hidden="true" className="text-2xs text-muted">
                ·
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button
          layout="position"
          type="button"
          aria-expanded={isExpanded}
          onClick={() => {
            setIsExpanded(!isExpanded);
            setOpen(!isExpanded);
            if (!isExpanded) onLoad();
          }}
          className="flex min-h-5 items-center text-left text-2xs font-medium text-accent cursor-pointer transition-opacity duration-fast hover:opacity-80"
        >
          <AnimatePresence initial={false} mode="wait">
            <motion.span
              key={isExpanded ? "hide" : triggerLabel}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {isExpanded ? "Hide saved fears" : triggerLabel}
            </motion.span>
          </AnimatePresence>
        </motion.button>
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              key="search-input"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="w-full basis-full overflow-hidden"
            >
              <div className="pt-2">
                <div ref={inputGroupRef} className="relative w-full">
                  <ComboboxInput
                    autoFocus
                    aria-label="Search saved fears"
                    placeholder="Search saved fears…"
                    className="input-base w-full border-subtle/60 bg-modal/70 pr-9 focus:shadow-[inset_0_0_0_2px_var(--accent)]"
                  />
                  <ComboboxTrigger
                    aria-label={
                      isLoading ? "Loading saved fears" : "Show saved fears"
                    }
                    className="absolute inset-y-0 right-0 flex w-9 cursor-pointer items-center justify-center text-muted"
                  >
                    {isLoading ? (
                      <LoadingSpinner />
                    ) : (
                      <LuChevronDown
                        className={cn(
                          "transition-transform duration-fast",
                          open && "rotate-180",
                        )}
                      />
                    )}
                  </ComboboxTrigger>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <ComboboxContent anchor={inputGroupRef} container={containerRef}>
          <div className="modal-scrollbar relative h-48 overflow-y-auto">
            <ComboboxStatus className="text-2xs text-muted empty:hidden">
              {isLoading ? "Loading saved fears…" : error}
            </ComboboxStatus>
            {error && (
              <button
                type="button"
                onClick={onLoad}
                disabled={isLoading}
                className="flex min-h-8 w-full items-center justify-center text-2xs text-accent disabled:opacity-60"
              >
                {isLoading ? <LoadingSpinner /> : "Try again"}
              </button>
            )}
            {!isLoading && !error && savedFears !== null && (
              <ComboboxEmpty className="absolute inset-0 flex items-center justify-center px-4 text-center text-xs font-normal text-muted">
                {savedFears.length === 0
                  ? "No saved fears yet."
                  : "No matching fears. You can try another word."}
              </ComboboxEmpty>
            )}
            <ComboboxList>
              {(fear: { id: string; name: string }) => (
                <Fragment key={fear.id}>
                  <ComboboxItem
                    value={fear}
                    className="cursor-pointer rounded-md px-3 py-2 text-xs font-normal text-primary data-highlighted:bg-accent/10 data-highlighted:text-accent"
                  >
                    {fear.name}
                  </ComboboxItem>
                  <HorizontalDivider />
                </Fragment>
              )}
            </ComboboxList>
          </div>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}
