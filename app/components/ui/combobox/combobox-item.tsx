"use client";

import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox";
import { cn } from "@/app/lib/cn/cn";

import { LuCheck } from "react-icons/lu";

export function ComboboxItem({ className, children, ...props }: ComboboxPrimitive.Item.Props) {
  return (
    <ComboboxPrimitive.Item data-slot="combobox-item" className={cn("relative flex w-full cursor-pointer items-center gap-2 rounded-md py-2 pl-3 pr-8 text-xs font-normal text-primary outline-none select-none data-highlighted:bg-accent/10 data-highlighted:text-accent data-disabled:pointer-events-none data-disabled:opacity-50", className)} {...props}>
      {children}
      <ComboboxPrimitive.ItemIndicator className="pointer-events-none absolute right-2 flex size-4 items-center justify-center">
        <LuCheck size={14} />
      </ComboboxPrimitive.ItemIndicator>
    </ComboboxPrimitive.Item>
  );
}
