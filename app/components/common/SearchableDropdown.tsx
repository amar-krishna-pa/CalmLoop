"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { LuCheck, LuChevronDown } from "react-icons/lu";
import { cn } from "@/app/lib/cn/cn";

type Props = {
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
};

const PANEL_MAX_HEIGHT = 250;

export default function SearchableDropdown({
  options,
  value,
  onChange,
  placeholder = "Select…",
  disabled = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const [query, setQuery] = useState("");

  const ref = useRef<HTMLDivElement>(null);

  function handleToggle() {
    if (!open && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      setOpenUpward(spaceBelow < PANEL_MAX_HEIGHT && spaceAbove > spaceBelow);
    }
    setOpen((o) => !o);
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }

    if (open) document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const filtered = useMemo(
    () => options.filter((o) => o.toLowerCase().includes(query.toLowerCase())),
    [options, query]
  );

  function handleSelect(option: string) {
    onChange(option);
    setOpen(false);
    setQuery("");
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className="input-base cursor-pointer flex items-center justify-between gap-2 text-left disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <span className={cn("truncate", !value && "text-muted")}>
          {value || placeholder}
        </span>
        <LuChevronDown
          size={14}
          className={cn(
            "shrink-0 text-muted transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div
          className={cn(
            "absolute left-0 right-0 rounded-lg border border-subtle bg-surface shadow-lg z-50 overflow-hidden",
            openUpward ? "bottom-full mb-1" : "top-full mt-1"
          )}
        >
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search…"
            className="w-full px-3 py-2 text-sm bg-transparent border-0 border-b border-subtle text-primary placeholder:text-muted focus:outline-none"
          />

          <ul className="max-h-48 overflow-y-auto py-1">
            {filtered.length === 0 && (
              <li className="px-3 py-2 text-xs text-muted">No matches</li>
            )}

            {filtered.map((option) => (
              <li key={option}>
                <button
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={cn(
                    "w-full flex items-center justify-between gap-2 text-left px-3 py-2 text-sm cursor-pointer transition-colors",
                    option === value
                      ? "bg-accent/10 text-accent"
                      : "text-primary hover:bg-accent/5"
                  )}
                >
                  <span className="truncate">{option}</span>
                  {option === value && (
                    <LuCheck size={14} className="shrink-0" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
