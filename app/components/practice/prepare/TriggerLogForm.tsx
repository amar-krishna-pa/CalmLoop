"use client";

import { useState } from "react";
import LoadingSpinner from "@/app/components/loaders/LoadingSpinner";
import { cn } from "@/app/lib/cn/cn";
import { createTriggerLogEntry } from "@/app/lib/stores/practice/trigger-log";

export default function TriggerLogForm() {
  const [trigger, setTrigger] = useState("");
  const [context, setContext] = useState("");
  const [anxietyLevel, setAnxietyLevel] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const anxietyValue = Number(anxietyLevel);
  const isValid =
    trigger.trim().length > 0 &&
    context.trim().length > 0 &&
    anxietyLevel.trim() !== "" &&
    anxietyValue >= 0 &&
    anxietyValue <= 10;

  async function handleSubmit() {
    if (!isValid) return;

    setSubmitting(true);

    const ok = await createTriggerLogEntry({
      trigger: trigger.trim(),
      context: context.trim(),
      anxietyLevel: anxietyValue,
    });

    setSubmitting(false);

    if (ok) {
      setTrigger("");
      setContext("");
      setAnxietyLevel("");
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <input
        type="text"
        placeholder="What happened?"
        value={trigger}
        onChange={(e) => setTrigger(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        disabled={submitting}
        className="input-base"
      />

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Where/when? (optional)"
          value={context}
          onChange={(e) => setContext(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          disabled={submitting}
          className="input-base flex-[7]"
        />
        <input
          type="number"
          min={0}
          max={10}
          placeholder="0–10"
          aria-label="Anxiety level (0–10)"
          value={anxietyLevel}
          onChange={(e) => setAnxietyLevel(e.target.value)}
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
        {submitting ? <LoadingSpinner size={14} /> : "Log trigger"}
      </button>
    </div>
  );
}
