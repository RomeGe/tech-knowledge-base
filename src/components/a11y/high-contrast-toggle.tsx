"use client";

import { useState, useEffect } from "react";

export function HighContrastToggle() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("high-contrast") === "true";
    setEnabled(stored);
    if (stored) {
      document.documentElement.setAttribute("data-high-contrast", "");
    }
  }, []);

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    if (next) {
      document.documentElement.setAttribute("data-high-contrast", "");
      localStorage.setItem("high-contrast", "true");
    } else {
      document.documentElement.removeAttribute("data-high-contrast");
      localStorage.setItem("high-contrast", "false");
    }
  };

  return (
    <button
      onClick={toggle}
      className="relative w-10 h-10 flex items-center justify-center rounded-lg border border-border hover:bg-surface-hover transition-colors"
      aria-label={enabled ? "Disable high contrast mode" : "Enable high contrast mode"}
      aria-pressed={enabled}
    >
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 3v18m-9-9h18M5.636 5.636l12.728 12.728M18.364 5.636L5.636 18.364"
        />
        <circle cx="12" cy="12" r="5" strokeWidth={1.5} />
      </svg>
    </button>
  );
}
