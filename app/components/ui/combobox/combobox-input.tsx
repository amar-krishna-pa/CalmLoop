"use client";

import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox";
import { cn } from "@/app/lib/cn/cn";

export function ComboboxInput({ className, ...props }: ComboboxPrimitive.Input.Props) {
  return <ComboboxPrimitive.Input data-slot="combobox-input" className={cn("input-base w-full border-subtle/60 bg-modal/70 pr-9", className)} {...props} />;
}
