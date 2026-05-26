"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "tech-kb-notes";

export function NotesWidget() {
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setNote(raw);
    } catch {
      // ignore
    }
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      setNote(value);
      try {
        localStorage.setItem(STORAGE_KEY, value);
        setSaved(true);
        setTimeout(() => setSaved(false), 1500);
      } catch {
        // ignore
      }
    },
    []
  );

  const handleClear = () => {
    setNote("");
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-text-primary">便签</h3>
        <div className="flex items-center gap-2">
          {saved && (
            <span className="text-xs text-accent">已保存</span>
          )}
          <button
            onClick={handleClear}
            className="text-xs text-text-tertiary hover:text-text-secondary transition-colors"
          >
            清除
          </button>
        </div>
      </div>
      <textarea
        value={note}
        onChange={handleChange}
        placeholder="记点什么..."
        className="w-full h-32 resize-none rounded-lg border border-border bg-background p-3 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-1 focus:ring-accent transition-colors"
      />
      <p className="text-xs text-text-tertiary text-right">
        {note.length} 字
      </p>
    </div>
  );
}
