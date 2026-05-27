"use client";

import { useState } from "react";
import { getReadingHistory } from "@/lib/reading-history";
import { getBookmarks } from "@/lib/bookmarks";

export function DataExport() {
  const [exporting, setExporting] = useState<string | null>(null);

  const exportJSON = async () => {
    setExporting("json");
    try {
      const [articlesRes, projectsRes] = await Promise.all([
        fetch("/api/articles?admin=true"),
        fetch("/api/projects?admin=true"),
      ]);
      const articles = await articlesRes.json();
      const projects = await projectsRes.json();
      const data = {
        articles,
        projects,
        readingHistory: getReadingHistory(),
        bookmarks: getBookmarks(),
        exportedAt: new Date().toISOString(),
      };
      downloadFile(JSON.stringify(data, null, 2), "tech-kb-export.json", "application/json");
    } catch {
      // ignore
    }
    setExporting(null);
  };

  const exportMarkdown = async () => {
    setExporting("md");
    try {
      const res = await fetch("/api/articles?admin=true");
      const articles = await res.json();
      let md = "";
      for (const article of articles) {
        md += `---\ntitle: "${article.title}"\ncategory: "${article.category}"\ntags: ${article.tags}\ndate: "${article.createdAt}"\n---\n\n${article.content}\n\n---\n\n`;
      }
      downloadFile(md, "tech-kb-articles.md", "text/markdown");
    } catch {
      // ignore
    }
    setExporting(null);
  };

  const exportCSV = async () => {
    setExporting("csv");
    try {
      const res = await fetch("/api/articles?admin=true");
      const articles = await res.json();
      const header = "标题,分类,标签,发布时间,字数\n";
      const rows = articles.map((a: { title: string; category: string; tags: string; createdAt: string; content: string }) =>
        `"${a.title}","${a.category}","${a.tags}","${a.createdAt}","${a.content.length}"`
      ).join("\n");
      downloadFile("﻿" + header + rows, "tech-kb-articles.csv", "text/csv");
    } catch {
      // ignore
    }
    setExporting(null);
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-text-secondary">导出所有文章、项目、阅读历史和收藏数据。</p>
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={exportJSON}
          disabled={exporting !== null}
          className="px-4 py-2 text-sm bg-surface border border-border rounded-lg hover:bg-surface-hover transition-colors disabled:opacity-50"
        >
          {exporting === "json" ? "导出中..." : "JSON 完整备份"}
        </button>
        <button
          onClick={exportMarkdown}
          disabled={exporting !== null}
          className="px-4 py-2 text-sm bg-surface border border-border rounded-lg hover:bg-surface-hover transition-colors disabled:opacity-50"
        >
          {exporting === "md" ? "导出中..." : "Markdown 文章"}
        </button>
        <button
          onClick={exportCSV}
          disabled={exporting !== null}
          className="px-4 py-2 text-sm bg-surface border border-border rounded-lg hover:bg-surface-hover transition-colors disabled:opacity-50"
        >
          {exporting === "csv" ? "导出中..." : "CSV 元数据"}
        </button>
      </div>
    </div>
  );
}

function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
