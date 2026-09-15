"use client";

import { Fragment, useId, useRef, useState } from "react";
import HorizontalDivider from "@/app/components/common/HorizontalDivider";
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
import { cn } from "@/app/lib/cn";
import { THEMES } from "@/app/constants/fears/themes";

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
    <div className="max-w-full">
      <label htmlFor={inputId} className="sr-only">
        Filter by theme
      </label>
      <Combobox<string>
        items={["All themes", ...[...themes].sort()]}
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
            className="h-10 w-56 max-w-full py-0 focus:shadow-none"
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
          <ComboboxEmpty>No matching themes. You can try another word.</ComboboxEmpty>
          <ComboboxList className="max-h-48 overflow-y-auto">
            {(theme: string) => (
              <Fragment key={theme}>
                <ComboboxItem value={theme} className="rounded-none">
                  {theme}
                </ComboboxItem>
                <div aria-hidden="true" className="last:hidden">
                  <HorizontalDivider />
                </div>
              </Fragment>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}
