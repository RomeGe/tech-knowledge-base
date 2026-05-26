import { Metadata } from "next";

export const metadata: Metadata = {
  title: "更新日志 - 技术知识库",
  description: "站点更新记录和版本历史。",
};

interface ChangelogEntry {
  date: string;
  version: string;
  changes: { type: "feature" | "fix" | "improve"; text: string }[];
}

const changelog: ChangelogEntry[] = [
  {
    date: "2026-05-26",
    version: "1.4.0",
    changes: [
      { type: "feature", text: "Command Palette (⌘K) 快速导航" },
      { type: "feature", text: "文章目录自动生成" },
      { type: "feature", text: "代码块语法高亮和复制按钮" },
      { type: "feature", text: "相关文章推荐" },
      { type: "feature", text: "阅读进度条" },
      { type: "feature", text: "回到顶部按钮" },
      { type: "feature", text: "资源链接页面" },
      { type: "feature", text: "更新日志页面" },
      { type: "improve", text: "首页添加 Hero 区域和项目展示" },
      { type: "improve", text: "文章列表显示字数和阅读时间" },
      { type: "improve", text: "归档页添加时间线视图和统计" },
      { type: "improve", text: "项目页改为卡片网格布局" },
    ],
  },
  {
    date: "2026-05-26",
    version: "1.3.0",
    changes: [
      { type: "feature", text: "文章搜索功能" },
      { type: "feature", text: "文章标签系统" },
      { type: "feature", text: "项目管理功能" },
      { type: "feature", text: "项目封面图片展示" },
      { type: "improve", text: "设计优化：移除毛玻璃效果" },
      { type: "improve", text: "设计优化：简化主题切换动画" },
      { type: "improve", text: "设计优化：调整内容间距" },
    ],
  },
  {
    date: "2026-05-26",
    version: "1.2.0",
    changes: [
      { type: "feature", text: "深色模式支持" },
      { type: "feature", text: "管理面板" },
      { type: "feature", text: "文章 CRUD 功能" },
      { type: "feature", text: "Markdown 编辑器和预览" },
    ],
  },
  {
    date: "2026-05-26",
    version: "1.1.0",
    changes: [
      { type: "feature", text: "文章归档页面" },
      { type: "feature", text: "项目详情页面" },
      { type: "feature", text: "关于页面" },
    ],
  },
  {
    date: "2026-05-26",
    version: "1.0.0",
    changes: [
      { type: "feature", text: "项目初始化" },
      { type: "feature", text: "Next.js + Tailwind CSS + Prisma 技术栈" },
      { type: "feature", text: "Turso 云数据库" },
      { type: "feature", text: "Vercel 部署" },
    ],
  },
];

const typeLabels = {
  feature: { label: "新增", color: "text-green-600 bg-green-50 dark:bg-green-900/20" },
  fix: { label: "修复", color: "text-red-600 bg-red-50 dark:bg-red-900/20" },
  improve: { label: "改进", color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20" },
};

export default function ChangelogPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <header className="mb-12">
        <h1 className="text-3xl font-semibold tracking-tight text-text-primary">
          更新日志
        </h1>
        <p className="mt-3 text-text-secondary">
          站点更新记录和版本历史
        </p>
      </header>

      <div className="space-y-10">
        {changelog.map((entry) => (
          <div key={entry.version} className="relative pl-6">
            <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-accent/40" />
            <div className="absolute left-[3px] top-3.5 w-[2px] h-full bg-border-subtle" />
            <div className="flex items-center gap-3 mb-3">
              <span className="text-sm font-medium text-text-primary">
                v{entry.version}
              </span>
              <span className="text-xs text-text-tertiary">{entry.date}</span>
            </div>
            <ul className="space-y-2">
              {entry.changes.map((change, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span
                    className={`px-1.5 py-0.5 text-[10px] font-medium rounded shrink-0 mt-0.5 ${typeLabels[change.type].color}`}
                  >
                    {typeLabels[change.type].label}
                  </span>
                  <span className="text-sm text-text-secondary">
                    {change.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
