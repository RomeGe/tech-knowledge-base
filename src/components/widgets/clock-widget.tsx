"use client";

import { useState, useEffect } from "react";

export function ClockWidget() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  // Analog clock hand angles
  const hourAngle = (hours % 12) * 30 + minutes * 0.5;
  const minuteAngle = minutes * 6 + seconds * 0.1;
  const secondAngle = seconds * 6;

  const digital = now.toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const dateStr = now.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  // Clock face markers
  const markers = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30 * Math.PI) / 180;
    const x = 50 + 42 * Math.sin(angle);
    const y = 50 - 42 * Math.cos(angle);
    return { x, y, major: i % 3 === 0 };
  });

  return (
    <div className="flex flex-col items-center gap-3 p-4">
      <svg viewBox="0 0 100 100" className="w-32 h-32">
        {/* Clock face */}
        <circle
          cx="50"
          cy="50"
          r="46"
          fill="none"
          stroke="var(--border)"
          strokeWidth="2"
        />
        {markers.map((m, i) => (
          <circle
            key={i}
            cx={m.x}
            cy={m.y}
            r={m.major ? 2.5 : 1.2}
            fill="var(--text-secondary)"
          />
        ))}
        {/* Hour hand */}
        <line
          x1="50"
          y1="50"
          x2={50 + 22 * Math.sin((hourAngle * Math.PI) / 180)}
          y2={50 - 22 * Math.cos((hourAngle * Math.PI) / 180)}
          stroke="var(--text-primary)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Minute hand */}
        <line
          x1="50"
          y1="50"
          x2={50 + 32 * Math.sin((minuteAngle * Math.PI) / 180)}
          y2={50 - 32 * Math.cos((minuteAngle * Math.PI) / 180)}
          stroke="var(--text-primary)"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        {/* Second hand */}
        <line
          x1="50"
          y1="50"
          x2={50 + 36 * Math.sin((secondAngle * Math.PI) / 180)}
          y2={50 - 36 * Math.cos((secondAngle * Math.PI) / 180)}
          stroke="var(--accent)"
          strokeWidth="0.8"
          strokeLinecap="round"
        />
        {/* Center dot */}
        <circle cx="50" cy="50" r="2" fill="var(--accent)" />
      </svg>
      <p className="text-lg font-mono text-text-primary tracking-wider">
        {digital}
      </p>
      <p className="text-xs text-text-tertiary">{dateStr}</p>
    </div>
  );
}
