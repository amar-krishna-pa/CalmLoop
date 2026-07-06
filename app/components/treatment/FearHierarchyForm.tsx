"use client";

import { useState } from "react";
import { toast } from "sonner";
import LoadingSpinner from "@/app/components/loaders/LoadingSpinner";
import { cn } from "@/app/lib/cn/cn";

export default function FearHierarchyForm() {
  const [situation, setSituation] = useState("");
  const [suds, setSuds] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const sudsValue = Number(suds);
  const isValid =
    situation.trim().length > 0 && sudsValue >= 1 && sudsValue <= 10;

  async function handleSubmit() {
    if (!isValid) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/treatment/fear-hierarchy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          situation: situation.trim(),
          initialSuds: sudsValue,
        }),
      });

      if (!res.ok) throw new Error();

      setSituation("");
      setSuds("");
    } catch {
      toast.error("Failed to add item");
    } finally {
      setSubmitting(false);
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
          min={1}
          max={10}
          placeholder="1–10"
          aria-label="SUDS level (1–10)"
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
