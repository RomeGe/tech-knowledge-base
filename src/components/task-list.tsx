"use client";

import { useState } from "react";

interface TaskItem {
  text: string;
  checked: boolean;
}

// Parse markdown-style task list items from text
export function parseTaskItems(text: string): TaskItem[] {
  return text
    .split("\n")
    .map((line) => {
      const match = line.match(/^[-*]\s*\[([ xX])\]\s*(.*)/);
      if (match) {
        return {
          checked: match[1] !== " ",
          text: match[2].trim(),
        };
      }
      return null;
    })
    .filter(Boolean) as TaskItem[];
}

export function TaskList({
  items: initialItems,
}: {
  items: TaskItem[];
}) {
  const [items, setItems] = useState(initialItems);

  const toggle = (index: number) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, checked: !item.checked } : item
      )
    );
  };

  return (
    <ul className="space-y-1.5 list-none pl-0">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2">
          <button
            onClick={() => toggle(i)}
            className={`mt-0.5 shrink-0 w-4.5 h-4.5 rounded border flex items-center justify-center transition-colors cursor-pointer ${
              item.checked
                ? "bg-accent border-accent text-white"
                : "border-border bg-surface hover:border-text-tertiary"
            }`}
            aria-checked={item.checked}
            role="checkbox"
          >
            {item.checked && (
              <svg
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
            )}
          </button>
          <span
            className={`text-sm ${
              item.checked
                ? "text-text-tertiary line-through"
                : "text-text-primary"
            }`}
          >
            {item.text}
          </span>
        </li>
      ))}
    </ul>
  );
}
