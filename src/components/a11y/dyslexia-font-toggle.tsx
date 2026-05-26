"use client";

import { useState, useEffect } from "react";

export function DyslexiaFontToggle() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("dyslexia-font") === "true";
    setEnabled(stored);
    if (stored) {
      document.documentElement.setAttribute("data-dyslexia-font", "");
    }
  }, []);

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    if (next) {
      document.documentElement.setAttribute("data-dyslexia-font", "");
      localStorage.setItem("dyslexia-font", "true");
    } else {
      document.documentElement.removeAttribute("data-dyslexia-font");
      localStorage.setItem("dyslexia-font", "false");
    }
  };

  return (
    <button
      onClick={toggle}
      className="relative w-10 h-10 flex items-center justify-center rounded-lg border border-border hover:bg-surface-hover transition-colors"
      aria-label={enabled ? "Disable dyslexia-friendly font" : "Enable dyslexia-friendly font"}
      aria-pressed={enabled}
    >
      <span className="text-sm font-bold" style={{ fontFamily: enabled ? "Comic Sans MS, cursive" : "inherit" }}>
        Aa
      </span>
    </button>
  );
}
