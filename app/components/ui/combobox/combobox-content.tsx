"use client";

import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox";
import { cn } from "@/app/lib/cn/cn";

type Props = ComboboxPrimitive.Popup.Props &
  Pick<ComboboxPrimitive.Positioner.Props, "anchor"> & {
    container?: ComboboxPrimitive.Portal.Props["container"];
  };

export function ComboboxContent({ className, anchor, container, ...props }: Props) {
  return (
    <ComboboxPrimitive.Portal container={container}>
      <ComboboxPrimitive.Positioner anchor={anchor} side="bottom" align="start" sideOffset={4} className="isolate z-60 w-[var(--anchor-width)] max-w-[var(--available-width)]">
        <ComboboxPrimitive.Popup data-slot="combobox-content" className={cn("rounded-lg border border-subtle bg-modal p-2 text-primary shadow-lg transition-opacity duration-fast data-starting-style:opacity-0 data-ending-style:opacity-0", className)} {...props} />
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  );
}
