"use client";

import { useState } from "react";
import { cn } from "@/app/lib/cn/cn";

const HELPLINES = [
  {
    name: "Tele-MANAS",
    number: "14416",
    tel: "14416",
    note: "Government of India · free · 24/7 · 20+ languages",
  },
  {
    name: "KIRAN",
    number: "1800-599-0019",
    tel: "18005990019",
    note: "Government of India · free · 24/7",
  },
  {
    name: "Vandrevala Foundation",
    number: "1860-2662-345",
    tel: "18602662345",
    note: "24/7",
  },
  {
    name: "iCall",
    number: "9152987821",
    tel: "+919152987821",
    note: "Mon–Sat, 10am–8pm",
  },
];

export default function CrisisSupportLink() {
  const [open, setOpen] = useState(false);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-center mt-2">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className={cn(
            "text-[12px] underline underline-offset-2 transition-colors cursor-pointer",
            open ? "text-accent" : "text-muted hover:text-accent"
          )}
        >
          In crisis or feeling unsafe? Get help now
        </button>
      </div>

      {open && (
        <div className="mt-2 bg-card border border-subtle rounded-xl p-4 text-sm">
          <p className="text-primary font-medium mb-2">
            You don&apos;t have to go through this alone. These helplines are
            free to call:
          </p>
          <ul className="space-y-2">
            {HELPLINES.map((h) => (
              <li
                key={h.name}
                className="flex flex-wrap items-baseline gap-x-2"
              >
                <a
                  href={`tel:${h.tel}`}
                  className="text-accent font-medium whitespace-nowrap"
                >
                  {h.name} · {h.number}
                </a>
                <span className="text-muted text-xs">{h.note}</span>
              </li>
            ))}
          </ul>
          <p className="text-muted text-xs mt-3">
            In immediate danger? Call 112, India&apos;s national emergency
            number.
          </p>
        </div>
      )}
    </div>
  );
}
