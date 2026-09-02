"use client";

import { useState } from "react";
import { LuArrowUp, LuPencilLine } from "react-icons/lu";
import { toast } from "sonner";

import LoadingSpinner from "@/app/components/loaders/LoadingSpinner";
import type { ExtractedFearPreview } from "@/app/lib/types/extraction";

export default function EntryCard() {
  const [value, setValue] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);

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
        console.info("[CalmLoop extraction] No fears found", { fears });
        toast.success("Nothing to add from that one.");
        setValue("");
        return;
      }

      // The preview is the next piece — for now the extraction is just surfaced.
      toast.success(
        `Found ${fears.length === 1 ? "1 fear" : `${fears.length} fears`}`
      );

      console.groupCollapsed(
        `[CalmLoop extraction] ${fears.length} ${fears.length === 1 ? "fear" : "fears"} found`
      );
      console.log("Raw extraction:", fears);
      console.table(
        fears.map((fear, index) => ({
          number: index + 1,
          name: fear.name,
          matchedExistingFear: fear.fearId !== null,
          fearId: fear.fearId ?? "New fear",
          themes: fear.themes.join(", "),
          behaviours: fear.behaviours.join(", ") || "None",
          evidence: fear.evidence,
        }))
      );

      fears.forEach((fear, index) => {
        console.groupCollapsed(`Fear ${index + 1}: ${fear.name}`);
        console.log("Matched existing fear:", fear.fearId !== null);
        console.log("Fear ID:", fear.fearId);
        console.log("Themes:", fear.themes);
        console.log("Evidence:", fear.evidence);
        console.log("Safety behaviours:", fear.behaviours);
        console.groupEnd();
      });
      console.groupEnd();
    } catch {
      toast.error("Could not read that entry. Try again.");
    } finally {
      setIsExtracting(false);
    }
  }

  return (
    <div className="bg-card border border-subtle rounded-xl p-4 flex flex-col gap-3 card-short">
      <div className="flex items-center gap-2">
        <LuPencilLine size={15} className="text-muted" />
        <h2 className="text-sm font-semibold text-primary">
          Describe what you went through
        </h2>
      </div>

      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="What happened, and what did you do about it?"
          disabled={isExtracting}
          rows={4}
          maxLength={5000}
          className="input-base resize-none pr-14 pb-11"
        />

        <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-3">
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
  );
}
