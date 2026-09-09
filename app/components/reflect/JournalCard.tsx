"use client";

import { useState } from "react";
import { LuBookOpen } from "react-icons/lu";

export default function JournalCard() {
  const [value, setValue] = useState("");

  return (
    <div className="bg-card border border-subtle rounded-xl p-4 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <LuBookOpen size={15} className="text-muted" />
        <h2 className="text-sm font-semibold text-primary">Journal</h2>
      </div>

      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="What's on your mind today?"
        rows={4}
        className="input-base resize-none"
      />

      <button
        disabled={!value.trim()}
        className="btn-accent self-end disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Save entry
      </button>
    </div>
  );
}
