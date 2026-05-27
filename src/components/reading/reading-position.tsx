"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export function useReadingPosition(articleId: string) {
  const [showBanner, setShowBanner] = useState(false);
  const [savedPosition, setSavedPosition] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const storageKey = `tech-kb-reading-pos-${articleId}`;

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const pos = Number(saved);
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      if (pos > clientHeight * 0.2 && pos < scrollHeight - clientHeight * 0.5) {
        setSavedPosition(pos);
        setShowBanner(true);
      }
    }
  }, [storageKey]);

  const handleScroll = useCallback(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const scrollY = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const progress = scrollY / (scrollHeight - clientHeight);

      if (progress < 0.95) {
        localStorage.setItem(storageKey, String(scrollY));
      } else {
        localStorage.removeItem(storageKey);
        setShowBanner(false);
      }
    }, 2000);
  }, [storageKey]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timerRef.current);
    };
  }, [handleScroll]);

  const resumeReading = () => {
    window.scrollTo({ top: savedPosition, behavior: "smooth" });
    setShowBanner(false);
  };

  const dismissBanner = () => {
    setShowBanner(false);
    localStorage.removeItem(storageKey);
  };

  return { showBanner, resumeReading, dismissBanner };
}

interface ReadingPositionBannerProps {
  articleId: string;
}

export function ReadingPositionBanner({ articleId }: ReadingPositionBannerProps) {
  const { showBanner, resumeReading, dismissBanner } = useReadingPosition(articleId);

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 px-4 py-2.5 bg-surface border border-border rounded-lg shadow-lg">
      <svg className="w-4 h-4 text-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
      <span className="text-sm text-text-primary">继续上次阅读</span>
      <button onClick={resumeReading} className="px-2.5 py-1 text-xs bg-accent text-white rounded hover:bg-accent-hover transition-colors">
        继续
      </button>
      <button onClick={dismissBanner} className="p-1 text-text-tertiary hover:text-text-primary">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
