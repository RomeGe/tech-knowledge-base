"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface DropdownItem {
  label: string;
  value: string;
  disabled?: boolean;
  separator?: boolean;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  onSelect: (value: string) => void;
}

export function Dropdown({ trigger, items, onSelect }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const enabledItems = items.filter((i) => !i.disabled && !i.separator);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open, close]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelected((prev) => {
          let next = prev + 1;
          while (next < items.length && (items[next].disabled || items[next].separator)) next++;
          return next < items.length ? next : prev;
        });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelected((prev) => {
          let next = prev - 1;
          while (next >= 0 && (items[next].disabled || items[next].separator)) next--;
          return next >= 0 ? next : prev;
        });
      } else if (e.key === "Enter") {
        e.preventDefault();
        const item = items[selected];
        if (item && !item.disabled && !item.separator) {
          onSelect(item.value);
          close();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, items, selected, close, onSelect]);

  return (
    <div ref={ref} className="relative inline-block">
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <div className="absolute left-0 top-full mt-1 min-w-[160px] py-1 bg-surface border border-border rounded-lg shadow-lg z-50">
          {items.map((item, i) => {
            if (item.separator) {
              return <div key={i} className="my-1 border-t border-border" />;
            }
            return (
              <button
                key={i}
                disabled={item.disabled}
                onClick={() => {
                  onSelect(item.value);
                  close();
                }}
                onMouseEnter={() => setSelected(i)}
                className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                  item.disabled
                    ? "text-text-tertiary cursor-not-allowed"
                    : i === selected
                    ? "bg-accent-subtle text-accent"
                    : "text-text-secondary hover:bg-surface-hover"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
