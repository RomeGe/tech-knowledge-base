"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";
import { MobileMenu } from "./mobile-menu";
import { ReadingSettings } from "./reading-settings";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/projects", label: "项目" },
  { href: "/archive", label: "归档" },
  { href: "/tools", label: "工具" },
  { href: "/links", label: "链接" },
  { href: "/about", label: "关于" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-surface">
      <nav className="mx-auto flex h-14 max-w-4xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-text-primary hover:text-accent transition-colors"
        >
          Tech.KB
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-6">
          <ul className="flex items-center gap-5">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`text-[13px] transition-colors ${
                      isActive
                        ? "text-text-primary font-medium"
                        : "text-text-tertiary hover:text-text-primary"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Search trigger */}
          <button
            onClick={() => {
              window.dispatchEvent(
                new KeyboardEvent("keydown", { key: "k", metaKey: true })
              );
            }}
            className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-text-tertiary border border-border rounded-md hover:border-accent/30 transition-colors"
          >
            <svg
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            <kbd className="hidden md:inline px-1 py-0.5 border border-border rounded text-[10px]">
              ⌘K
            </kbd>
          </button>

          <ReadingSettings />
          <ThemeToggle />
        </div>

        {/* Mobile nav */}
        <div className="flex sm:hidden items-center gap-2">
          <ThemeToggle />
          <MobileMenu />
        </div>
      </nav>
    </header>
  );
}
