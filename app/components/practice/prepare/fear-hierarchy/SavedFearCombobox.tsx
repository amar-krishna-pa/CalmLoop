"use client";

import { useRef, useState } from "react";
import { Combobox, ComboboxInput, ComboboxTrigger, ComboboxContent, ComboboxList, ComboboxItem, ComboboxEmpty, ComboboxStatus } from "@/app/components/ui/combobox";
import LoadingSpinner from "@/app/components/loaders/LoadingSpinner";
import { AnimatePresence, motion } from "motion/react";
import { LuChevronDown } from "react-icons/lu";
import { cn } from "@/app/lib/cn/cn";

type Props = {
  savedFears: { id: string; name: string }[] | null;
  isLoading: boolean;
  error: string | null;
  onLoad: () => void;
};

export default function SavedFearCombobox({ savedFears, isLoading, error, onLoad }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const inputGroupRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="relative w-full" onKeyDown={(event) => {
      if (open && event.key === "Escape") event.stopPropagation();
    }}>
      <Combobox<{ id: string; name: string }>
        items={savedFears ?? []}
        itemToStringLabel={(fear) => fear.name}
        itemToStringValue={(fear) => fear.id}
        openOnInputClick
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
          if (nextOpen) onLoad();
        }}
      >
        <button
          type="button"
          aria-expanded={isExpanded}
          onClick={() => {
            setIsExpanded(!isExpanded);
            setOpen(!isExpanded);
            if (!isExpanded) onLoad();
          }}
          className="flex min-h-5 items-center text-left text-2xs font-medium text-accent cursor-pointer transition-opacity duration-fast hover:opacity-80"
        >
          {isExpanded ? "Hide saved fears" : "Match an existing fear"}
        </button>
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              key="search-input"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-1 pt-2">
                <div ref={inputGroupRef} className="relative w-full">
                  <ComboboxInput
                    aria-label="Search saved fears"
                    placeholder="Search saved fears…"
                    className="input-base w-full border-subtle/60 bg-modal/70 pr-9"
                  />
                  <ComboboxTrigger
                    aria-label={isLoading ? "Loading saved fears" : "Show saved fears"}
                    className="absolute inset-y-0 right-0 flex w-9 cursor-pointer items-center justify-center text-muted"
                  >
                    {isLoading ? <LoadingSpinner /> : (
                      <LuChevronDown className={cn("transition-transform duration-fast", open && "rotate-180")} />
                    )}
                  </ComboboxTrigger>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <ComboboxContent anchor={inputGroupRef} container={containerRef}>
            <ComboboxStatus className="text-2xs text-muted empty:hidden">
              {isLoading ? "Loading saved fears…" : error}
            </ComboboxStatus>
            {error && (
              <button type="button" onClick={onLoad} disabled={isLoading} className="text-2xs text-accent disabled:opacity-60">
                {isLoading ? <LoadingSpinner /> : "Retry loading saved fears"}
              </button>
            )}
            {!isLoading && !error && savedFears !== null && (
              <ComboboxEmpty className="py-2 text-xs font-normal text-muted">
                {savedFears.length === 0 ? "No saved fears yet." : "No fears match your search."}
              </ComboboxEmpty>
            )}
            <ComboboxList className="max-h-48 overflow-y-auto">
              {(fear: { id: string; name: string }) => (
                <ComboboxItem key={fear.id} value={fear} className="cursor-pointer rounded-md px-3 py-2 text-xs font-normal text-primary data-highlighted:bg-accent/10 data-highlighted:text-accent">
                  {fear.name}
                </ComboboxItem>
              )}
            </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}
