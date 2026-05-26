"use client";

import { useMemo } from "react";
import { getReadingHistory } from "@/lib/reading-history";

interface ArticleRank {
  title: string;
  count: number;
}

export function PopularArticles() {
  const rankings = useMemo((): ArticleRank[] => {
    const history = getReadingHistory();
    const counter = new Map<string, { title: string; count: number }>();

    for (const item of history) {
      const existing = counter.get(item.id);
      if (existing) {
        existing.count++;
      } else {
        counter.set(item.id, { title: item.title, count: 1 });
      }
    }

    return Array.from(counter.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, []);

  if (rankings.length === 0) {
    return (
      <div className="p-4">
        <h3 className="text-sm font-medium text-text-primary mb-4">热门文章</h3>
        <p className="text-xs text-text-tertiary text-center py-8">暂无阅读记录</p>
      </div>
    );
  }

  const maxCount = rankings[0]?.count || 1;

  return (
    <div className="p-4 space-y-3">
      <h3 className="text-sm font-medium text-text-primary">热门文章</h3>
      <div className="space-y-2">
        {rankings.map((article, i) => (
          <div key={i} className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-primary truncate flex-1 mr-2">
                {article.title}
              </span>
              <span className="text-xs text-text-tertiary shrink-0">
                {article.count} 次
              </span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-accent/60 rounded-full transition-all"
                style={{ width: `${(article.count / maxCount) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
