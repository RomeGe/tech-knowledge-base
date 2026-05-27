"use client";

import Link from "next/link";
import { useMemo } from "react";

interface SeriesArticle {
  slug: string;
  title: string;
  part: number;
}

export function ArticleSeries({
  seriesName,
  articles,
  currentSlug,
}: {
  seriesName: string;
  articles: SeriesArticle[];
  currentSlug: string;
}) {
  const sorted = useMemo(
    () => [...articles].sort((a, b) => a.part - b.part),
    [articles]
  );

  const currentIndex = sorted.findIndex((a) => a.slug === currentSlug);
  const prev = currentIndex > 0 ? sorted[currentIndex - 1] : null;
  const next =
    currentIndex >= 0 && currentIndex < sorted.length - 1
      ? sorted[currentIndex + 1]
      : null;

  return (
    <div className="my-8 p-4 bg-muted border border-border rounded-lg">
      <div className="text-xs text-text-tertiary mb-3 uppercase tracking-wider">
        Part of a series
      </div>
      <h4 className="text-sm font-medium text-text-primary mb-3">
        {seriesName}
      </h4>
      <ol className="space-y-1.5 list-none pl-0 mb-4">
        {sorted.map((article) => {
          const isCurrent = article.slug === currentSlug;
          return (
            <li key={article.slug} className="flex items-start gap-2">
              <span className="text-xs text-text-tertiary font-mono mt-0.5 shrink-0 w-5 text-right">
                {article.part}.
              </span>
              {isCurrent ? (
                <span className="text-sm text-accent font-medium">
                  {article.title}
                  <span className="text-xs text-text-tertiary ml-1.5">
                    (current)
                  </span>
                </span>
              ) : (
                <Link
                  href={`/articles/${article.slug}`}
                  className="text-sm text-text-secondary hover:text-accent transition-colors"
                >
                  {article.title}
                </Link>
              )}
            </li>
          );
        })}
      </ol>

      {/* Prev / Next navigation within series */}
      {(prev || next) && (
        <div className="flex items-center justify-between pt-3 border-t border-border">
          {prev ? (
            <Link
              href={`/articles/${prev.slug}`}
              className="flex items-center gap-1 text-xs text-text-tertiary hover:text-accent transition-colors"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
              {prev.part}. {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/articles/${next.slug}`}
              className="flex items-center gap-1 text-xs text-text-tertiary hover:text-accent transition-colors text-right"
            >
              {next.part}. {next.title}
              <svg
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </Link>
          ) : (
            <span />
          )}
        </div>
      )}
    </div>
  );
}
