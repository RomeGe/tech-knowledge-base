"use client";

import { useState } from "react";
import { MarkdownImporter } from "@/components/data/markdown-importer";
import { GithubSync } from "@/components/data/github-sync";
import { DataExport } from "@/components/data/data-export";
import { WebClipper } from "@/components/data/web-clipper";

const tabs = [
  { id: "import", label: "Markdown 导入" },
  { id: "github", label: "GitHub 同步" },
  { id: "export", label: "数据导出" },
  { id: "clipper", label: "网页剪藏" },
];

export default function DataPage() {
  const [activeTab, setActiveTab] = useState("import");

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold text-text-primary mb-6">数据管理</h1>

      <div className="flex gap-1 mb-6 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm transition-colors border-b-2 -mb-px ${
              activeTab === tab.id
                ? "border-accent text-accent font-medium"
                : "border-transparent text-text-tertiary hover:text-text-primary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-surface border border-border rounded-lg p-6">
        {activeTab === "import" && (
          <div>
            <h2 className="text-lg font-medium text-text-primary mb-2">批量导入 Markdown</h2>
            <p className="text-sm text-text-secondary mb-4">选择本地 .md 文件批量导入，支持 YAML frontmatter 解析。</p>
            <MarkdownImporter />
          </div>
        )}
        {activeTab === "github" && (
          <div>
            <h2 className="text-lg font-medium text-text-primary mb-2">GitHub 同步</h2>
            <p className="text-sm text-text-secondary mb-4">从 GitHub 仓库同步 Markdown 文章。</p>
            <GithubSync />
          </div>
        )}
        {activeTab === "export" && (
          <div>
            <h2 className="text-lg font-medium text-text-primary mb-2">数据导出</h2>
            <p className="text-sm text-text-secondary mb-4">导出所有数据为 JSON、Markdown 或 CSV 格式。</p>
            <DataExport />
          </div>
        )}
        {activeTab === "clipper" && (
          <div>
            <h2 className="text-lg font-medium text-text-primary mb-2">网页剪藏</h2>
            <p className="text-sm text-text-secondary mb-4">保存网页内容到知识库，或使用书签栏一键剪藏。</p>
            <WebClipper />
          </div>
        )}
      </div>
    </div>
  );
}
