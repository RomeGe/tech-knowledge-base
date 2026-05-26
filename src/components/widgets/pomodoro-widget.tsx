"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const WORK_DURATION = 25 * 60;
const BREAK_DURATION = 5 * 60;

type Mode = "work" | "break";
type Status = "idle" | "running" | "paused";

export function PomodoroWidget() {
  const [mode, setMode] = useState<Mode>("work");
  const [status, setStatus] = useState<Status>("idle");
  const [secondsLeft, setSecondsLeft] = useState(WORK_DURATION);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSeconds = mode === "work" ? WORK_DURATION : BREAK_DURATION;
  const progress = 1 - secondsLeft / totalSeconds;

  // Play beep sound
  const playBeep = useCallback(() => {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 800;
      gain.gain.value = 0.3;
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
      setTimeout(() => ctx.close(), 500);
    } catch {
      // Audio not available
    }
  }, []);

  useEffect(() => {
    if (status === "running") {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setStatus("idle");
            playBeep();
            // Switch mode
            const nextMode = mode === "work" ? "break" : "work";
            setMode(nextMode);
            return nextMode === "work" ? WORK_DURATION : BREAK_DURATION;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [status, mode, playBeep]);

  const handleStart = () => setStatus("running");
  const handlePause = () => setStatus("paused");
  const handleReset = () => {
    setStatus("idle");
    if (intervalRef.current) clearInterval(intervalRef.current);
    setSecondsLeft(mode === "work" ? WORK_DURATION : BREAK_DURATION);
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeStr = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  // Circular progress
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <span className="text-xs font-medium text-text-secondary">
        {mode === "work" ? "专注时间" : "休息时间"}
      </span>

      {/* Circular progress */}
      <div className="relative">
        <svg viewBox="0 0 100 100" className="w-24 h-24 -rotate-90">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="var(--muted)"
            strokeWidth="6"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className="transition-all duration-1000"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-lg font-mono text-text-primary">
          {timeStr}
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        {status === "running" ? (
          <button
            onClick={handlePause}
            className="px-4 py-1.5 text-sm rounded-lg border border-border hover:bg-surface-hover text-text-primary transition-colors"
          >
            暂停
          </button>
        ) : (
          <button
            onClick={handleStart}
            className="px-4 py-1.5 text-sm rounded-lg bg-accent text-white hover:bg-accent-hover transition-colors"
          >
            {status === "paused" ? "继续" : "开始"}
          </button>
        )}
        <button
          onClick={handleReset}
          className="px-4 py-1.5 text-sm rounded-lg border border-border hover:bg-surface-hover text-text-secondary transition-colors"
        >
          重置
        </button>
      </div>
    </div>
  );
}
