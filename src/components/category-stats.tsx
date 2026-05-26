"use client";

import { useMemo } from "react";

interface CategoryStatsProps {
  articles: { category: string }[];
}

export function CategoryStats({ articles }: CategoryStatsProps) {
  const categories = useMemo(() => {
    const map = new Map<string, number>();
    for (const article of articles) {
      const cat = article.category || "未分类";
      map.set(cat, (map.get(cat) || 0) + 1);
    }
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [articles]);

  if (categories.length === 0) return null;

  const maxCount = Math.max(...categories.map(([, c]) => c));

  return (
    <div className="space-y-3">
      {categories.map(([category, count]) => (
        <div key={category} className="flex items-center gap-3">
          <span className="text-xs text-text-secondary w-24 truncate">
            {category}
          </span>
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-accent/60 rounded-full transition-all"
              style={{ width: `${(count / maxCount) * 100}%` }}
            />
          </div>
          <span className="text-xs text-text-tertiary w-6 text-right">
            {count}
          </span>
        </div>
      ))}
    </div>
  );
}
