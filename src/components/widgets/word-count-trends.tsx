"use client";

import { useMemo } from "react";

interface DataPoint {
  label: string;
  value: number;
}

function generateMockData(): DataPoint[] {
  const months = [
    "1月", "2月", "3月", "4月", "5月", "6月",
    "7月", "8月", "9月", "10月", "11月", "12月",
  ];
  return months.map((label) => ({
    label,
    value: Math.floor(Math.random() * 5000) + 1000,
  }));
}

export function WordCountTrends() {
  const data = useMemo(() => generateMockData(), []);

  const width = 400;
  const height = 160;
  const padding = { top: 20, right: 20, bottom: 30, left: 40 };

  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const maxVal = Math.max(...data.map((d) => d.value));
  const minVal = 0;

  const points = data.map((d, i) => {
    const x = padding.left + (i / (data.length - 1)) * chartW;
    const y = padding.top + chartH - ((d.value - minVal) / (maxVal - minVal)) * chartH;
    return { x, y, ...d };
  });

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  // Area fill
  const areaD = `${pathD} L ${points[points.length - 1].x} ${padding.top + chartH} L ${points[0].x} ${padding.top + chartH} Z`;

  // Y-axis ticks
  const yTicks = 4;
  const yTickValues = Array.from({ length: yTicks + 1 }, (_, i) =>
    Math.round(minVal + (i / yTicks) * (maxVal - minVal))
  );

  return (
    <div className="p-4 space-y-2">
      <h3 className="text-sm font-medium text-text-primary">字数趋势</h3>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        {/* Grid lines */}
        {yTickValues.map((val, i) => {
          const y = padding.top + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;
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
                {val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        <path d={areaD} fill="var(--accent)" opacity="0.1" />

        {/* Line */}
        <path d={pathD} fill="none" stroke="var(--accent)" strokeWidth="1.5" />

        {/* Data points */}
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
