import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ArticleList } from "@/components/article-list";
import { ReadingStats } from "@/components/reading-stats";
import { ReadingHistory } from "@/components/reading-history";
import { ClockWidget } from "@/components/widgets/clock-widget";
import { WeatherWidget } from "@/components/widgets/weather-widget";
import { QuickActions } from "@/components/widgets/quick-actions";
import { ReadingStreak } from "@/components/widgets/reading-streak";
import { GitHubContributions } from "@/components/widgets/github-contributions";
import { BookmarkBar } from "@/components/widgets/bookmark-bar";
import { PomodoroWidget } from "@/components/widgets/pomodoro-widget";
import { NotesWidget } from "@/components/widgets/notes-widget";
import { CalendarWidget } from "@/components/widgets/calendar-widget";
import { PopularArticles } from "@/components/widgets/popular-articles";

type ArticleFromDB = {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string;
  createdAt: Date;
};

type ProjectFromDB = {
  id: string;
  title: string;
  description: string;
  techStack: string;
  imageUrl: string | null;
};

export default async function HomePage() {
  const [articles, projects, articleCount, projectCount] = await Promise.all([
    prisma.article.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        content: true,
        category: true,
        tags: true,
        createdAt: true,
      },
    }),
    prisma.project.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: {
        id: true,
        title: true,
        description: true,
        techStack: true,
        imageUrl: true,
      },
    }),
    prisma.article.count({ where: { isPublished: true } }),
    prisma.project.count({ where: { isPublished: true } }),
  ]);

  const serializedArticles = articles.map((article) => ({
    ...article,
    createdAt: article.createdAt.toISOString(),
  }));

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Welcome Banner */}
      <section className="mb-6 p-6 rounded-xl bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-text-primary mb-1">
              Tech.KB
            </h1>
            <p className="text-text-secondary text-sm">
              个人技术知识库 — 嵌入式系统、硬件设计与编程技术
            </p>
          </div>
          <div className="flex gap-6">
            <Link href="/archive" className="group text-center">
              <span className="text-2xl font-semibold text-text-primary group-hover:text-accent transition-colors">
                {articleCount}
              </span>
              <span className="block text-xs text-text-tertiary">篇文章</span>
            </Link>
            <Link href="/projects" className="group text-center">
              <span className="text-2xl font-semibold text-text-primary group-hover:text-accent transition-colors">
                {projectCount}
              </span>
              <span className="block text-xs text-text-tertiary">个项目</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
        {/* Reading Stats */}
        <div className="md:col-span-2 xl:col-span-3">
          <ReadingStats />
        </div>

        {/* Clock + Weather row */}
        <ClockWidget />
        <WeatherWidget />
        <CalendarWidget />

        {/* Quick Actions */}
        <QuickActions />

        {/* Reading Streak */}
        <ReadingStreak />

        {/* Pomodoro */}
        <PomodoroWidget />

        {/* Bookmark Bar */}
        <div className="md:col-span-2 xl:col-span-3">
          <BookmarkBar />
        </div>

        {/* GitHub Contributions */}
        <div className="md:col-span-2 xl:col-span-3">
          <GitHubContributions />
        </div>

        {/* Popular Articles */}
        <div className="md:col-span-2 xl:col-span-3">
          <PopularArticles />
        </div>

        {/* Notes */}
        <div className="md:col-span-2 xl:col-span-3">
          <NotesWidget />
        </div>
      </div>

      {/* Featured Projects */}
      {projects.length > 0 && (
        <section className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-text-primary">精选项目</h2>
            <Link
              href="/projects"
              className="text-sm text-text-tertiary hover:text-accent transition-colors"
            >
              查看全部
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {projects.map((project) => {
              const techStack = JSON.parse(project.techStack) as string[];
              return (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="block p-4 border border-border rounded-lg hover:border-accent/30 hover:bg-surface-hover transition-all group"
                >
                  {project.imageUrl && (
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-28 object-cover rounded mb-3 border border-border-subtle"
                    />
                  )}
                  <h3 className="text-sm font-medium text-text-primary group-hover:text-accent transition-colors mb-1">
                    {project.title}
                  </h3>
                  <p className="text-xs text-text-tertiary line-clamp-2 mb-3">
                    {project.description}
                  </p>
                  {techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {techStack.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="px-1.5 py-0.5 text-[10px] text-text-tertiary bg-muted rounded"
                        >
                          {tech}
                        </span>
                      ))}
                      {techStack.length > 3 && (
                        <span className="px-1.5 py-0.5 text-[10px] text-text-tertiary">
                          +{techStack.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Latest Articles */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-text-primary">最新文章</h2>
          <Link
            href="/archive"
            className="text-sm text-text-tertiary hover:text-accent transition-colors"
          >
            查看归档
          </Link>
        </div>
        <ArticleList articles={serializedArticles} />
      </section>
    </div>
  );
}
