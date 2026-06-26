"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { GoSun, GoMoon } from "react-icons/go";
import ProfileDropdown from "./ProfileDropdown";
import NavItem from "./NavItem";

interface HeaderProps {
  userName?: string | null;
}

export default function Header({ userName }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-50 w-full px-4 sm:px-6 h-14 flex items-center justify-between bg-surface/80 backdrop-blur-md border-b border-subtle">
      <div className="flex items-center h-full">
        <Link
          href="/"
          className="text-[17px] font-semibold tracking-tight text-accent mr-4 px-1"
        >
          CalmLoop
        </Link>

        {userName && (
          <nav
            aria-label="Main navigation"
            className="hidden sm:flex items-center h-full"
          >
            <span
              className="w-0.5 h-4 bg-black/15 dark:bg-white/20 mr-1"
              aria-hidden="true"
            />
            <NavItem
              label="Dashboard"
              href="/dashboard"
              isActive={pathname === "/dashboard"}
            />
            <NavItem
              label="Chat"
              onClick={() => router.push(`/chat/${crypto.randomUUID()}`)}
              isActive={pathname.startsWith("/chat")}
            />
          </nav>
        )}
      </div>

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
          <ProfileDropdown userName={userName} />
        ) : (
          <Link href="/login" className="btn-accent">
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}
