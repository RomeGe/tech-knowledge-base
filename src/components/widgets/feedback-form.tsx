"use client";

import { useState, useCallback } from "react";

const STORAGE_KEY = "tech-kb-feedback";

interface Feedback {
  rating: number;
  category: string;
  message: string;
  timestamp: number;
}

const CATEGORIES = ["功能建议", "Bug 报告", "内容反馈", "体验优化", "其他"];

export function FeedbackForm() {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (rating === 0 || !message.trim()) return;

      const feedback: Feedback = {
        rating,
        category: category || "其他",
        message: message.trim(),
        timestamp: Date.now(),
      };

      try {
        const existing = localStorage.getItem(STORAGE_KEY);
        const list: Feedback[] = existing ? JSON.parse(existing) : [];
        list.push(feedback);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      } catch {
        // ignore
      }

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setRating(0);
        setCategory("");
        setMessage("");
      }, 2000);
    },
    [rating, category, message]
  );

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 p-8">
        <svg className="w-12 h-12 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm font-medium text-text-primary">感谢您的反馈!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <h3 className="text-sm font-medium text-text-primary">意见反馈</h3>

      {/* Star rating */}
      <div className="space-y-1">
        <p className="text-xs text-text-secondary">评分</p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="text-xl transition-colors"
              aria-label={`${star} 星`}
            >
              {star <= (hoveredRating || rating) ? (
                <span className="text-yellow-500">&#9733;</span>
              ) : (
                <span className="text-text-tertiary">&#9734;</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Category */}
      <div className="space-y-1">
        <p className="text-xs text-text-secondary">分类</p>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
        >
          <option value="">选择分类</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Message */}
      <div className="space-y-1">
        <p className="text-xs text-text-secondary">内容</p>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="请描述您的反馈..."
          className="w-full h-24 resize-none rounded-lg border border-border bg-background p-3 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-1 focus:ring-accent"
          required
        />
      </div>

      <button
        type="submit"
        disabled={rating === 0 || !message.trim()}
        className="w-full py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        提交反馈
      </button>
    </form>
  );
}
