"use client";

import { useMemo } from "react";

interface TagCloudProps {
  articles: { tags: string }[];
  onTagClick?: (tag: string) => void;
  activeTag?: string | null;
}

export function TagCloud({ articles, onTagClick, activeTag }: TagCloudProps) {
  const tags = useMemo(() => {
    const map = new Map<string, number>();
    for (const article of articles) {
      try {
        const parsed = JSON.parse(article.tags) as string[];
        for (const tag of parsed) {
          map.set(tag, (map.get(tag) || 0) + 1);
        }
      } catch {}
    }
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [articles]);

  if (tags.length === 0) return null;

  const maxCount = Math.max(...tags.map(([, c]) => c));

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map(([tag, count]) => {
        const size =
          count === maxCount
            ? "text-sm"
            : count >= maxCount / 2
            ? "text-xs"
            : "text-[11px]";
        const isActive = activeTag === tag;
        return (
          <button
            key={tag}
            onClick={() => onTagClick?.(tag)}
            className={`${size} px-2.5 py-1 rounded-full border transition-colors ${
              isActive
                ? "border-accent bg-accent-subtle text-accent"
                : "border-border text-text-tertiary hover:text-text-secondary hover:border-border"
            }`}
          >
            {tag}
            <span className="ml-1 opacity-50">{count}</span>
          </button>
        );
      })}
    </div>
  );
}
