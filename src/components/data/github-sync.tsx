"use client";

import { useState } from "react";

interface GithubFile {
  name: string;
  path: string;
  sha: string;
  download_url: string;
  selected?: boolean;
}

export function GithubSync() {
  const [repo, setRepo] = useState("");
  const [path, setPath] = useState("");
  const [files, setFiles] = useState<GithubFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("github-last-sync") : null
  );

  const fetchFiles = async () => {
    if (!repo) return;
    setLoading(true);
    try {
      const url = `https://api.github.com/repos/${repo}/contents/${path}`;
      const res = await fetch(url);
      const data = await res.json();
      if (Array.isArray(data)) {
        setFiles(
          data
            .filter((f: { name: string }) => f.name.endsWith(".md"))
            .map((f: GithubFile) => ({ ...f, selected: true }))
        );
      }
    } catch {
      // ignore
    }
    setLoading(false);
  };

  const syncSelected = async () => {
    setSyncing(true);
    const selected = files.filter((f) => f.selected);
    for (const file of selected) {
      try {
        const res = await fetch(file.download_url);
        const content = await res.text();
        const titleMatch = content.match(/^#\s+(.+)$/m);
        const title = titleMatch ? titleMatch[1] : file.name.replace(/\.md$/, "");

        await fetch("/api/articles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            content,
            category: "github-import",
            tags: JSON.stringify(["github", repo.split("/")[0]]),
            isPublished: false,
          }),
        });
      } catch {
        // skip failed files
      }
    }
    const now = new Date().toISOString();
    localStorage.setItem("github-last-sync", now);
    setLastSync(now);
    setSyncing(false);
  };

  const toggleFile = (index: number) => {
    const updated = [...files];
    updated[index].selected = !updated[index].selected;
    setFiles(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <input
          type="text"
          value={repo}
          onChange={(e) => setRepo(e.target.value)}
          placeholder="user/repo"
          className="flex-1 min-w-[200px] px-3 py-2 text-sm bg-surface border border-border rounded-lg focus:outline-none focus:border-accent"
        />
        <input
          type="text"
          value={path}
          onChange={(e) => setPath(e.target.value)}
          placeholder="docs/ (可选路径)"
          className="flex-1 min-w-[150px] px-3 py-2 text-sm bg-surface border border-border rounded-lg focus:outline-none focus:border-accent"
        />
        <button
          onClick={fetchFiles}
          disabled={loading || !repo}
          className="px-4 py-2 text-sm bg-surface border border-border rounded-lg hover:bg-surface-hover transition-colors disabled:opacity-50"
        >
          {loading ? "获取中..." : "获取文件"}
        </button>
      </div>

      {lastSync && (
        <p className="text-xs text-text-tertiary">上次同步: {new Date(lastSync).toLocaleString("zh-CN")}</p>
      )}

      {files.length > 0 && (
        <>
          <div className="space-y-1 max-h-60 overflow-y-auto">
            {files.map((file, i) => (
              <label key={file.sha} className="flex items-center gap-2 px-3 py-2 hover:bg-surface-hover rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={file.selected}
                  onChange={() => toggleFile(i)}
                  className="accent-accent"
                />
                <span className="text-sm text-text-primary font-mono">{file.name}</span>
              </label>
            ))}
          </div>
          <button
            onClick={syncSelected}
            disabled={syncing || files.filter((f) => f.selected).length === 0}
            className="px-4 py-2 text-sm bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-50"
          >
            {syncing ? "同步中..." : `同步选中 (${files.filter((f) => f.selected).length})`}
          </button>
        </>
      )}
    </div>
  );
}
