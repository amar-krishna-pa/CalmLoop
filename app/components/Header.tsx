"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { GoSun, GoMoon } from "react-icons/go";

interface HeaderProps {
  userName?: string | null;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function Header({ userName }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-50 w-full px-4 sm:px-6 h-14 flex items-center justify-between bg-surface/80 backdrop-blur-md border-b border-subtle">
      <Link
        href="/"
        className="text-[15px] font-medium tracking-tight text-primary"
      >
        CalmLoop
      </Link>

      <div className="flex items-center gap-2 sm:gap-3">
        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
            className="icon-btn cursor-pointer"
          >
            {theme === "dark" ? <GoSun size={15} /> : <GoMoon size={15} />}
          </button>
        )}

        {userName ? (
          <div className="flex items-center gap-2 text-muted">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-medium bg-primary border border-subtle text-primary">
              {getInitials(userName)}
            </div>
            <span className="text-[13px] hidden sm:block">{userName}</span>
          </div>
        ) : (
          <Link href="/login" className="btn-accent">
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}
