"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { cn } from "@/app/lib/cn";

type NavItemProps =
  | { label: string; isActive: boolean; href: string; onClick?: never }
  | { label: string; isActive: boolean; onClick: () => void; href?: never };

export default function NavItem({ label, isActive, href, onClick }: NavItemProps) {
  const className = cn(
    "relative h-14 flex items-center px-3 pb-0.5 text-sm",
    isActive
      ? "text-primary"
      : "text-primary/50 hover:text-primary"
  );

  const content = (
    <>
      {label}
      {isActive && (
        <motion.span
          layoutId="header-navigation-underline"
          initial={false}
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 bg-accent"
        />
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className} aria-current={isActive ? "page" : undefined}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={cn(className, "cursor-pointer")}>
      {content}
    </button>
  );
}
