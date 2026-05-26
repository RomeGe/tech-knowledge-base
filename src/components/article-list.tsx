"use client";

import { useState, useMemo, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import { addToReadingHistory } from "@/lib/reading-history";
import { BookmarkButton } from "./bookmark-button";
import { ShareButton } from "./share-button";

interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string;
  createdAt: string;
}

interface ArticleListProps {
  articles: Article[];
}

function getReadingTime(content: string): number {
  const chars = content.replace(/\s/g, "").length;
  return Math.max(1, Math.ceil(chars / 400));
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "今天";
  if (diffDays === 1) return "昨天";
  if (diffDays < 7) return `${diffDays}天前`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`;
  return date.toLocaleDateString("zh-CN", { month: "short", day: "numeric" });
}

function extractHeadings(content: string): { level: number; text: string }[] {
  const lines = content.split("\n");
  const headings: { level: number; text: string }[] = [];
  for (const line of lines) {
    const match = line.match(/^(#{1,3})\s+(.+)/);
    if (match) {
      headings.push({ level: match[1].length, text: match[2].trim() });
    }
  }
  return headings;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [text]);
  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 px-2 py-1 text-[10px] text-text-tertiary bg-surface border border-border rounded hover:text-text-primary transition-colors opacity-0 group-hover/code:opacity-100"
    >
      {copied ? "已复制" : "复制"}
    </button>
  );
}

function MarkdownContent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={{
        code({ className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          const codeStr = String(children).replace(/\n$/, "");
          if (match) {
            return (
              <div className="relative group/code">
                <div className="absolute top-0 left-3 px-2 py-0.5 text-[10px] text-text-tertiary bg-muted rounded-b">
                  {match[1]}
                </div>
                <CopyButton text={codeStr} />
                <pre className={className}>
                  <code {...props}>
                    {children}
                  </code>
                </pre>
              </div>
            );
          }
          return (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

export function ArticleList({ articles }: ArticleListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    for (const article of articles) {
      try {
        const tags = JSON.parse(article.tags) as string[];
        tags.forEach((t) => tagSet.add(t));
      } catch {}
    }
    return Array.from(tagSet).sort();
  }, [articles]);

  const filtered = useMemo(() => {
    let result = articles;
    if (activeTag) {
      result = result.filter((a) => {
        try {
          const tags = JSON.parse(a.tags) as string[];
          return tags.includes(activeTag);
        } catch {
          return false;
        }
      });
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.content.toLowerCase().includes(q)
      );
    }
    return result;
  }, [articles, search, activeTag]);

  const toggleExpand = (id: string) => {
    const article = articles.find((a) => a.id === id);
    if (article && expandedId !== id) {
      addToReadingHistory(id, article.title);
    }
    setExpandedId((prev) => (prev === id ? null : id));
  };

  if (articles.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-text-tertiary">暂无文章</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="搜索文章..."
        className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent transition-colors"
      />

      {/* Tags */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTag(null)}
            className={`px-3 py-1 text-xs rounded-full border transition-colors ${
              activeTag === null
                ? "border-accent bg-accent-subtle text-accent"
                : "border-border text-text-tertiary hover:text-text-secondary"
            }`}
          >
            全部
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                activeTag === tag
                  ? "border-accent bg-accent-subtle text-accent"
                  : "border-border text-text-tertiary hover:text-text-secondary"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Article list */}
      {filtered.length === 0 ? (
        <p className="text-text-tertiary text-sm">未找到匹配文章</p>
      ) : (
        <div className="space-y-0">
          {filtered.map((article) => {
            const isExpanded = expandedId === article.id;
            let tags: string[] = [];
            try {
              tags = JSON.parse(article.tags) as string[];
            } catch {}
            const readTime = getReadingTime(article.content);
            const wordCount = article.content.replace(/\s/g, "").length;
            const headings = extractHeadings(article.content);
            const related = articles
              .filter((a) => {
                if (a.id === article.id) return false;
                try {
                  const aTags = JSON.parse(a.tags) as string[];
                  return tags.some((t) => aTags.includes(t));
                } catch {
                  return false;
                }
              })
              .slice(0, 3);

            return (
              <article
                key={article.id}
                className="border-b border-border-subtle last:border-0"
              >
                <button
                  onClick={() => toggleExpand(article.id)}
                  className="w-full py-4 px-0 flex items-start justify-between text-left group"
                >
                  <div className="flex-1 min-w-0 mr-4">
                    <div className="flex items-center gap-3 mb-1.5">
                      <h2 className="text-base font-medium text-text-primary group-hover:text-accent transition-colors truncate">
                        {article.title}
                      </h2>
                      {tags.length > 0 && (
                        <div className="flex gap-1 shrink-0">
                          {tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="px-1.5 py-0.5 text-[10px] text-text-tertiary bg-muted rounded"
                            >
                              {tag}
                            </span>
                          ))}
                          {tags.length > 2 && (
                            <span className="px-1 py-0.5 text-[10px] text-text-tertiary">
                              +{tags.length - 2}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-text-tertiary">
                      <span className="font-mono">{article.category}</span>
                      <span>{formatDate(article.createdAt)}</span>
                      <span>{wordCount}字</span>
                      <span>{readTime}分钟阅读</span>
                    </div>
                  </div>
                  <svg
                    className={`h-4 w-4 text-text-tertiary transition-transform duration-200 shrink-0 mt-1 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </button>
                {isExpanded && (
                  <div className="pb-6 px-0">
                    {/* Actions */}
                    <div className="flex items-center gap-1 mb-4">
                      <BookmarkButton id={article.id} />
                      <ShareButton title={article.title} />
                    </div>
                    {/* Table of Contents */}
                    {headings.length > 1 && (
                      <nav className="mb-6 p-4 border border-border-subtle rounded-lg bg-muted/50">
                        <p className="text-xs font-medium text-text-tertiary uppercase tracking-wider mb-2">
                          目录
                        </p>
                        <ul className="space-y-1">
                          {headings.map((h, i) => (
                            <li
                              key={i}
                              style={{ paddingLeft: `${(h.level - 1) * 12}px` }}
                            >
                              <span className="text-sm text-text-secondary hover:text-accent transition-colors cursor-default">
                                {h.text}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </nav>
                    )}

                    {/* Content */}
                    <div className="prose prose-sm max-w-none text-text-secondary">
                      <MarkdownContent content={article.content} />
                    </div>

                    {/* Related Articles */}
                    {related.length > 0 && (
                      <div className="mt-8 pt-4 border-t border-border-subtle">
                        <p className="text-xs font-medium text-text-tertiary uppercase tracking-wider mb-3">
                          相关文章
                        </p>
                        <div className="space-y-2">
                          {related.map((r) => (
                            <button
                              key={r.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedId(r.id);
                              }}
                              className="block text-sm text-text-secondary hover:text-accent transition-colors"
                            >
                              {r.title}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
