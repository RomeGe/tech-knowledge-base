import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "项目 - 技术知识库",
  description: "精选项目与工程作品展示。",
};

type ProjectItem = {
  id: string;
  title: string;
  description: string;
  techStack: string;
  imageUrl: string | null;
};

export default async function ProjectsPage() {
  const projects: ProjectItem[] = await prisma.project.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      description: true,
      techStack: true,
      imageUrl: true,
    },
  });

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <header className="mb-12">
        <h1 className="text-3xl font-semibold tracking-tight text-text-primary">
          项目
        </h1>
        <p className="mt-3 text-text-secondary">
          精选项目与工程作品展示
        </p>
      </header>

      {projects.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-text-tertiary">暂无项目</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => {
            const techStack = JSON.parse(project.techStack) as string[];
            return (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="block p-5 border border-border rounded-lg hover:border-accent/30 hover:bg-surface-hover transition-all group"
              >
                {project.imageUrl && (
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-36 object-cover rounded mb-4 border border-border-subtle"
                  />
                )}
                <h2 className="text-base font-medium text-text-primary group-hover:text-accent transition-colors mb-1.5">
                  {project.title}
                </h2>
                <p className="text-sm text-text-secondary mb-4 line-clamp-2">
                  {project.description}
                </p>
                {techStack.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 text-[11px] text-text-tertiary bg-muted rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
