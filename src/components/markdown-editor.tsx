"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      {/* 标签页 */}
      <div className="flex border-b border-border bg-muted">
        <button
          onClick={() => setActiveTab("write")}
          className={`px-4 py-2 text-sm transition-colors ${
            activeTab === "write"
              ? "text-text-primary border-b-2 border-accent"
              : "text-text-tertiary hover:text-text-secondary"
          }`}
        >
          编辑
        </button>
        <button
          onClick={() => setActiveTab("preview")}
          className={`px-4 py-2 text-sm transition-colors ${
            activeTab === "preview"
              ? "text-text-primary border-b-2 border-accent"
              : "text-text-tertiary hover:text-text-secondary"
          }`}
        >
          预览
        </button>
      </div>

      {/* 编辑器/预览 */}
      <div className="min-h-[300px]">
        {activeTab === "write" ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-[300px] p-4 bg-background text-text-primary resize-none focus:outline-none font-mono text-sm"
            placeholder="使用 Markdown 格式编写文章..."
          />
        ) : (
          <div className="p-4 prose prose-sm max-w-none text-text-secondary">
            {value ? (
              <ReactMarkdown>{value}</ReactMarkdown>
            ) : (
              <p className="text-text-tertiary italic">暂无内容预览</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
