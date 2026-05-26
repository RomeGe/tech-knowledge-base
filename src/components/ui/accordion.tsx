"use client";

import { useState, useCallback } from "react";

interface AccordionItem {
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  multiple?: boolean;
  defaultOpen?: number[];
}

export function Accordion({
  items,
  multiple = false,
  defaultOpen = [],
}: AccordionProps) {
  const [openIndexes, setOpenIndexes] = useState<Set<number>>(
    () => new Set(defaultOpen)
  );

  const toggle = useCallback(
    (index: number) => {
      setOpenIndexes((prev) => {
        const next = new Set(multiple ? prev : []);
        if (prev.has(index)) {
          next.delete(index);
        } else {
          next.add(index);
        }
        return next;
      });
    },
    [multiple]
  );

  return (
    <div className="divide-y divide-border border border-border rounded-lg overflow-hidden">
      {items.map((item, i) => {
        const isOpen = openIndexes.has(i);
        return (
          <div key={i}>
            <button
              onClick={() => toggle(i)}
              className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-medium text-text-primary hover:bg-surface-hover transition-colors"
              aria-expanded={isOpen}
            >
              <span>{item.title}</span>
              <svg
                className={`w-4 h-4 text-text-tertiary transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            <div
              className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${
                isOpen ? "max-h-[500px]" : "max-h-0"
              }`}
            >
              <div className="px-4 pb-4 text-sm text-text-secondary">
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
