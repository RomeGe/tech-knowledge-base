"use client";

import { useState, useMemo } from "react";

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export function CalendarWidget() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);
  const todayDate = today.getDate();
  const isCurrentMonth =
    year === today.getFullYear() && month === today.getMonth();

  // Check localStorage for days with reading activity
  const activeDays = useMemo(() => {
    if (typeof window === "undefined") return new Set<number>();
    try {
      const raw = localStorage.getItem("tech-kb-reading-history");
      if (!raw) return new Set<number>();
      const history = JSON.parse(raw) as { timestamp: number }[];
      const days = new Set<number>();
      for (const item of history) {
        const d = new Date(item.timestamp);
        if (d.getFullYear() === year && d.getMonth() === month) {
          days.add(d.getDate());
        }
      }
      return days;
    } catch {
      return new Set<number>();
    }
  }, [year, month]);

  const prevMonth = () => {
    if (month === 0) {
      setYear(year - 1);
      setMonth(11);
    } else {
      setMonth(month - 1);
    }
  };

  const nextMonth = () => {
    if (month === 11) {
      setYear(year + 1);
      setMonth(0);
    } else {
      setMonth(month + 1);
    }
  };

  const monthName = new Date(year, month).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
  });

  const weekdays = ["日", "一", "二", "三", "四", "五", "六"];

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <button
          onClick={prevMonth}
          className="p-1 rounded hover:bg-surface-hover text-text-secondary transition-colors"
          aria-label="上个月"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-sm font-medium text-text-primary">{monthName}</span>
        <button
          onClick={nextMonth}
          className="p-1 rounded hover:bg-surface-hover text-text-secondary transition-colors"
          aria-label="下个月"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {weekdays.map((d) => (
          <div key={d} className="text-xs text-text-tertiary py-1">
            {d}
          </div>
        ))}
        {Array.from({ length: firstDay }, (_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const isToday = isCurrentMonth && day === todayDate;
          const hasActivity = activeDays.has(day);
          return (
            <button
              key={day}
              className={`relative text-xs py-1 rounded transition-colors ${
                isToday
                  ? "bg-accent text-white font-semibold"
                  : "text-text-primary hover:bg-surface-hover"
              }`}
            >
              {day}
              {hasActivity && !isToday && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
