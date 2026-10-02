"use client";

import { Fragment, useId, useRef, useState } from "react";
import { LuChevronDown } from "react-icons/lu";
import HorizontalDivider from "@/app/components/common/HorizontalDivider";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from "@/app/components/ui/combobox";
import { cn } from "@/app/lib/cn";
import type { SavedFear } from "@/app/lib/zod/saved-fear-schema";

type Props = {
  fears: SavedFear[];
  value: string | null;
  onChange: ({ fearId }: { fearId: string | null }) => void;
};

export default function ExposureFearSelector({
  fears,
  value,
  onChange,
}: Props) {
  const selectId = useId();
  const anchorRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  return (
    <div>
      <label htmlFor={selectId} className="sr-only">
        Choose a fear
      </label>
      <Combobox<SavedFear>
        items={fears}
        value={fears.find((fear) => fear.id === value) ?? null}
        itemToStringLabel={(fear) => fear.name}
        itemToStringValue={(fear) => fear.id}
        onValueChange={(fear) => onChange({ fearId: fear?.id ?? null })}
        open={open}
        onOpenChange={setOpen}
        openOnInputClick
      >
        <div ref={anchorRef} className="relative">
          <ComboboxInput
            id={selectId}
            placeholder="Choose a saved fear"
            className="h-10 py-0 focus:shadow-none"
          />
          <ComboboxTrigger
            aria-label="Show saved fears"
            className="absolute inset-y-0 right-0 flex w-9 cursor-pointer items-center justify-center text-muted"
          >
            <LuChevronDown
              size={16}
              aria-hidden="true"
              className={cn(
                "transition-transform duration-fast",
                open && "rotate-180",
              )}
            />
          </ComboboxTrigger>
        </div>

        <ComboboxContent anchor={anchorRef}>
          <ComboboxEmpty>
            No matching fears. You can try another word.
          </ComboboxEmpty>

          <ComboboxList className="max-h-48 overflow-y-auto">
            {(fear: SavedFear) => (
              <Fragment key={fear.id}>
                <ComboboxItem value={fear} className="rounded-none">
                  <span className="min-w-0 whitespace-normal wrap-break-words">
                    {fear.name}
                  </span>
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
