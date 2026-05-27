"use client";

import { useMemo } from "react";

// Chinese + English stop words for extractive summarization
const STOP_WORDS = new Set([
  "的", "了", "在", "是", "我", "有", "和", "就", "不", "人", "都", "一", "一个",
  "上", "也", "很", "到", "说", "要", "去", "你", "会", "着", "没有", "看", "好",
  "自己", "这", "他", "她", "它", "们", "那", "被", "从", "把", "让", "用", "对",
  "为", "与", "以", "及", "等", "但", "或", "而", "如", "所", "之", "其", "中",
  "个", "可以", "这个", "那个", "什么", "怎么", "这样", "那样", "能", "来", "还",
  "可能", "应该", "已经", "因为", "所以", "如果", "虽然", "但是", "然后", "进行",
  "通过", "使用", "实现", "需要", "提供", "支持", "包括", "以及", "这些", "那些",
  "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
  "have", "has", "had", "do", "does", "did", "will", "would", "could",
  "should", "may", "might", "can", "shall", "to", "of", "in", "for",
  "on", "with", "at", "by", "from", "as", "into", "through", "during",
  "before", "after", "above", "below", "between", "out", "off", "over",
  "under", "again", "further", "then", "once", "here", "there", "when",
  "where", "why", "how", "all", "each", "every", "both", "few", "more",
  "most", "other", "some", "such", "no", "nor", "not", "only", "own",
  "same", "so", "than", "too", "very", "just", "and", "but", "or",
  "if", "while", "this", "that", "these", "those", "it", "its",
]);

// Split text into sentences, handling both Chinese and English punctuation
function splitSentences(text: string): string[] {
  const cleaned = text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]+`/g, " ")
    .replace(/#{1,6}\s+/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_~]+/g, "")
    .replace(/\n{2,}/g, "\n")
    .trim();

  const raw = cleaned.split(/(?<=[。！？.!?\n])\s*/);
  return raw
    .map((s) => s.replace(/^\s*[#>*\-\d.]+\s*/, "").trim())
    .filter((s) => s.length >= 8);
}

// Extract meaningful words from text (handles Chinese n-grams + English words)
function extractWords(text: string): string[] {
  const words: string[] = [];
  // Chinese 2-4 character sequences
  const chinese = text.match(/[一-鿿]{2,4}/g);
  if (chinese) words.push(...chinese);
  // English words (3+ chars)
  const english = text.match(/[a-zA-Z]{3,}/g);
  if (english) words.push(...english.map((w) => w.toLowerCase()));
  return words.filter((w) => !STOP_WORDS.has(w));
}

// Score sentences by keyword frequency, normalized by length
function scoreSentence(sentence: string, freq: Map<string, number>): number {
  const words = extractWords(sentence);
  if (words.length === 0) return 0;
  const raw = words.reduce((sum, w) => sum + (freq.get(w) || 0), 0);
  return raw / Math.sqrt(words.length);
}

// Build word frequency map from full text
function buildFrequencyMap(text: string): Map<string, number> {
  const freq = new Map<string, number>();
  for (const word of extractWords(text)) {
    freq.set(word, (freq.get(word) || 0) + 1);
  }
  return freq;
}

// Extractive summarization: pick top N sentences by keyword score, preserve order
function extractSummary(content: string, count = 3): string[] {
  const sentences = splitSentences(content);
  if (sentences.length <= count) return sentences;

  const freq = buildFrequencyMap(content);
  const scored = sentences
    .map((s, i) => ({ s, i, score: scoreSentence(s, freq) }))
    .sort((a, b) => b.score - a.score);

  return scored
    .slice(0, count)
    .sort((a, b) => a.i - b.i)
    .map((item) => item.s);
}

export function AiSummary({ content }: { content: string }) {
  const sentences = useMemo(() => extractSummary(content, 3), [content]);

  if (sentences.length === 0) return null;

  return (
    <div className="my-6 p-4 bg-muted border border-border rounded-lg">
      <div className="flex items-center gap-2 mb-3">
        <svg
          className="w-4 h-4 text-accent"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
          />
        </svg>
        <span className="text-xs text-text-tertiary uppercase tracking-wider">
          AI 摘要
        </span>
      </div>
      <ul className="space-y-2">
        {sentences.map((s, i) => (
          <li key={i} className="text-sm text-text-secondary leading-relaxed pl-4 relative before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-accent/40">
            {s}
          </li>
        ))}
      </ul>
    </div>
  );
}
