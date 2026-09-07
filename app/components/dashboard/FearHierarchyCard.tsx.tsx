"use client";

import { useState } from "react";
import { LuArrowUp, LuPencilLine } from "react-icons/lu";
import { toast } from "sonner";

import ExtractionPreviewModal from "@/app/components/dashboard/ExtractionPreviewModal";
import LoadingSpinner from "@/app/components/loaders/LoadingSpinner";
import type { ExtractedFearPreview } from "@/app/lib/types/extraction";

export default function FearHierarchyCard() {
  const [value, setValue] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [previewFears, setPreviewFears] = useState<
    ExtractedFearPreview[] | null
  >(null);

  async function handleSubmit() {
    setIsExtracting(true);
    try {
      const response = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: value.trim() }),
      });

      if (!response.ok) {
        toast.error("Could not read that entry. Try again.");
        return;
      }

      const { fears }: { fears: ExtractedFearPreview[] } = await response.json();

      // An entry with no OCD content in it is a correct result, not a failure.
      if (fears.length === 0) {
        toast.success("Nothing to add from that one.");
        setPreviewFears(null);
        return;
      }

      setPreviewFears(fears);
    } catch {
      toast.error("Could not read that entry. Try again.");
    } finally {
      setIsExtracting(false);
    }
  }

  return (
    <>
      <div className="bg-card border border-subtle rounded-xl p-4 flex flex-col gap-3 card-short">
      <div className="flex items-center gap-2">
        <LuPencilLine size={15} className="text-muted" />
        <h2 className="text-sm font-semibold text-primary">
          Describe what you went through
        </h2>
      </div>

      <div className="flex flex-1 min-h-0 flex-col gap-3">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="What happened, and what did you do about it?"
          disabled={isExtracting}
          maxLength={5000}
          className="min-h-0 flex-1 w-full resize-none rounded-xl border border-subtle bg-primary px-3 py-2 text-sm text-primary placeholder:text-muted transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/10 disabled:cursor-not-allowed disabled:opacity-60"
        />

        <div className="flex items-center justify-between gap-3 px-1">
          <span className="text-caption text-muted">
            A few sentences is enough
          </span>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!value.trim() || isExtracting}
            aria-label="Continue"
            title="Continue"
            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-on-accent transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isExtracting ? <LoadingSpinner /> : <LuArrowUp size={16} />}
          </button>
        </div>
      </div>
      </div>

      {previewFears && (
        <ExtractionPreviewModal
          fears={previewFears}
          onDiscard={() => setPreviewFears(null)}
          onSave={({ fears }) => {
            toast.info("Save will be connected in the next step.");
          }}
        />
      )}
    </>
  );
}
