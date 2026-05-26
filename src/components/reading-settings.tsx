"use client";

import { useState, useEffect } from "react";

const FONT_SIZES = [14, 15, 16, 17, 18] as const;
const WIDTHS = [640, 768, 896, 1024] as const;

export function ReadingSettings() {
  const [fontSize, setFontSize] = useState(16);
  const [maxWidth, setMaxWidth] = useState(896);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const savedFont = localStorage.getItem("tech-kb-font-size");
    const savedWidth = localStorage.getItem("tech-kb-max-width");
    if (savedFont) setFontSize(Number(savedFont));
    if (savedWidth) setMaxWidth(Number(savedWidth));
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty("--reading-font-size", `${fontSize}px`);
    document.documentElement.style.setProperty("--reading-max-width", `${maxWidth}px`);
    localStorage.setItem("tech-kb-font-size", String(fontSize));
    localStorage.setItem("tech-kb-max-width", String(maxWidth));
  }, [fontSize, maxWidth]);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-1.5 text-text-tertiary hover:text-text-primary transition-colors"
        aria-label="阅读设置"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 p-4 bg-surface border border-border rounded-lg shadow-lg z-50">
          <div className="mb-4">
            <p className="text-xs text-text-tertiary mb-2">字体大小</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFontSize((s) => Math.max(FONT_SIZES[0], s - 1))}
                className="px-2 py-1 text-xs border border-border rounded hover:bg-surface-hover"
              >
                A-
              </button>
              <span className="text-sm text-text-primary w-8 text-center">{fontSize}</span>
              <button
                onClick={() => setFontSize((s) => Math.min(FONT_SIZES[FONT_SIZES.length - 1], s + 1))}
                className="px-2 py-1 text-xs border border-border rounded hover:bg-surface-hover"
              >
                A+
              </button>
            </div>
          </div>
          <div>
            <p className="text-xs text-text-tertiary mb-2">内容宽度</p>
            <div className="flex gap-1">
              {WIDTHS.map((w) => (
                <button
                  key={w}
                  onClick={() => setMaxWidth(w)}
                  className={`flex-1 py-1 text-[10px] border rounded transition-colors ${
                    maxWidth === w
                      ? "border-accent bg-accent-subtle text-accent"
                      : "border-border text-text-tertiary hover:bg-surface-hover"
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
