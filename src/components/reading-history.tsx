"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getReadingHistory, clearReadingHistory, ReadingHistoryItem } from "@/lib/reading-history";

export function ReadingHistory() {
  const [history, setHistory] = useState<ReadingHistoryItem[]>([]);

  useEffect(() => {
    setHistory(getReadingHistory());
  }, []);

  if (history.length === 0) return null;

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-text-primary">
          最近阅读
        </h2>
        <button
          onClick={() => {
            clearReadingHistory();
            setHistory([]);
          }}
          className="text-xs text-text-tertiary hover:text-text-primary transition-colors"
        >
          清除记录
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {history.slice(0, 8).map((item) => (
          <Link
            key={item.id}
            href={`/?expand=${item.id}`}
            className="px-3 py-1.5 text-xs text-text-secondary border border-border rounded-md hover:border-accent/30 hover:text-accent transition-colors"
          >
            {item.title}
          </Link>
        ))}
      </div>
    </section>
  );
}
