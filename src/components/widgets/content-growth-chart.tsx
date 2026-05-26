"use client";

import { useMemo } from "react";

interface MonthData {
  label: string;
  count: number;
}

function generateMockData(): MonthData[] {
  const months = [
    "1月", "2月", "3月", "4月", "5月", "6月",
    "7月", "8月", "9月", "10月", "11月", "12月",
  ];
  let cumulative = 0;
  return months.map((label) => {
    cumulative += Math.floor(Math.random() * 8) + 2;
    return { label, count: cumulative };
  });
}

export function ContentGrowthChart() {
  const data = useMemo(() => generateMockData(), []);

  const width = 400;
  const height = 160;
  const padding = { top: 20, right: 20, bottom: 30, left: 40 };

  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const maxVal = Math.max(...data.map((d) => d.count));

  const points = data.map((d, i) => {
    const x = padding.left + (i / (data.length - 1)) * chartW;
    const y = padding.top + chartH - (d.count / maxVal) * chartH;
    return { x, y, ...d };
  });

  // Smooth curve using cardinal spline approximation
  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + chartH} L ${points[0].x} ${padding.top + chartH} Z`;

  // Y-axis ticks
  const yTicks = 4;
  const yTickValues = Array.from({ length: yTicks + 1 }, (_, i) =>
    Math.round((i / yTicks) * maxVal)
  );

  return (
    <div className="p-4 space-y-2">
      <h3 className="text-sm font-medium text-text-primary">内容增长</h3>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        {/* Grid lines */}
        {yTickValues.map((val, i) => {
          const y = padding.top + chartH - (val / maxVal) * chartH;
          return (
            <g key={i}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="var(--border-subtle)"
                strokeWidth="0.5"
              />
              <text
                x={padding.left - 4}
                y={y + 3}
                textAnchor="end"
                fontSize="8"
                fill="var(--text-tertiary)"
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* Area */}
        <path d={areaPath} fill="var(--accent)" opacity="0.15" />

        {/* Line */}
        <path d={linePath} fill="none" stroke="var(--accent)" strokeWidth="1.5" />

        {/* Points */}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="2.5"
            fill="var(--surface)"
            stroke="var(--accent)"
            strokeWidth="1.5"
          />
        ))}

        {/* X-axis labels */}
        {points.map((p, i) => (
          <text
            key={i}
            x={p.x}
            y={height - 6}
            textAnchor="middle"
            fontSize="8"
            fill="var(--text-tertiary)"
          >
            {p.label}
          </text>
        ))}
      </svg>
    </div>
  );
}
