"use client";

import { useState, useMemo } from "react";

function generateMockData(): Map<string, number> {
  const data = new Map<string, number>();
  const now = new Date();
  for (let w = 0; w < 52; w++) {
    for (let d = 0; d < 7; d++) {
      const date = new Date(now);
      date.setDate(date.getDate() - (51 - w) * 7 - (6 - d));
      const key = date.toISOString().slice(0, 10);
      // Random activity with some gaps
      const val = Math.random() < 0.3 ? 0 : Math.floor(Math.random() * 10);
      data.set(key, val);
    }
  }
  return data;
}

function getIntensityColor(count: number): string {
  if (count === 0) return "var(--muted)";
  if (count <= 2) return "color-mix(in srgb, var(--accent) 25%, var(--muted))";
  if (count <= 5) return "color-mix(in srgb, var(--accent) 50%, var(--muted))";
  if (count <= 7) return "color-mix(in srgb, var(--accent) 75%, var(--muted))";
  return "var(--accent)";
}

export function GitHubContributions() {
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    text: string;
  } | null>(null);

  const data = useMemo(() => generateMockData(), []);

  const weeks = useMemo(() => {
    const result: { date: string; count: number }[][] = [];
    const now = new Date();
    let currentWeek: { date: string; count: number }[] = [];

    for (let w = 0; w < 52; w++) {
      const week: { date: string; count: number }[] = [];
      for (let d = 0; d < 7; d++) {
        const date = new Date(now);
        date.setDate(date.getDate() - (51 - w) * 7 - (6 - d));
        const key = date.toISOString().slice(0, 10);
        week.push({ date: key, count: data.get(key) || 0 });
      }
      result.push(week);
    }
    return result;
  }, [data]);

  const months = useMemo(() => {
    const now = new Date();
    const labels: { label: string; index: number }[] = [];
    let lastMonth = -1;
    for (let w = 0; w < 52; w++) {
      const date = new Date(now);
      date.setDate(date.getDate() - (51 - w) * 7);
      const m = date.getMonth();
      if (m !== lastMonth) {
        labels.push({
          label: date.toLocaleDateString("zh-CN", { month: "short" }),
          index: w,
        });
        lastMonth = m;
      }
    }
    return labels;
  }, []);

  const cellSize = 11;
  const gap = 2;

  return (
    <div className="p-4 space-y-2">
      <h3 className="text-sm font-medium text-text-primary">贡献热力图</h3>
      <div className="overflow-x-auto">
        <div className="relative">
          {/* Month labels */}
          <div className="flex mb-1" style={{ paddingLeft: 28 }}>
            {months.map((m, i) => (
              <span
                key={i}
                className="text-[9px] text-text-tertiary absolute"
                style={{ left: 28 + m.index * (cellSize + gap) }}
              >
                {m.label}
              </span>
            ))}
          </div>

          <div className="flex gap-0">
            {/* Day labels */}
            <div className="flex flex-col mr-1" style={{ gap, paddingTop: 16 }}>
              {["", "一", "", "三", "", "五", ""].map((d, i) => (
                <span
                  key={i}
                  className="text-[9px] text-text-tertiary flex items-center"
                  style={{ height: cellSize, lineHeight: `${cellSize}px` }}
                >
                  {d}
                </span>
              ))}
            </div>

            {/* Grid */}
            <div className="flex" style={{ gap, paddingTop: 16 }}>
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col" style={{ gap }}>
                  {week.map((day, di) => (
                    <div
                      key={di}
                      className="rounded-sm cursor-pointer transition-colors"
                      style={{
                        width: cellSize,
                        height: cellSize,
                        backgroundColor: getIntensityColor(day.count),
                      }}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setTooltip({
                          x: rect.left + rect.width / 2,
                          y: rect.top - 8,
                          text: `${day.date}: ${day.count} 次贡献`,
                        });
                      }}
                      onMouseLeave={() => setTooltip(null)}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Tooltip */}
          {tooltip && (
            <div
              className="fixed z-50 px-2 py-1 text-xs text-white bg-gray-800 rounded shadow-lg whitespace-nowrap pointer-events-none"
              style={{ left: tooltip.x, top: tooltip.y, transform: "translate(-50%, -100%)" }}
            >
              {tooltip.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
