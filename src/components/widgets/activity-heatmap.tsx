"use client";

import { useMemo } from "react";

const DAYS = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

function generateMockActivity(): number[][] {
  // 7 days x 24 hours
  return Array.from({ length: 7 }, () =>
    Array.from({ length: 24 }, () => Math.floor(Math.random() * 10))
  );
}

function getColor(value: number, max: number): string {
  if (value === 0) return "var(--muted)";
  const ratio = value / max;
  if (ratio < 0.25) return "color-mix(in srgb, var(--accent) 25%, var(--muted))";
  if (ratio < 0.5) return "color-mix(in srgb, var(--accent) 50%, var(--muted))";
  if (ratio < 0.75) return "color-mix(in srgb, var(--accent) 75%, var(--muted))";
  return "var(--accent)";
}

export function ActivityHeatmap() {
  const data = useMemo(() => generateMockActivity(), []);
  const maxVal = useMemo(
    () => Math.max(...data.flat(), 1),
    [data]
  );

  // Hour labels: show every 3 hours
  const hourLabels = HOURS.filter((h) => h % 3 === 0);

  return (
    <div className="p-4 space-y-3">
      <h3 className="text-sm font-medium text-text-primary">活动热力图</h3>

      <div className="overflow-x-auto">
        <div className="inline-block">
          {/* Hour labels */}
          <div className="flex ml-10 mb-1">
            {HOURS.map((h) => (
              <div
                key={h}
                className="text-[8px] text-text-tertiary text-center"
                style={{ width: 14 }}
              >
                {hourLabels.includes(h) ? `${h}时` : ""}
              </div>
            ))}
          </div>

          {/* Grid rows */}
          {DAYS.map((day, di) => (
            <div key={day} className="flex items-center gap-0">
              <span className="text-[10px] text-text-tertiary w-10 text-right pr-1 shrink-0">
                {day}
              </span>
              <div className="flex">
                {data[di].map((val, hi) => (
                  <div
                    key={hi}
                    className="rounded-sm transition-colors"
                    style={{
                      width: 14,
                      height: 14,
                      backgroundColor: getColor(val, maxVal),
                    }}
                    title={`${day} ${hi}:00 - ${val} 次活动`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
