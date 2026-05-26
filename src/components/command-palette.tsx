"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";

interface CommandItem {
  id: string;
  label: string;
  hint: string;
  action: () => void;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const router = useRouter();

  const commands: CommandItem[] = useMemo(
    () => [
      { id: "home", label: "首页", hint: "返回首页", action: () => router.push("/") },
      { id: "about", label: "关于", hint: "关于页面", action: () => router.push("/about") },
      { id: "projects", label: "项目", hint: "项目列表", action: () => router.push("/projects") },
      { id: "archive", label: "归档", hint: "文章归档", action: () => router.push("/archive") },
      { id: "links", label: "资源链接", hint: "收藏的链接", action: () => router.push("/links") },
      { id: "changelog", label: "更新日志", hint: "站点更新记录", action: () => router.push("/changelog") },
      { id: "admin", label: "管理面板", hint: "后台管理", action: () => router.push("/admin") },
      { id: "top", label: "回到顶部", hint: "滚动到页面顶部", action: () => window.scrollTo({ top: 0, behavior: "smooth" }) },
      { id: "github", label: "GitHub", hint: "访问 GitHub", action: () => window.open("https://github.com", "_blank") },
    ],
    [router]
  );

  const filtered = useMemo(() => {
    if (!query.trim()) return commands;
    const q = query.toLowerCase();
    return commands.filter(
      (c) => c.label.toLowerCase().includes(q) || c.hint.toLowerCase().includes(q)
    );
  }, [commands, query]);

  const execute = useCallback(() => {
    if (filtered[selected]) {
      filtered[selected].action();
      setOpen(false);
      setQuery("");
      setSelected(0);
    }
  }, [filtered, selected]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
        setQuery("");
        setSelected(0);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelected((prev) => Math.min(prev + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelected((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        execute();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, filtered, selected, execute]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]">
      <div className="fixed inset-0 bg-black/30" onClick={() => setOpen(false)} />
      <div className="relative w-full max-w-md mx-4 bg-surface border border-border rounded-lg shadow-lg overflow-hidden">
        <div className="flex items-center border-b border-border px-4">
          <svg className="w-4 h-4 text-text-tertiary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelected(0); }}
            placeholder="搜索命令..."
            className="flex-1 px-3 py-3 bg-transparent text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none"
            autoFocus
          />
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] text-text-tertiary border border-border rounded">
            ESC
          </kbd>
        </div>
        <div className="max-h-64 overflow-y-auto py-1">
          {filtered.length === 0 ? (
            <p className="px-4 py-3 text-sm text-text-tertiary">无匹配结果</p>
          ) : (
            filtered.map((item, i) => (
              <button
                key={item.id}
                onClick={() => { item.action(); setOpen(false); }}
                onMouseEnter={() => setSelected(i)}
                className={`w-full px-4 py-2.5 flex items-center justify-between text-left text-sm transition-colors ${
                  i === selected ? "bg-accent-subtle text-accent" : "text-text-secondary hover:bg-surface-hover"
                }`}
              >
                <span>{item.label}</span>
                <span className="text-xs text-text-tertiary">{item.hint}</span>
              </button>
            ))
          )}
        </div>
        <div className="border-t border-border px-4 py-2 flex items-center gap-4 text-[10px] text-text-tertiary">
          <span><kbd className="px-1 py-0.5 border border-border rounded">↑↓</kbd> 导航</span>
          <span><kbd className="px-1 py-0.5 border border-border rounded">↵</kbd> 执行</span>
          <span><kbd className="px-1 py-0.5 border border-border rounded">ESC</kbd> 关闭</span>
        </div>
      </div>
    </div>
  );
}
