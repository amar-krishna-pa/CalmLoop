"use client";

import { useState } from "react";
import LoadingSpinner from "@/app/components/loaders/LoadingSpinner";
import SearchableDropdown from "@/app/components/common/SearchableDropdown";
import { cn } from "@/app/lib/cn/cn";
import {
  SAFETY_BEHAVIOUR_CATEGORIES,
  SAFETY_BEHAVIOUR_FREQUENCIES,
} from "@/app/lib/zod/safety-behaviour";
import { createSafetyBehaviour } from "@/app/lib/stores/practice/safety-behaviour";

export default function SafetyBehaviourForm() {
  const [behaviour, setBehaviour] = useState("");
  const [category, setCategory] = useState<
    (typeof SAFETY_BEHAVIOUR_CATEGORIES)[number]
  >(SAFETY_BEHAVIOUR_CATEGORIES[0]);
  const [frequency, setFrequency] = useState<
    (typeof SAFETY_BEHAVIOUR_FREQUENCIES)[number]
  >(SAFETY_BEHAVIOUR_FREQUENCIES[0]);
  const [submitting, setSubmitting] = useState(false);

  const isValid = behaviour.trim().length > 0;

  async function handleSubmit() {
    if (!isValid) return;

    setSubmitting(true);

    const ok = await createSafetyBehaviour({
      behaviour: behaviour.trim(),
      category,
      frequency,
    });

    setSubmitting(false);

    if (ok) {
      setBehaviour("");
      setCategory(SAFETY_BEHAVIOUR_CATEGORIES[0]);
      setFrequency(SAFETY_BEHAVIOUR_FREQUENCIES[0]);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <input
        type="text"
        placeholder="What do you do to feel safe?"
        value={behaviour}
        onChange={(e) => setBehaviour(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        disabled={submitting}
        className="input-base"
      />

      <div className="flex gap-2">
        <div className="flex-[7]">
          <SearchableDropdown
            options={SAFETY_BEHAVIOUR_CATEGORIES}
            value={category}
            onChange={(v) =>
              setCategory(v as (typeof SAFETY_BEHAVIOUR_CATEGORIES)[number])
            }
            disabled={submitting}
          />
        </div>

        <div className="flex-[3]">
          <SearchableDropdown
            options={SAFETY_BEHAVIOUR_FREQUENCIES}
            value={frequency}
            onChange={(v) =>
              setFrequency(v as (typeof SAFETY_BEHAVIOUR_FREQUENCIES)[number])
            }
            disabled={submitting}
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={submitting || !isValid}
        className={cn(
          "btn-accent w-full h-9 disabled:opacity-60 flex items-center justify-center",
          isValid && !submitting ? "cursor-pointer" : "cursor-not-allowed"
        )}
      >
        {submitting ? <LoadingSpinner size={14} /> : "Add behaviour"}
      </button>
    </div>
  );
}
