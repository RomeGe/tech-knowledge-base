"use client";

import { useMemo } from "react";

const STORAGE_KEY = "tech-kb-search-history";

interface SearchEntry {
  term: string;
  timestamp: number;
}

function getSearchHistory(): SearchEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

interface RankedTerm {
  term: string;
  count: number;
}

export function SearchAnalytics() {
  const rankings = useMemo((): RankedTerm[] => {
    const history = getSearchHistory();
    const counter = new Map<string, number>();

    for (const entry of history) {
      counter.set(entry.term, (counter.get(entry.term) || 0) + 1);
    }

    return Array.from(counter.entries())
      .map(([term, count]) => ({ term, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, []);

  if (rankings.length === 0) {
    return (
      <div className="p-4">
        <h3 className="text-sm font-medium text-text-primary mb-4">搜索分析</h3>
        <p className="text-xs text-text-tertiary text-center py-8">暂无搜索记录</p>
      </div>
    );
  }

  const maxCount = rankings[0]?.count || 1;

  return (
    <div className="p-4 space-y-3">
      <h3 className="text-sm font-medium text-text-primary">搜索分析</h3>
      <div className="space-y-2">
        {rankings.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-xs text-text-secondary w-20 truncate shrink-0">
              {item.term}
            </span>
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-accent/60 rounded-full transition-all"
                style={{ width: `${(item.count / maxCount) * 100}%` }}
              />
            </div>
            <span className="text-xs text-text-tertiary w-6 text-right shrink-0">
              {item.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Export helper to track searches
export function trackSearch(term: string) {
  if (typeof window === "undefined" || !term.trim()) return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const history: SearchEntry[] = raw ? JSON.parse(raw) : [];
    history.push({ term: term.trim(), timestamp: Date.now() });
    // Keep last 200 entries
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(-200)));
  } catch {
    // ignore
  }
}
