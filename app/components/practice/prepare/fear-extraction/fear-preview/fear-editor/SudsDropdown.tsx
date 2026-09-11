"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { LuCheck, LuChevronDown } from "react-icons/lu";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/app/lib/cn/cn";

type Props = {
  id: string;
  value: number | null;
  onChange: ({ value }: { value: number }) => void;
};

const SUDS_OPTIONS = Array.from({ length: 11 }, (_, value) => value);
const PANEL_MAX_HEIGHT = 256;

type MenuPosition = {
  left: number;
  width: number;
  top?: number;
  bottom?: number;
};

function getOptionLabel({ value }: { value: number }) {
  if (value === 0) return "0 — No distress";
  if (value === 10) return "10 — Extreme distress";
  return String(value);
}

export default function SudsDropdown({ id, value, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [opensUpward, setOpensUpward] = useState(false);
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  function toggleDropdown() {
    if (isOpen) {
      setIsOpen(false);
      return;
    }

    if (dropdownRef.current) {
      const bounds = dropdownRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - bounds.bottom;
      const spaceAbove = bounds.top;
      const shouldOpenUpward =
        spaceBelow < PANEL_MAX_HEIGHT && spaceAbove > spaceBelow;

      setOpensUpward(shouldOpenUpward);
      setMenuPosition({
        left: bounds.left,
        width: bounds.width,
        ...(shouldOpenUpward
          ? { bottom: window.innerHeight - bounds.top + 4 }
          : { top: bounds.bottom + 4 }),
      });

      setIsOpen(true);
    }
  }

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !menuRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    if (isOpen) {
      document.addEventListener("mousedown", handlePointerDown);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const menu = (
    <div inert={!isOpen} aria-hidden={!isOpen}>
      <AnimatePresence initial={false}>
        {isOpen && menuPosition && (
          <motion.div
            key="suds-menu"
            ref={menuRef}
            style={menuPosition}
            initial={{ opacity: 0, y: opensUpward ? 4 : -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: opensUpward ? 4 : -4 }}
            className="fixed z-60 max-h-64 overflow-y-auto rounded-lg border border-subtle/60 bg-modal p-1 shadow-lg"
          >
            <div role="listbox" aria-label="Distress rating">
              {SUDS_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  role="option"
                  aria-selected={option === value}
                  tabIndex={isOpen ? 0 : -1}
                  onClick={() => {
                    onChange({ value: option });
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex w-full cursor-pointer items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors",
                    option === value
                      ? "bg-accent/10 text-accent"
                      : "text-primary hover:bg-accent/10",
                  )}
                >
                  <span>{getOptionLabel({ value: option })}</span>
                  {option === value && (
                    <LuCheck size={15} className="shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div ref={dropdownRef} className="relative">
      <button
        id={id}
        type="button"
        onClick={toggleDropdown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="input-base flex cursor-pointer items-center justify-between gap-2 border-subtle/60 bg-modal/70 text-left"
      >
        <span className={value === null ? "text-muted" : undefined}>
          {value === null ? "Choose a rating" : getOptionLabel({ value })}
        </span>

        <LuChevronDown
          size={16}
          className={cn(
            "shrink-0 text-muted transition-transform duration-fast ease-out motion-reduce:transition-none",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {typeof document !== "undefined"
        ? createPortal(menu, document.body)
        : null}
    </div>
  );
}
