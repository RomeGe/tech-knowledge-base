"use client";

import { useState, useRef } from "react";

interface ParsedFile {
  name: string;
  title: string;
  category: string;
  tags: string[];
  content: string;
  status: "pending" | "success" | "error";
  error?: string;
}

function parseFrontmatter(content: string) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, content };

  const meta: Record<string, string> = {};
  match[1].split("\n").forEach((line) => {
    const [key, ...rest] = line.split(":");
    if (key && rest.length) meta[key.trim()] = rest.join(":").trim();
  });
  return { meta, content: match[2] };
}

export function MarkdownImporter() {
  const [files, setFiles] = useState<ParsedFile[]>([]);
  const [importing, setImporting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (fileList: FileList) => {
    const parsed: ParsedFile[] = [];
    Array.from(fileList).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const { meta, content } = parseFrontmatter(text);
        parsed.push({
          name: file.name,
          title: meta.title || file.name.replace(/\.md$/, ""),
          category: meta.category || "uncategorized",
          tags: meta.tags ? meta.tags.split(",").map((t) => t.trim()) : [],
          content,
          status: "pending",
        });
        if (parsed.length === fileList.length) setFiles(parsed);
      };
      reader.readAsText(file);
    });
  };

  const importAll = async () => {
    setImporting(true);
    const updated = [...files];
    for (let i = 0; i < updated.length; i++) {
      try {
        const res = await fetch("/api/articles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: updated[i].title,
            content: updated[i].content,
            category: updated[i].category,
            tags: JSON.stringify(updated[i].tags),
            isPublished: false,
          }),
        });
        updated[i].status = res.ok ? "success" : "error";
        if (!res.ok) updated[i].error = `HTTP ${res.status}`;
      } catch {
        updated[i].status = "error";
        updated[i].error = "网络错误";
      }
      setFiles([...updated]);
    }
    setImporting(false);
  };

  const successCount = files.filter((f) => f.status === "success").length;
  const errorCount = files.filter((f) => f.status === "error").length;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept=".md"
          multiple
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
        />
        <button
          onClick={() => inputRef.current?.click()}
          className="px-4 py-2 text-sm bg-surface border border-border rounded-lg hover:bg-surface-hover transition-colors"
        >
          选择 .md 文件
        </button>
        {files.length > 0 && (
          <button
            onClick={importAll}
            disabled={importing}
            className="px-4 py-2 text-sm bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-50"
          >
            {importing ? "导入中..." : `导入全部 (${files.length})`}
          </button>
        )}
      </div>

      {files.length > 0 && (
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="px-3 py-2 text-left text-text-secondary font-medium">文件名</th>
                <th className="px-3 py-2 text-left text-text-secondary font-medium">标题</th>
                <th className="px-3 py-2 text-left text-text-secondary font-medium">分类</th>
                <th className="px-3 py-2 text-left text-text-secondary font-medium">标签</th>
                <th className="px-3 py-2 text-left text-text-secondary font-medium">状态</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="px-3 py-2 text-text-primary font-mono text-xs">{file.name}</td>
                  <td className="px-3 py-2 text-text-primary">{file.title}</td>
                  <td className="px-3 py-2 text-text-secondary">{file.category}</td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-1">
                      {file.tags.map((tag) => (
                        <span key={tag} className="px-1.5 py-0.5 text-[10px] bg-muted rounded">{tag}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    {file.status === "pending" && <span className="text-text-tertiary">待导入</span>}
                    {file.status === "success" && <span className="text-green-600">成功</span>}
                    {file.status === "error" && <span className="text-red-500">{file.error}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {files.length > 0 && (successCount > 0 || errorCount > 0) && (
        <p className="text-sm text-text-secondary">
          成功 {successCount} / 失败 {errorCount} / 共 {files.length}
        </p>
      )}
    </div>
  );
}
