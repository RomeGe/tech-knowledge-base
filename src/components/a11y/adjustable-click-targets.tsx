"use client";

import { useState, useEffect } from "react";

export function AdjustableClickTargets() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("large-targets") === "true";
    setEnabled(stored);
    if (stored) {
      document.documentElement.setAttribute("data-large-targets", "");
    }
  }, []);

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    if (next) {
      document.documentElement.setAttribute("data-large-targets", "");
      localStorage.setItem("large-targets", "true");
    } else {
      document.documentElement.removeAttribute("data-large-targets");
      localStorage.setItem("large-targets", "false");
    }
  };

  return (
    <button
      onClick={toggle}
      className="relative w-10 h-10 flex items-center justify-center rounded-lg border border-border hover:bg-surface-hover transition-colors"
      aria-label={enabled ? "Disable large click targets" : "Enable large click targets"}
      aria-pressed={enabled}
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59"
        />
      </svg>
    </button>
  );
}
