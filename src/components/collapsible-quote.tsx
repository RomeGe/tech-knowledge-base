"use client";

import { useState } from "react";

export function CollapsibleQuote({
  children,
  summary,
  defaultOpen = false,
}: {
  children: React.ReactNode;
  summary?: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <blockquote className="my-6 border-l-3 border-accent">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-surface-hover transition-colors rounded-r cursor-pointer"
      >
        <svg
          className={`w-3.5 h-3.5 text-text-tertiary transition-transform shrink-0 ${
            open ? "rotate-90" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
        <span className="text-sm text-text-secondary">
          {summary ?? (open ? "Click to collapse" : "Click to expand")}
        </span>
      </button>
      {open && (
        <div className="px-4 py-3 text-sm text-text-secondary leading-relaxed">
          {children}
        </div>
      )}
    </blockquote>
  );
}
