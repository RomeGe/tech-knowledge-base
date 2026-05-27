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

function CircuitSVG() {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-[0.03] dark:opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          <path d="M10 10h20v0h10v10h0v20" stroke="currentColor" fill="none" strokeWidth="0.5" />
          <path d="M50 50h30v20h0v10" stroke="currentColor" fill="none" strokeWidth="0.5" />
          <path d="M80 10v30h-20v20" stroke="currentColor" fill="none" strokeWidth="0.5" />
          <circle cx="10" cy="10" r="2" fill="currentColor" />
          <circle cx="40" cy="10" r="2" fill="currentColor" />
          <circle cx="40" cy="40" r="2" fill="currentColor" />
          <circle cx="80" cy="10" r="2" fill="currentColor" />
          <circle cx="80" cy="60" r="2" fill="currentColor" />
          <circle cx="60" cy="80" r="2" fill="currentColor" />
          <circle cx="50" cy="50" r="1.5" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#circuit)" />
    </svg>
  );
}

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
    <div className="min-h-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <CircuitSVG />
        <div className="relative p-8 lg:p-12">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex items-start justify-between flex-wrap gap-6">
              <div className="animate-fade-in">
                <div className="flex items-center gap-3 mb-4">
                  <div className="status-dot" />
                  <span className="text-xs font-mono text-accent tracking-wider uppercase">System Online</span>
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-3">
                  <span className="gradient-text">ls.home</span>
                </h1>
                <p className="text-text-secondary text-base max-w-lg leading-relaxed">
                  ls技术知识展示 — 嵌入式系统、硬件设计与编程技术
                </p>
                <div className="flex items-center gap-4 mt-6">
                  <Link
                    href="/archive"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent-hover transition-all hover:shadow-lg hover:shadow-accent/20"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                    </svg>
                    浏览文章
                  </Link>
                  <Link
                    href="/tools"
                    className="inline-flex items-center gap-2 px-4 py-2 border border-border text-sm font-medium rounded-lg hover:border-accent hover:text-accent transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.59-5.59a7.5 7.5 0 1110.61-10.6l-.18.18a7.5 7.5 0 01-4.84 12.01z" />
                    </svg>
                    开发工具
                  </Link>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-8 animate-fade-in stagger-2">
                <Link href="/archive" className="group text-center">
                  <div className="text-3xl font-bold font-mono text-accent group-hover:scale-110 transition-transform">
                    {articleCount}
                  </div>
                  <div className="text-xs text-text-tertiary mt-1 font-mono uppercase tracking-wider">Articles</div>
                </Link>
                <Link href="/projects" className="group text-center">
                  <div className="text-3xl font-bold font-mono text-accent group-hover:scale-110 transition-transform">
                    {projectCount}
                  </div>
                  <div className="text-xs text-text-tertiary mt-1 font-mono uppercase tracking-wider">Projects</div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Grid */}
      <div className="p-6 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
          {/* Reading Stats */}
          <div className="md:col-span-2 xl:col-span-3 animate-fade-in stagger-1">
            <ReadingStats />
          </div>

          {/* Clock + Weather row */}
          <div className="animate-fade-in stagger-2"><ClockWidget /></div>
          <div className="animate-fade-in stagger-3"><WeatherWidget /></div>
          <div className="animate-fade-in stagger-4"><CalendarWidget /></div>

          {/* Quick Actions */}
          <div className="animate-fade-in stagger-5"><QuickActions /></div>

          {/* Reading Streak */}
          <div className="animate-fade-in stagger-6"><ReadingStreak /></div>

          {/* Pomodoro */}
          <div className="animate-fade-in stagger-6"><PomodoroWidget /></div>

          {/* Bookmark Bar */}
          <div className="md:col-span-2 xl:col-span-3 animate-fade-in">
            <BookmarkBar />
          </div>

          {/* GitHub Contributions */}
          <div className="md:col-span-2 xl:col-span-3 animate-fade-in">
            <GitHubContributions />
          </div>

          {/* Popular Articles */}
          <div className="md:col-span-2 xl:col-span-3 animate-fade-in">
            <PopularArticles />
          </div>

          {/* Notes */}
          <div className="md:col-span-2 xl:col-span-3 animate-fade-in">
            <NotesWidget />
          </div>
        </div>

        {/* Featured Projects */}
        {projects.length > 0 && (
          <section className="mb-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                <span className="w-1 h-5 bg-accent rounded-full" />
                精选项目
              </h2>
              <Link
                href="/projects"
                className="text-sm text-text-tertiary hover:text-accent transition-colors font-mono"
              >
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {projects.map((project) => {
                const techStack = JSON.parse(project.techStack) as string[];
                return (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="card-elevated block p-5 group"
                  >
                    {project.imageUrl && (
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-32 object-cover rounded-lg mb-4 border border-border-subtle"
                      />
                    )}
                    <h3 className="text-sm font-semibold text-text-primary group-hover:text-accent transition-colors mb-2">
                      {project.title}
                    </h3>
                    <p className="text-xs text-text-tertiary line-clamp-2 mb-4 leading-relaxed">
                      {project.description}
                    </p>
                    {techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {techStack.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 text-[10px] font-mono text-accent bg-accent-subtle rounded-full border border-accent/20"
                          >
                            {tech}
                          </span>
                        ))}
                        {techStack.length > 3 && (
                          <span className="px-2 py-0.5 text-[10px] text-text-tertiary">
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
        <section className="animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
              <span className="w-1 h-5 bg-accent rounded-full" />
              最新文章
            </h2>
            <Link
              href="/archive"
              className="text-sm text-text-tertiary hover:text-accent transition-colors font-mono"
            >
              Archive →
            </Link>
          </div>
          <ArticleList articles={serializedArticles} />
        </section>
      </div>
    </div>
  );
}
