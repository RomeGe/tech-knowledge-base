"use client";

import { useState, useEffect } from "react";

type ColorBlindMode = "none" | "protanopia" | "deuteranopia" | "tritanopia";

const modes: { value: ColorBlindMode; label: string }[] = [
  { value: "none", label: "Normal vision" },
  { value: "protanopia", label: "Protanopia (red-blind)" },
  { value: "deuteranopia", label: "Deuteranopia (green-blind)" },
  { value: "tritanopia", label: "Tritanopia (blue-blind)" },
];

export function ColorBlindModes() {
  const [mode, setMode] = useState<ColorBlindMode>("none");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("color-blind-mode") as ColorBlindMode | null;
    if (stored && modes.some((m) => m.value === stored)) {
      setMode(stored);
      applyMode(stored);
    }
  }, []);

  const applyMode = (m: ColorBlindMode) => {
    if (m === "none") {
      document.documentElement.removeAttribute("data-color-blind");
    } else {
      document.documentElement.setAttribute("data-color-blind", m);
    }
  };

  const select = (m: ColorBlindMode) => {
    setMode(m);
    applyMode(m);
    localStorage.setItem("color-blind-mode", m);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative w-10 h-10 flex items-center justify-center rounded-lg border border-border hover:bg-surface-hover transition-colors"
        aria-label="Color blind mode selector"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
      {open && (
        <ul
          className="absolute right-0 top-12 z-50 bg-surface border border-border rounded-lg shadow-lg py-1 min-w-[200px]"
          role="listbox"
          aria-label="Color blind modes"
        >
          {modes.map((m) => (
            <li key={m.value} role="option" aria-selected={mode === m.value}>
              <button
                onClick={() => select(m.value)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-surface-hover ${
                  mode === m.value ? "text-accent font-medium" : "text-text-secondary"
                }`}
              >
                {m.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
