"use client";

import { useState, useEffect, useMemo } from "react";
import { getReadingHistory } from "@/lib/reading-history";

export function ReadingStreak() {
  const [history, setHistory] = useState<{ id: string; title: string; timestamp: number }[]>([]);

  useEffect(() => {
    setHistory(getReadingHistory());
  }, []);

  const { currentStreak, longestStreak, activeDays } = useMemo(() => {
    if (history.length === 0)
      return { currentStreak: 0, longestStreak: 0, activeDays: new Set<string>() };

    // Group by date
    const dayMap = new Map<string, number>();
    for (const item of history) {
      const date = new Date(item.timestamp).toISOString().slice(0, 10);
      dayMap.set(date, (dayMap.get(date) || 0) + 1);
    }

    const sortedDays = Array.from(dayMap.keys()).sort().reverse();
    const activeDays = new Set(dayMap.keys());

    // Current streak: count consecutive days from today
    let currentStreak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      if (dayMap.has(key)) {
        currentStreak++;
      } else if (i > 0) {
        break;
      }
    }

    // Longest streak
    let longestStreak = 0;
    let streak = 0;
    const allDays = Array.from(dayMap.keys()).sort();
    for (let i = 0; i < allDays.length; i++) {
      if (i === 0) {
        streak = 1;
      } else {
        const prev = new Date(allDays[i - 1]);
        const curr = new Date(allDays[i]);
        const diff = (curr.getTime() - prev.getTime()) / (24 * 60 * 60 * 1000);
        streak = diff === 1 ? streak + 1 : 1;
      }
      longestStreak = Math.max(longestStreak, streak);
    }

    return { currentStreak, longestStreak, activeDays };
  }, [history]);

  // Last 30 days mini calendar
  const last30Days = useMemo(() => {
    const days: { date: string; active: boolean }[] = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      days.push({ date: key, active: activeDays.has(key) });
    }
    return days;
  }, [activeDays]);

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-sm font-medium text-text-primary">阅读连续打卡</h3>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-lg border border-border text-center">
          <p className="text-2xl font-semibold text-accent">{currentStreak}</p>
          <p className="text-xs text-text-tertiary">当前连续</p>
        </div>
        <div className="p-3 rounded-lg border border-border text-center">
          <p className="text-2xl font-semibold text-text-primary">{longestStreak}</p>
          <p className="text-xs text-text-tertiary">最长连续</p>
        </div>
      </div>

      {/* Mini calendar */}
      <div>
        <p className="text-xs text-text-secondary mb-2">近 30 天</p>
        <div className="flex flex-wrap gap-1">
          {last30Days.map((day) => (
            <div
              key={day.date}
              className={`w-4 h-4 rounded-sm transition-colors ${
                day.active
                  ? "bg-accent"
                  : "bg-muted"
              }`}
              title={`${day.date}${day.active ? " - 已阅读" : ""}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
