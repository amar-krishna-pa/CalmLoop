"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authClient } from "@/app/lib/auth/auth-client";
import { cn } from "@/app/lib/cn/cn";

type ProfileDropdownProps = {
  userName: string;
};

const NAV_ITEMS = [
  { label: "Today", href: "/today" },
  { label: "Treatment", href: "/treatment" },
  { label: "Reflect", href: "/reflect" },
  { label: "Support", href: "/support" },
  { label: "Learn", href: "/learn" },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function ProfileDropdown({ userName }: ProfileDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const pathname = usePathname();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  async function handleLogout() {
    await authClient.signOut();
    setOpen(false);
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-medium bg-primary border border-subtle text-primary cursor-pointer"
        aria-label="Account menu"
      >
        {getInitials(userName)}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-lg border border-subtle bg-surface shadow-lg py-1 z-50">
          <div className="px-3 py-2 border-b border-subtle">
            <p className="text-[12px] font-medium text-primary truncate">
              {userName}
            </p>
          </div>

          <div className="sm:hidden border-b border-subtle py-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "block px-3 py-2 text-[13px] transition-colors",
                  pathname === item.href
                    ? "text-accent font-medium"
                    : "text-muted hover:text-primary"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="block w-full text-left px-3 py-2 text-[13px] text-muted hover:text-primary hover:bg-surface/60 transition-colors"
          >
            Profile
          </Link>

          <div className="border-t border-subtle mt-1 pt-1">
            <button
              onClick={handleLogout}
              className="cursor-pointer w-full text-left px-3 py-2 text-[13px] text-warning-text hover:bg-surface/60 transition-colors"
            >
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
