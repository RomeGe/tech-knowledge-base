"use client";

import { useState, useEffect } from "react";
import { getReadingHistory } from "@/lib/reading-history";
import { getBookmarks } from "@/lib/bookmarks";

interface Stats {
  totalRead: number;
  totalBookmarked: number;
  readToday: number;
  readThisWeek: number;
}

const statCards = [
  {
    key: "totalRead" as const,
    label: "已读文章",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
    color: "text-sky-500",
    bg: "bg-sky-500/10",
  },
  {
    key: "totalBookmarked" as const,
    label: "收藏文章",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
      </svg>
    ),
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    key: "readToday" as const,
    label: "今日阅读",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    key: "readThisWeek" as const,
    label: "本周阅读",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    ),
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
];

export function ReadingStats() {
  const [stats, setStats] = useState<Stats>({
    totalRead: 0,
    totalBookmarked: 0,
    readToday: 0,
    readThisWeek: 0,
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
    });
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {statCards.map((card) => (
        <div
          key={card.key}
          className="card-elevated p-4 flex items-start gap-3"
        >
          <div className={`p-2 rounded-lg ${card.bg} ${card.color}`}>
            {card.icon}
          </div>
          <div>
            <p className="text-2xl font-bold font-mono text-text-primary">
              {stats[card.key]}
            </p>
            <p className="text-xs text-text-tertiary mt-0.5 font-mono uppercase tracking-wider">
              {card.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
