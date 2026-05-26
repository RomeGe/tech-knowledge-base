"use client";

import { useMemo, useState } from "react";

interface CategoryData {
  name: string;
  count: number;
  color: string;
}

const COLORS = [
  "var(--accent)",
  "color-mix(in srgb, var(--accent) 70%, white)",
  "color-mix(in srgb, var(--accent) 50%, white)",
  "color-mix(in srgb, var(--accent) 30%, white)",
  "color-mix(in srgb, var(--accent) 80%, black)",
  "color-mix(in srgb, var(--accent) 60%, black)",
];

function generateMockData(): CategoryData[] {
  return [
    { name: "前端开发", count: 35, color: COLORS[0] },
    { name: "后端技术", count: 25, color: COLORS[1] },
    { name: "DevOps", count: 15, color: COLORS[2] },
    { name: "数据库", count: 12, color: COLORS[3] },
    { name: "算法", count: 8, color: COLORS[4] },
    { name: "其他", count: 5, color: COLORS[5] },
  ];
}

function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
): string {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return [
    "M", start.x, start.y,
    "A", r, r, 0, largeArcFlag, 0, end.x, end.y,
    "L", cx, cy,
    "Z",
  ].join(" ");
}

export function CategoryPieChart() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const data = useMemo(() => generateMockData(), []);
  const total = useMemo(() => data.reduce((s, d) => s + d.count, 0), [data]);

  const cx = 100;
  const cy = 100;
  const r = 80;

  const slices = useMemo(() => {
    let currentAngle = 0;
    return data.map((d, i) => {
      const angle = (d.count / total) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      currentAngle = endAngle;
      return { ...d, startAngle, endAngle, percentage: ((d.count / total) * 100).toFixed(1) };
    });
  }, [data, total]);

  return (
    <div className="p-4 space-y-3">
      <h3 className="text-sm font-medium text-text-primary">分类分布</h3>

      <div className="flex items-center gap-4">
        {/* Pie */}
        <svg viewBox="0 0 200 200" className="w-32 h-32 shrink-0">
          {slices.map((slice, i) => (
            <path
              key={i}
              d={describeArc(cx, cy, r, slice.startAngle, slice.endAngle)}
              fill={slice.color}
              stroke="var(--surface)"
              strokeWidth="2"
              opacity={hoveredIndex === null || hoveredIndex === i ? 1 : 0.5}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="transition-opacity cursor-pointer"
            />
          ))}
          {/* Center hole for donut effect */}
          <circle cx={cx} cy={cy} r="40" fill="var(--surface)" />
          <text
            x={cx}
            y={cy - 6}
            textAnchor="middle"
            fontSize="14"
            fontWeight="600"
            fill="var(--text-primary)"
          >
            {total}
          </text>
          <text
            x={cx}
            y={cy + 10}
            textAnchor="middle"
            fontSize="8"
            fill="var(--text-tertiary)"
          >
            总计
          </text>
        </svg>

        {/* Legend */}
        <div className="space-y-1.5 flex-1">
          {slices.map((slice, i) => (
            <div
              key={i}
              className="flex items-center gap-2 cursor-pointer"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: slice.color }}
              />
              <span className="text-xs text-text-secondary truncate flex-1">
                {slice.name}
              </span>
              <span className="text-xs text-text-tertiary">
                {slice.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
