"use client";

import { useState, useRef, useEffect } from "react";

export interface FootnoteRef {
  id: number;
  content: string;
}

// Renders a footnote reference as a superscript tooltip link
export function FootnoteReference({
  id,
  content,
}: {
  id: number;
  content: string;
}) {
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!show) return;
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setShow(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [show]);

  return (
    <span ref={ref} className="relative inline-block">
      <button
        onClick={() => setShow((v) => !v)}
        className="text-accent hover:text-accent-hover text-xs font-medium align-super cursor-pointer leading-none"
        aria-label={`Footnote ${id}`}
      >
        [{id}]
      </button>
      {show && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-surface border border-border rounded-lg shadow-md text-sm text-text-secondary z-50">
          <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-border" />
          <span className="block text-xs text-text-tertiary mb-1">
            [{id}]
          </span>
          {content}
        </span>
      )}
    </span>
  );
}

// Renders a footnote list at the bottom of an article
export function FootnoteList({ items }: { items: FootnoteRef[] }) {
  if (items.length === 0) return null;

  return (
    <section className="mt-12 pt-6 border-t border-border">
      <h3 className="text-sm font-medium text-text-primary mb-4">Footnotes</h3>
      <ol className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            id={`fn-${item.id}`}
            className="text-sm text-text-secondary flex gap-2"
          >
            <span className="text-accent font-medium shrink-0">
              [{item.id}]
            </span>
            <span>{item.content}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
