import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { TagCloud } from "@/components/tag-cloud";
import { CategoryStats } from "@/components/category-stats";

export const metadata: Metadata = {
  title: "归档 - 技术知识库",
  description: "按分类浏览所有已发布文章。",
};

type ArticleItem = {
  id: string;
  title: string;
  category: string;
  tags: string;
  createdAt: Date;
};

export default async function ArchivePage() {
  const articles: ArticleItem[] = await prisma.article.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      category: true,
      tags: true,
      createdAt: true,
    },
  });

  // Group by category
  const grouped: Record<string, ArticleItem[]> = {};
  for (const article of articles) {
    const category = article.category || "未分类";
    if (!grouped[category]) grouped[category] = [];
    grouped[category].push(article);
  }
  const categories = Object.keys(grouped).sort();

  // Stats
  const totalArticles = articles.length;
  const totalCategories = categories.length;
  const tagSet = new Set<string>();
  for (const article of articles) {
    try {
      const tags = JSON.parse(article.tags) as string[];
      tags.forEach((t) => tagSet.add(t));
    } catch {}
  }

  // Group by month for timeline
  const byMonth: Record<string, ArticleItem[]> = {};
  for (const article of articles) {
    const d = new Date(article.createdAt);
    const key = `${d.getFullYear()}年${d.getMonth() + 1}月`;
    if (!byMonth[key]) byMonth[key] = [];
    byMonth[key].push(article);
  }
  const months = Object.keys(byMonth);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <header className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight text-text-primary mb-3">
          归档
        </h1>
        <p className="text-text-secondary mb-6">
          按分类浏览所有已发布文章
        </p>
        <div className="flex gap-8 text-sm">
          <div>
            <span className="text-xl font-semibold text-text-primary">
              {totalArticles}
            </span>
            <span className="ml-1.5 text-text-tertiary">篇文章</span>
          </div>
          <div>
            <span className="text-xl font-semibold text-text-primary">
              {totalCategories}
            </span>
            <span className="ml-1.5 text-text-tertiary">个分类</span>
          </div>
          <div>
            <span className="text-xl font-semibold text-text-primary">
              {tagSet.size}
            </span>
            <span className="ml-1.5 text-text-tertiary">个标签</span>
          </div>
        </div>
      </header>

      {categories.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-text-tertiary">暂无文章</p>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Tag Cloud */}
          <section>
            <h2 className="text-sm font-medium text-text-tertiary uppercase tracking-wider mb-4">
              标签云
            </h2>
            <TagCloud articles={articles} />
          </section>

          {/* Category Stats */}
          <section>
            <h2 className="text-sm font-medium text-text-tertiary uppercase tracking-wider mb-4">
              分类统计
            </h2>
            <CategoryStats articles={articles} />
          </section>

          {/* By Category */}
          <section>
            <h2 className="text-sm font-medium text-text-tertiary uppercase tracking-wider mb-4">
              按分类
            </h2>
            <div className="space-y-8">
              {categories.map((category) => (
                <div key={category}>
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-sm font-medium text-text-primary">
                      {category}
                    </h3>
                    <span className="px-2 py-0.5 text-[10px] text-text-tertiary bg-muted rounded-full">
                      {grouped[category].length}
                    </span>
                  </div>
                  <div className="space-y-0 border-l border-border-subtle pl-4">
                    {grouped[category].map((article) => (
                      <div
                        key={article.id}
                        className="flex items-center justify-between py-2.5 group"
                      >
                        <Link
                          href={`/?expand=${article.id}`}
                          className="text-sm text-text-secondary hover:text-accent transition-colors"
                        >
                          {article.title}
                        </Link>
                        <time className="text-xs text-text-tertiary shrink-0 ml-4">
                          {new Date(article.createdAt).toLocaleDateString(
                            "zh-CN",
                            { month: "short", day: "numeric" }
                          )}
                        </time>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Timeline */}
          <section>
            <h2 className="text-sm font-medium text-text-tertiary uppercase tracking-wider mb-4">
              时间线
            </h2>
            <div className="space-y-6">
              {months.map((month) => (
                <div key={month} className="relative pl-6">
                  <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-accent/40" />
                  <div className="absolute left-[3px] top-3.5 w-[2px] h-full bg-border-subtle" />
                  <h3 className="text-sm font-medium text-text-primary mb-2">
                    {month}
                  </h3>
                  <div className="space-y-1">
                    {byMonth[month].map((article) => (
                      <div key={article.id} className="flex items-center gap-3">
                        <time className="text-[11px] text-text-tertiary w-10 shrink-0">
                          {new Date(article.createdAt).toLocaleDateString(
                            "zh-CN",
                            { day: "numeric" }
                          )}
                          日
                        </time>
                        <Link
                          href={`/?expand=${article.id}`}
                          className="text-sm text-text-secondary hover:text-accent transition-colors"
                        >
                          {article.title}
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
