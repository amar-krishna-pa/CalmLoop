"use client";

import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox";
import { cn } from "@/app/lib/cn/cn";

export function ComboboxList({ className, ...props }: ComboboxPrimitive.List.Props) {
  return <ComboboxPrimitive.List data-slot="combobox-list" className={cn("max-h-48 overflow-y-auto p-1 data-empty:p-0", className)} {...props} />;
}
