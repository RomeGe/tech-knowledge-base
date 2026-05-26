"use client";

import { useCallback } from "react";
import { useTheme } from "@/contexts/theme-context";
import { clearReadingHistory } from "@/lib/reading-history";

interface ActionButton {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "danger";
}

export function QuickActions() {
  const { toggleTheme, theme } = useTheme();

  const handleNewArticle = useCallback(() => {
    window.location.href = "/articles/new";
  }, []);

  const handleNewMarkdown = useCallback(() => {
    window.location.href = "/articles/new?format=markdown";
  }, []);

  const handleClearHistory = useCallback(() => {
    if (window.confirm("确定要清除所有阅读历史吗?")) {
      clearReadingHistory();
    }
  }, []);

  const handleExportData = useCallback(() => {
    try {
      const data: Record<string, string> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith("tech-kb-")) {
          data[key] = localStorage.getItem(key) || "";
        }
      }
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `tech-kb-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // ignore
    }
  }, []);

  const handleImportData = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string);
          for (const [key, value] of Object.entries(data)) {
            if (key.startsWith("tech-kb-")) {
              localStorage.setItem(key, value as string);
            }
          }
          window.location.reload();
        } catch {
          alert("导入失败: 文件格式无效");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, []);

  const actions: ActionButton[] = [
    {
      label: "新建文章",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      ),
      onClick: handleNewArticle,
    },
    {
      label: "Markdown",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      ),
      onClick: handleNewMarkdown,
    },
    {
      label: "清除历史",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
      ),
      onClick: handleClearHistory,
      variant: "danger",
    },
    {
      label: "导出数据",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
      ),
      onClick: handleExportData,
    },
    {
      label: "导入数据",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
      ),
      onClick: handleImportData,
    },
    {
      label: theme === "light" ? "深色模式" : "浅色模式",
      icon: theme === "light" ? (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
        </svg>
      ),
      onClick: toggleTheme,
    },
  ];

  return (
    <div className="p-4 space-y-3">
      <h3 className="text-sm font-medium text-text-primary">快捷操作</h3>
      <div className="grid grid-cols-2 gap-2">
        {actions.map((action, i) => (
          <button
            key={i}
            onClick={action.onClick}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-colors ${
              action.variant === "danger"
                ? "border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
                : "border-border text-text-secondary hover:bg-surface-hover hover:text-text-primary"
            }`}
          >
            {action.icon}
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}
