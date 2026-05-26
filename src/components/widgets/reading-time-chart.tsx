"use client";

import { useMemo } from "react";

interface Bucket {
  label: string;
  count: number;
}

const BUCKET_LABELS = ["<3分钟", "3-5分钟", "5-10分钟", "10-20分钟", "20+分钟"];

function generateMockData(): Bucket[] {
  return BUCKET_LABELS.map((label) => ({
    label,
    count: Math.floor(Math.random() * 30) + 5,
  }));
}

export function ReadingTimeChart() {
  const data = useMemo(() => generateMockData(), []);
  const maxCount = Math.max(...data.map((d) => d.count));

  const width = 360;
  const height = 160;
  const padding = { top: 20, right: 20, bottom: 40, left: 40 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;
  const barWidth = chartW / data.length - 8;

  // Y-axis ticks
  const yTicks = 4;
  const yTickValues = Array.from({ length: yTicks + 1 }, (_, i) =>
    Math.round((i / yTicks) * maxCount)
  );

  return (
    <div className="p-4 space-y-2">
      <h3 className="text-sm font-medium text-text-primary">阅读时间分布</h3>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        {/* Grid lines */}
        {yTickValues.map((val, i) => {
          const y = padding.top + chartH - (val / maxCount) * chartH;
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

        {/* Bars */}
        {data.map((d, i) => {
          const barH = (d.count / maxCount) * chartH;
          const x = padding.left + i * (chartW / data.length) + 4;
          const y = padding.top + chartH - barH;

          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barH}
                fill="var(--accent)"
                opacity="0.7"
                rx="2"
              />
              {/* Value label */}
              <text
                x={x + barWidth / 2}
                y={y - 4}
                textAnchor="middle"
                fontSize="8"
                fill="var(--text-tertiary)"
              >
                {d.count}
              </text>
              {/* X label */}
              <text
                x={x + barWidth / 2}
                y={height - 10}
                textAnchor="middle"
                fontSize="7"
                fill="var(--text-tertiary)"
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
