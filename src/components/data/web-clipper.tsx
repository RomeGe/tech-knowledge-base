"use client";

import { useState } from "react";

export function WebClipper() {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("web-clip");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const bookmarkletCode = `javascript:void(window.open('${typeof window !== "undefined" ? window.location.origin : ""}/data?clip='+encodeURIComponent(location.href)+'&title='+encodeURIComponent(document.title),'_blank'))`;

  const fetchContent = async () => {
    if (!url) return;
    try {
      const res = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`);
      const html = await res.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const titleEl = doc.querySelector("title");
      setTitle(titleEl?.textContent || url);
      const body = doc.querySelector("article") || doc.querySelector("main") || doc.body;
      setContent(body?.textContent?.slice(0, 5000) || "");
    } catch {
      setTitle(url);
      setContent("无法获取页面内容，请手动粘贴。");
    }
  };

  const save = async () => {
    setSaving(true);
    try {
      await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content: `> 来源: [${url}](${url})\n\n${content}`,
          category,
          tags: JSON.stringify(["web-clip"]),
          isPublished: false,
        }),
      });
      setSaved(true);
    } catch {
      // ignore
    }
    setSaving(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/article"
          className="flex-1 px-3 py-2 text-sm bg-surface border border-border rounded-lg focus:outline-none focus:border-accent"
        />
        <button
          onClick={fetchContent}
          disabled={!url}
          className="px-4 py-2 text-sm bg-surface border border-border rounded-lg hover:bg-surface-hover transition-colors disabled:opacity-50"
        >
          抓取
        </button>
      </div>

      {content && (
        <>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="标题"
            className="w-full px-3 py-2 text-sm bg-surface border border-border rounded-lg focus:outline-none focus:border-accent"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 text-sm bg-surface border border-border rounded-lg"
          >
            <option value="web-clip">网页剪藏</option>
            <option value="reference">参考资料</option>
            <option value="tutorial">教程</option>
            <option value="uncategorized">未分类</option>
          </select>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            className="w-full px-3 py-2 text-sm bg-surface border border-border rounded-lg focus:outline-none focus:border-accent font-mono"
          />
          <button
            onClick={save}
            disabled={saving || saved}
            className="px-4 py-2 text-sm bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-50"
          >
            {saved ? "已保存" : saving ? "保存中..." : "保存到知识库"}
          </button>
        </>
      )}

      <div className="border-t border-border pt-4">
        <p className="text-xs text-text-tertiary mb-2">书签栏工具 — 拖拽到浏览器书签栏，一键剪藏网页：</p>
        <a
          href={bookmarkletCode}
          className="inline-block px-3 py-1.5 text-xs bg-accent text-white rounded hover:bg-accent-hover transition-colors"
          draggable
        >
          剪藏到 Tech.KB
        </a>
      </div>
    </div>
  );
}
