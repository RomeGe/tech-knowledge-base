"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

interface ReadingModeProps {
  title: string;
  content: string;
  date?: string;
}

export function ReadingMode({ title, content, date }: ReadingModeProps) {
  const [active, setActive] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const [showControls, setShowControls] = useState(true);
  const [progress, setProgress] = useState(0);

  const toggle = useCallback(() => setActive((v) => !v), []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "r" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const tag = (e.target as HTMLElement).tagName;
        if (tag !== "INPUT" && tag !== "TEXTAREA" && tag !== "SELECT") {
          e.preventDefault();
          toggle();
        }
      }
      if (e.key === "Escape" && active) setActive(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [active, toggle]);

  useEffect(() => {
    if (!active) return;
    let timer: ReturnType<typeof setTimeout>;
    const resetTimer = () => {
      setShowControls(true);
      clearTimeout(timer);
      timer = setTimeout(() => setShowControls(false), 3000);
    };
    window.addEventListener("mousemove", resetTimer);
    resetTimer();
    return () => {
      window.removeEventListener("mousemove", resetTimer);
      clearTimeout(timer);
    };
  }, [active]);

  if (!active) {
    return (
      <button
        onClick={toggle}
        className="px-3 py-1.5 text-xs text-text-tertiary border border-border rounded hover:bg-surface-hover transition-colors"
        title="阅读模式 (R)"
      >
        阅读模式
      </button>
    );
  }

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-background overflow-y-auto">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-border z-10">
        <div className="h-full bg-accent transition-all" style={{ width: `${progress}%` }} />
      </div>

      {/* Controls */}
      <div className={`fixed top-4 right-4 flex items-center gap-2 transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"}`}>
        <div className="flex items-center gap-1 bg-surface border border-border rounded-lg px-2 py-1">
          <button onClick={() => setFontSize((s) => Math.max(14, s - 1))} className="px-1 text-xs text-text-tertiary hover:text-text-primary">A-</button>
          <span className="text-xs text-text-secondary w-6 text-center">{fontSize}</span>
          <button onClick={() => setFontSize((s) => Math.min(24, s + 1))} className="px-1 text-xs text-text-tertiary hover:text-text-primary">A+</button>
        </div>
        <button
          onClick={toggle}
          className="p-2 bg-surface border border-border rounded-lg text-text-tertiary hover:text-text-primary"
          title="退出阅读模式 (Esc)"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <article
        className="max-w-prose mx-auto px-6 pt-16 pb-32"
        style={{ fontSize: `${fontSize}px` }}
        onScroll={(e) => {
          const el = e.currentTarget;
          const scrolled = el.scrollTop;
          const total = el.scrollHeight - el.clientHeight;
          setProgress(total > 0 ? (scrolled / total) * 100 : 0);
        }}
      >
        <h1 className="text-3xl font-semibold text-text-primary mb-2">{title}</h1>
        {date && <p className="text-sm text-text-tertiary mb-8">{new Date(date).toLocaleDateString("zh-CN")}</p>}
        <div className="prose prose-lg max-w-none text-text-primary leading-relaxed">
          {content.split("\n").map((line, i) => {
            if (line.startsWith("# ")) return <h1 key={i} className="text-2xl font-semibold mt-8 mb-4">{line.slice(2)}</h1>;
            if (line.startsWith("## ")) return <h2 key={i} className="text-xl font-semibold mt-6 mb-3">{line.slice(3)}</h2>;
            if (line.startsWith("### ")) return <h3 key={i} className="text-lg font-semibold mt-5 mb-2">{line.slice(4)}</h3>;
            if (line.startsWith("```")) return <div key={i} className="my-4" />;
            if (line.trim() === "") return <div key={i} className="h-4" />;
            return <p key={i} className="mb-3">{line}</p>;
          })}
        </div>
      </article>
    </div>,
    document.body
  );
}
