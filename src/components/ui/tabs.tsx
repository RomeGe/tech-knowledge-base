"use client";

import { useState, useCallback, useRef } from "react";

interface Tab {
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultIndex?: number;
  onChange?: (index: number) => void;
}

export function Tabs({ tabs, defaultIndex = 0, onChange }: TabsProps) {
  const [active, setActive] = useState(defaultIndex);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = useCallback(
    (index: number) => {
      setActive(index);
      onChange?.(index);
      tabRefs.current[index]?.focus();
    },
    [onChange]
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      let next = active;
      if (e.key === "ArrowRight") {
        next = (active + 1) % tabs.length;
      } else if (e.key === "ArrowLeft") {
        next = (active - 1 + tabs.length) % tabs.length;
      } else if (e.key === "Home") {
        next = 0;
      } else if (e.key === "End") {
        next = tabs.length - 1;
      } else {
        return;
      }
      e.preventDefault();
      select(next);
    },
    [active, tabs.length, select]
  );

  return (
    <div>
      <div
        role="tablist"
        className="flex border-b border-border gap-1"
        onKeyDown={onKeyDown}
      >
        {tabs.map((tab, i) => (
          <button
            key={i}
            ref={(el) => { tabRefs.current[i] = el; }}
            role="tab"
            aria-selected={i === active}
            tabIndex={i === active ? 0 : -1}
            onClick={() => select(i)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              i === active
                ? "border-accent text-accent"
                : "border-transparent text-text-tertiary hover:text-text-secondary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="py-4">
        {tabs[active]?.content}
      </div>
    </div>
  );
}
