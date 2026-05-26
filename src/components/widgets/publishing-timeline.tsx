"use client";

import { useMemo } from "react";

interface TimelineEntry {
  date: string;
  title: string;
}

function generateMockTimeline(): TimelineEntry[] {
  const titles = [
    "Next.js 16 新特性概览",
    "Tailwind CSS v4 迁移指南",
    "TypeScript 高级类型技巧",
    "React Server Components 实战",
    "Docker 容器化最佳实践",
    "Web 性能优化策略",
    "GraphQL vs REST API 对比",
    "CSS Grid 布局详解",
  ];

  return titles.map((title, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i * 5 - Math.floor(Math.random() * 3));
    return {
      date: d.toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      title,
    };
  });
}

export function PublishingTimeline() {
  const entries = useMemo(() => generateMockTimeline(), []);

  return (
    <div className="p-4 space-y-3">
      <h3 className="text-sm font-medium text-text-primary">发布时间线</h3>
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />

        <div className="space-y-4">
          {entries.map((entry, i) => (
            <div key={i} className="flex gap-3 relative">
              {/* Dot */}
              <div className="relative z-10 mt-1.5">
                <div
                  className={`w-[15px] h-[15px] rounded-full border-2 ${
                    i === 0
                      ? "border-accent bg-accent"
                      : "border-border bg-surface"
                  }`}
                />
              </div>
              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-text-tertiary">{entry.date}</p>
                <p className="text-sm text-text-primary mt-0.5 truncate">
                  {entry.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
