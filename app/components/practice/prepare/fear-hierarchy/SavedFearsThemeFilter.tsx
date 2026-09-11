"use client";

import { useId, useRef, useState } from "react";
import { LuChevronDown } from "react-icons/lu";
import {
  Combobox,
  ComboboxInput,
  ComboboxTrigger,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/app/components/ui/combobox";
import { cn } from "@/app/lib/cn/cn";
import { THEMES } from "@/app/lib/fears/themes";

type Theme = (typeof THEMES)[number];
type Props = {
  themes: Theme[];
  value: Theme | null;
  onChange: ({ theme }: { theme: Theme | null }) => void;
};

export default function SavedFearsThemeFilter({
  themes,
  value,
  onChange,
}: Props) {
  const inputId = useId();

  const anchorRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);

  return (
    <div className="w-full sm:max-w-xs">
      <label
        htmlFor={inputId}
        className="mb-1.5 block text-xs font-medium text-primary"
      >
        Filter by theme
      </label>
      <Combobox<string>
        items={["All themes", ...themes]}
        value={value ?? "All themes"}
        onValueChange={(selected) => {
          onChange({
            theme: THEMES.find((theme) => theme === selected) ?? null,
          });
        }}
        open={open}
        onOpenChange={setOpen}
        openOnInputClick
      >
        <div ref={anchorRef} className="relative">
          <ComboboxInput
            id={inputId}
            placeholder="Search themes…"
            className="focus:shadow-none"
          />
          <ComboboxTrigger
            aria-label="Show themes"
            className="absolute inset-y-0 right-0 flex w-9 cursor-pointer items-center justify-center text-muted"
          >
            <LuChevronDown
              className={cn(
                "transition-transform duration-fast",
                open && "rotate-180",
              )}
            />
          </ComboboxTrigger>
        </div>
        <ComboboxContent anchor={anchorRef}>
          <ComboboxEmpty>No themes match your search.</ComboboxEmpty>
          <ComboboxList className="max-h-48 overflow-y-auto">
            {(theme: string) => (
              <ComboboxItem
                key={theme}
                value={theme}
                className="rounded-none border-b border-subtle last:border-b-0"
              >
                {theme}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}
