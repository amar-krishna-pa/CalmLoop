"use client";

import Link from "next/link";
import { cn } from "@/app/lib/cn/cn";

type NavItemProps =
  | { label: string; isActive: boolean; href: string; onClick?: never }
  | { label: string; isActive: boolean; onClick: () => void; href?: never };

export default function NavItem({ label, isActive, href, onClick }: NavItemProps) {
  const className = cn(
    "h-14 flex items-center px-3 text-sm border-b-2 transition-colors duration-150",
    isActive
      ? "text-primary border-accent"
      : "text-primary/50 border-transparent hover:text-primary"
  );

  if (href) {
    return <Link href={href} className={className}>{label}</Link>;
  }

  return (
    <button onClick={onClick} className={cn(className, "cursor-pointer")}>
      {label}
    </button>
  );
}
