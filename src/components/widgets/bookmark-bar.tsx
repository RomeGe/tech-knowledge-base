"use client";

import { useState, useEffect } from "react";
import { getBookmarks } from "@/lib/bookmarks";
import { getReadingHistory } from "@/lib/reading-history";

interface BookmarkItem {
  id: string;
  title: string;
}

export function BookmarkBar() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);

  useEffect(() => {
    const ids = getBookmarks();
    const history = getReadingHistory();
    const titleMap = new Map(history.map((h) => [h.id, h.title]));

    const items: BookmarkItem[] = ids.map((id) => ({
      id,
      title: titleMap.get(id) || id,
    }));
    setBookmarks(items);
  }, []);

  if (bookmarks.length === 0) {
    return (
      <div className="p-4">
        <h3 className="text-sm font-medium text-text-primary mb-2">书签栏</h3>
        <p className="text-xs text-text-tertiary text-center py-4">
          暂无收藏文章
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-2">
      <h3 className="text-sm font-medium text-text-primary">书签栏</h3>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {bookmarks.map((item) => (
          <a
            key={item.id}
            href={`/articles/${item.id}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border hover:bg-surface-hover text-text-secondary hover:text-text-primary transition-colors shrink-0"
          >
            <svg
              className="w-3.5 h-3.5 text-accent"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
            </svg>
            <span className="text-xs whitespace-nowrap">{item.title}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
