"use client";

import { useState } from "react";
import LoadingSpinner from "@/app/components/loaders/LoadingSpinner";
import { cn } from "@/app/lib/cn/cn";
import { createFearHierarchyItem } from "@/app/lib/stores/practice/fear-hierarchy";

export default function FearHierarchyForm() {
  const [situation, setSituation] = useState("");
  const [suds, setSuds] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const sudsValue = Number(suds);
  const isValid =
    situation.trim().length > 0 &&
    suds.trim() !== "" &&
    sudsValue >= 0 &&
    sudsValue <= 10;

  async function handleSubmit() {
    if (!isValid) return;

    setSubmitting(true);

    const ok = await createFearHierarchyItem({
      situation: situation.trim(),
      initialSuds: sudsValue,
    });

    setSubmitting(false);

    if (ok) {
      setSituation("");
      setSuds("");
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Describe the situation..."
          value={situation}
          onChange={(e) => setSituation(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          disabled={submitting}
          className="input-base flex-[7]"
        />
        <input
          type="number"
          min={0}
          max={10}
          placeholder="0–10"
          aria-label="Initial SUDS level (0–10)"
          value={suds}
          onChange={(e) => setSuds(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          disabled={submitting}
          className="input-base flex-[3]"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={submitting || !isValid}
        className={cn(
          "btn-accent w-full h-9 disabled:opacity-60 flex items-center justify-center",
          isValid && !submitting ? "cursor-pointer" : "cursor-not-allowed"
        )}
      >
        {submitting ? <LoadingSpinner size={14} /> : "Add item"}
      </button>
    </div>
  );
}
