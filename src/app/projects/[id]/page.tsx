import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { prisma } from "@/lib/prisma";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id },
    select: { title: true, description: true },
  });

  if (!project) {
    return { title: "项目未找到" };
  }

  return {
    title: `${project.title} - 技术知识库`,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id, isPublished: true },
  });

  if (!project) {
    notFound();
  }

  const techStack = JSON.parse(project.techStack) as string[];

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-sm text-text-tertiary hover:text-text-primary transition-colors mb-8"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
          />
        </svg>
        返回项目列表
      </Link>

      <article>
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-text-primary">
            {project.title}
          </h1>
          <p className="mt-3 text-text-secondary">{project.description}</p>

          {techStack.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="inline-block px-2 py-1 text-xs text-text-tertiary bg-muted rounded"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}

          <div className="mt-6 flex gap-4">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-accent hover:text-accent-hover transition-colors"
              >
                GitHub
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-accent hover:text-accent-hover transition-colors"
              >
                在线演示
              </a>
            )}
          </div>
        </header>

        {project.imageUrl && (
          <div className="mb-8">
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full rounded-lg border border-border object-cover"
            />
          </div>
        )}

        <div className="prose prose-sm max-w-none text-text-secondary">
          <ReactMarkdown>{project.content}</ReactMarkdown>
        </div>
      </article>
    </div>
  );
}
