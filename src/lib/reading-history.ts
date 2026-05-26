"use client";

const STORAGE_KEY = "tech-kb-reading-history";
const MAX_ITEMS = 20;

export interface ReadingHistoryItem {
  id: string;
  title: string;
  timestamp: number;
}

export function getReadingHistory(): ReadingHistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addToReadingHistory(id: string, title: string): void {
  if (typeof window === "undefined") return;
  const history = getReadingHistory().filter((item) => item.id !== id);
  history.unshift({ id, title, timestamp: Date.now() });
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(history.slice(0, MAX_ITEMS))
  );
}

export function clearReadingHistory(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
