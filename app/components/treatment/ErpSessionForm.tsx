"use client";

import { useState } from "react";
import LoadingSpinner from "@/app/components/loaders/LoadingSpinner";
import { cn } from "@/app/lib/cn/cn";
import { createErpSession } from "@/app/lib/stores/treatment/erp-session";

export default function ErpSessionForm() {
  const [trigger, setTrigger] = useState("");
  const [anxietyBefore, setAnxietyBefore] = useState("");
  const [anxietyAfter, setAnxietyAfter] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const beforeValue = Number(anxietyBefore);
  const afterValue = Number(anxietyAfter);

  const isValid =
    trigger.trim().length > 0 &&
    anxietyBefore.trim() !== "" &&
    beforeValue >= 0 &&
    beforeValue <= 10 &&
    anxietyAfter.trim() !== "" &&
    afterValue >= 0 &&
    afterValue <= 10;

  async function handleSubmit() {
    if (!isValid) return;

    setSubmitting(true);

    const ok = await createErpSession({
      trigger: trigger.trim(),
      anxietyBefore: beforeValue,
      anxietyAfter: afterValue,
      notes: notes.trim() || undefined,
    });

    setSubmitting(false);

    if (ok) {
      setTrigger("");
      setAnxietyBefore("");
      setAnxietyAfter("");
      setNotes("");
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <input
        type="text"
        placeholder="What was the exposure? (e.g. Touched door handle)"
        value={trigger}
        onChange={(e) => setTrigger(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        disabled={submitting}
        className="input-base"
      />

      <div className="flex gap-2">
        <input
          type="number"
          min={0}
          max={10}
          placeholder="Before (0–10)"
          aria-label="Anxiety before (0–10)"
          value={anxietyBefore}
          onChange={(e) => setAnxietyBefore(e.target.value)}
          disabled={submitting}
          className="input-base flex-1"
        />
        <input
          type="number"
          min={0}
          max={10}
          placeholder="After (0–10)"
          aria-label="Anxiety after (0–10)"
          value={anxietyAfter}
          onChange={(e) => setAnxietyAfter(e.target.value)}
          disabled={submitting}
          className="input-base flex-1"
        />
      </div>

      <input
        type="text"
        placeholder="Notes (optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        disabled={submitting}
        className="input-base"
      />

      <button
        onClick={handleSubmit}
        disabled={submitting || !isValid}
        className={cn(
          "btn-accent w-full h-9 disabled:opacity-60 flex items-center justify-center",
          isValid && !submitting ? "cursor-pointer" : "cursor-not-allowed"
        )}
      >
        {submitting ? <LoadingSpinner size={14} /> : "Log session"}
      </button>
    </div>
  );
}
