"use client";

import { useState, useEffect, useCallback } from "react";

interface Shortcut {
  keys: string[];
  description: string;
}

const defaultShortcuts: Shortcut[] = [
  { keys: ["?"], description: "Show keyboard shortcuts" },
  { keys: ["/"], description: "Open command palette" },
  { keys: ["Esc"], description: "Close dialog / menu" },
  { keys: ["T"], description: "Toggle theme" },
  { keys: ["B"], description: "Back to top" },
  { keys: ["G", "H"], description: "Go to home" },
  { keys: ["G", "A"], description: "Go to archive" },
  { keys: ["G", "P"], description: "Go to projects" },
];

export function KeyboardShortcutsHelp({
  shortcuts = defaultShortcuts,
}: {
  shortcuts?: Shortcut[];
}) {
  const [open, setOpen] = useState(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "?" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const target = e.target as HTMLElement;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
          return;
        }
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    },
    [open],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50"
      onClick={() => setOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard shortcuts"
    >
      <div
        className="bg-surface border border-border rounded-xl shadow-lg max-w-md w-full mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">Keyboard Shortcuts</h2>
          <button
            onClick={() => setOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-hover text-text-tertiary"
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <ul className="space-y-3">
          {shortcuts.map((s, i) => (
            <li key={i} className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">{s.description}</span>
              <span className="flex gap-1">
                {s.keys.map((k, j) => (
                  <kbd key={j}>{k}</kbd>
                ))}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
