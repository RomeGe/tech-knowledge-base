"use client";

import { useState, useEffect } from "react";
import { getReadingHistory } from "@/lib/reading-history";
import { getBookmarks } from "@/lib/bookmarks";

interface Stats {
  totalRead: number;
  totalBookmarked: number;
  readToday: number;
  readThisWeek: number;
  topCategories: { name: string; count: number }[];
}

export function ReadingStats() {
  const [stats, setStats] = useState<Stats>({
    totalRead: 0,
    totalBookmarked: 0,
    readToday: 0,
    readThisWeek: 0,
    topCategories: [],
  });

  useEffect(() => {
    const history = getReadingHistory();
    const bookmarks = getBookmarks();
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    const weekMs = 7 * dayMs;

    setStats({
      totalRead: history.length,
      totalBookmarked: bookmarks.length,
      readToday: history.filter((h) => now - h.timestamp < dayMs).length,
      readThisWeek: history.filter((h) => now - h.timestamp < weekMs).length,
      topCategories: [],
    });
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="p-4 border border-border rounded-lg">
        <p className="text-2xl font-semibold text-text-primary">{stats.totalRead}</p>
        <p className="text-xs text-text-tertiary mt-1">已读文章</p>
      </div>
      <div className="p-4 border border-border rounded-lg">
        <p className="text-2xl font-semibold text-text-primary">{stats.totalBookmarked}</p>
        <p className="text-xs text-text-tertiary mt-1">收藏文章</p>
      </div>
      <div className="p-4 border border-border rounded-lg">
        <p className="text-2xl font-semibold text-text-primary">{stats.readToday}</p>
        <p className="text-xs text-text-tertiary mt-1">今日阅读</p>
      </div>
      <div className="p-4 border border-border rounded-lg">
        <p className="text-2xl font-semibold text-text-primary">{stats.readThisWeek}</p>
        <p className="text-xs text-text-tertiary mt-1">本周阅读</p>
      </div>
    </div>
  );
}
