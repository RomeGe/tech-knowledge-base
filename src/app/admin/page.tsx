"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MarkdownEditor } from "@/components/markdown-editor";

interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  content: string;
  techStack: string;
  githubUrl: string | null;
  liveUrl: string | null;
  imageUrl: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

type Tab = "articles" | "projects";

export default function AdminPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("articles");
  const [loading, setLoading] = useState(true);

  // Article state
  const [articles, setArticles] = useState<Article[]>([]);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [isCreatingArticle, setIsCreatingArticle] = useState(false);
  const [articleTitle, setArticleTitle] = useState("");
  const [articleContent, setArticleContent] = useState("");
  const [articleCategory, setArticleCategory] = useState("未分类");
  const [articleTags, setArticleTags] = useState("");

  // Project state
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectContent, setProjectContent] = useState("");
  const [projectTechStack, setProjectTechStack] = useState("");
  const [projectGithubUrl, setProjectGithubUrl] = useState("");
  const [projectLiveUrl, setProjectLiveUrl] = useState("");
  const [projectImageUrl, setProjectImageUrl] = useState("");

  useEffect(() => {
    fetchArticles();
    fetchProjects();
  }, []);

  // ─── Article CRUD ───

  const fetchArticles = async () => {
    try {
      const response = await fetch("/api/articles?admin=true");
      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await response.json();
      setArticles(data);
    } catch (error) {
      console.error("获取文章失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateArticle = async () => {
    if (!articleTitle || !articleContent) return;
    const tags = articleTags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    try {
      const response = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: articleTitle,
          content: articleContent,
          category: articleCategory,
          tags,
        }),
      });
      if (response.ok) {
        resetArticleForm();
        fetchArticles();
      }
    } catch (error) {
      console.error("创建文章失败:", error);
    }
  };

  const handleUpdateArticle = async (id: string) => {
    const tags = articleTags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    try {
      const response = await fetch(`/api/articles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: articleTitle,
          content: articleContent,
          category: articleCategory,
          tags,
        }),
      });
      if (response.ok) {
        resetArticleForm();
        fetchArticles();
      }
    } catch (error) {
      console.error("更新文章失败:", error);
    }
  };

  const handleTogglePublishArticle = async (id: string, current: boolean) => {
    try {
      const response = await fetch(`/api/articles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !current }),
      });
      if (response.ok) fetchArticles();
    } catch (error) {
      console.error("切换发布状态失败:", error);
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (!confirm("确定要删除这篇文章吗？")) return;
    try {
      const response = await fetch(`/api/articles/${id}`, { method: "DELETE" });
      if (response.ok) fetchArticles();
    } catch (error) {
      console.error("删除文章失败:", error);
    }
  };

  const startEditingArticle = (article: Article) => {
    setEditingArticleId(article.id);
    setArticleTitle(article.title);
    setArticleContent(article.content);
    setArticleCategory(article.category);
    let tags: string[] = [];
    try {
      tags = JSON.parse(article.tags);
    } catch {}
    setArticleTags(tags.join(", "));
    setIsCreatingArticle(false);
  };

  const resetArticleForm = () => {
    setEditingArticleId(null);
    setIsCreatingArticle(false);
    setArticleTitle("");
    setArticleContent("");
    setArticleCategory("未分类");
    setArticleTags("");
  };

  // ─── Project CRUD ───

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects?admin=true");
      if (response.status === 401) return;
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("获取项目失败:", error);
    }
  };

  const handleCreateProject = async () => {
    if (!projectTitle || !projectDescription || !projectContent) return;
    const techStack = projectTechStack
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: projectTitle,
          description: projectDescription,
          content: projectContent,
          techStack,
          githubUrl: projectGithubUrl || null,
          liveUrl: projectLiveUrl || null,
          imageUrl: projectImageUrl || null,
        }),
      });
      if (response.ok) {
        resetProjectForm();
        fetchProjects();
      }
    } catch (error) {
      console.error("创建项目失败:", error);
    }
  };

  const handleUpdateProject = async (id: string) => {
    const techStack = projectTechStack
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: projectTitle,
          description: projectDescription,
          content: projectContent,
          techStack,
          githubUrl: projectGithubUrl || null,
          liveUrl: projectLiveUrl || null,
          imageUrl: projectImageUrl || null,
        }),
      });
      if (response.ok) {
        resetProjectForm();
        fetchProjects();
      }
    } catch (error) {
      console.error("更新项目失败:", error);
    }
  };

  const handleTogglePublishProject = async (id: string, current: boolean) => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !current }),
      });
      if (response.ok) fetchProjects();
    } catch (error) {
      console.error("切换发布状态失败:", error);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("确定要删除这个项目吗？")) return;
    try {
      const response = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (response.ok) fetchProjects();
    } catch (error) {
      console.error("删除项目失败:", error);
    }
  };

  const startEditingProject = (project: Project) => {
    setEditingProjectId(project.id);
    setProjectTitle(project.title);
    setProjectDescription(project.description);
    setProjectContent(project.content);
    let techStack: string[] = [];
    try {
      techStack = JSON.parse(project.techStack);
    } catch {}
    setProjectTechStack(techStack.join(", "));
    setProjectGithubUrl(project.githubUrl || "");
    setProjectLiveUrl(project.liveUrl || "");
    setProjectImageUrl(project.imageUrl || "");
    setIsCreatingProject(false);
  };

  const resetProjectForm = () => {
    setEditingProjectId(null);
    setIsCreatingProject(false);
    setProjectTitle("");
    setProjectDescription("");
    setProjectContent("");
    setProjectTechStack("");
    setProjectGithubUrl("");
    setProjectLiveUrl("");
    setProjectImageUrl("");
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-10">
        <p className="text-text-tertiary">加载中...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-text-primary">
          管理面板
        </h1>
        <button
          onClick={handleLogout}
          className="text-sm text-text-tertiary hover:text-text-primary transition-colors"
        >
          退出登录
        </button>
      </header>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-border mb-8">
        <button
          onClick={() => setTab("articles")}
          className={`pb-3 text-sm transition-colors border-b-2 ${
            tab === "articles"
              ? "border-accent text-text-primary font-medium"
              : "border-transparent text-text-tertiary hover:text-text-secondary"
          }`}
        >
          文章管理
        </button>
        <button
          onClick={() => setTab("projects")}
          className={`pb-3 text-sm transition-colors border-b-2 ${
            tab === "projects"
              ? "border-accent text-text-primary font-medium"
              : "border-transparent text-text-tertiary hover:text-text-secondary"
          }`}
        >
          项目管理
        </button>
      </div>

      {/* ─── Articles Tab ─── */}
      {tab === "articles" && (
        <>
          <section className="mb-12">
            {!isCreatingArticle && !editingArticleId && (
              <button
                onClick={() => setIsCreatingArticle(true)}
                className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors"
              >
                新建文章
              </button>
            )}

            {(isCreatingArticle || editingArticleId) && (
              <div className="border border-border rounded-lg p-6 bg-surface">
                <h2 className="text-lg font-medium text-text-primary mb-4">
                  {editingArticleId ? "编辑文章" : "新建文章"}
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-text-secondary mb-1">
                      标题
                    </label>
                    <input
                      type="text"
                      value={articleTitle}
                      onChange={(e) => setArticleTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-text-secondary mb-1">
                      分类
                    </label>
                    <input
                      type="text"
                      value={articleCategory}
                      onChange={(e) => setArticleCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-text-secondary mb-1">
                      标签（逗号分隔）
                    </label>
                    <input
                      type="text"
                      value={articleTags}
                      onChange={(e) => setArticleTags(e.target.value)}
                      placeholder="嵌入式, STM32, FreeRTOS"
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-text-secondary mb-1">
                      内容（Markdown）
                    </label>
                    <MarkdownEditor
                      value={articleContent}
                      onChange={setArticleContent}
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={
                        editingArticleId
                          ? () => handleUpdateArticle(editingArticleId)
                          : handleCreateArticle
                      }
                      className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors"
                    >
                      {editingArticleId ? "更新" : "创建"}
                    </button>
                    <button
                      onClick={resetArticleForm}
                      className="px-4 py-2 border border-border text-text-secondary rounded-lg hover:bg-surface-hover transition-colors"
                    >
                      取消
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>

          <section>
            <h2 className="text-xl font-medium text-text-primary mb-6">
              文章列表
            </h2>
            {articles.length === 0 ? (
              <p className="text-text-tertiary">暂无文章</p>
            ) : (
              <div className="space-y-0">
                {articles.map((article) => {
                  let tags: string[] = [];
                  try {
                    tags = JSON.parse(article.tags);
                  } catch {}
                  return (
                    <div
                      key={article.id}
                      className="flex items-center justify-between py-4 border-b border-border-subtle last:border-0"
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-text-primary truncate">
                          {article.title}
                        </h3>
                        <p className="text-xs text-text-tertiary mt-1">
                          {article.category}
                          {tags.length > 0 && (
                            <span> · {tags.join(", ")}</span>
                          )}
                          {" · "}
                          {article.isPublished ? (
                            <span className="text-green-600">已发布</span>
                          ) : (
                            <span className="text-yellow-600">草稿</span>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() =>
                            handleTogglePublishArticle(
                              article.id,
                              article.isPublished
                            )
                          }
                          className="px-3 py-1 text-xs border border-border rounded hover:bg-surface-hover transition-colors"
                        >
                          {article.isPublished ? "取消发布" : "发布"}
                        </button>
                        <button
                          onClick={() => startEditingArticle(article)}
                          className="px-3 py-1 text-xs border border-border rounded hover:bg-surface-hover transition-colors"
                        >
                          编辑
                        </button>
                        <button
                          onClick={() => handleDeleteArticle(article.id)}
                          className="px-3 py-1 text-xs border border-red-200 text-red-600 rounded hover:bg-red-50 transition-colors"
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </>
      )}

      {/* ─── Projects Tab ─── */}
      {tab === "projects" && (
        <>
          <section className="mb-12">
            {!isCreatingProject && !editingProjectId && (
              <button
                onClick={() => setIsCreatingProject(true)}
                className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors"
              >
                新建项目
              </button>
            )}

            {(isCreatingProject || editingProjectId) && (
              <div className="border border-border rounded-lg p-6 bg-surface">
                <h2 className="text-lg font-medium text-text-primary mb-4">
                  {editingProjectId ? "编辑项目" : "新建项目"}
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-text-secondary mb-1">
                      标题
                    </label>
                    <input
                      type="text"
                      value={projectTitle}
                      onChange={(e) => setProjectTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-text-secondary mb-1">
                      简介
                    </label>
                    <input
                      type="text"
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-text-secondary mb-1">
                      技术栈（逗号分隔）
                    </label>
                    <input
                      type="text"
                      value={projectTechStack}
                      onChange={(e) => setProjectTechStack(e.target.value)}
                      placeholder="Next.js, Tailwind CSS, Prisma"
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-text-secondary mb-1">
                        GitHub URL
                      </label>
                      <input
                        type="text"
                        value={projectGithubUrl}
                        onChange={(e) => setProjectGithubUrl(e.target.value)}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-text-secondary mb-1">
                        在线演示 URL
                      </label>
                      <input
                        type="text"
                        value={projectLiveUrl}
                        onChange={(e) => setProjectLiveUrl(e.target.value)}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-text-secondary mb-1">
                        封面图片 URL
                      </label>
                      <input
                        type="text"
                        value={projectImageUrl}
                        onChange={(e) => setProjectImageUrl(e.target.value)}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-text-secondary mb-1">
                      详情内容（Markdown）
                    </label>
                    <MarkdownEditor
                      value={projectContent}
                      onChange={setProjectContent}
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={
                        editingProjectId
                          ? () => handleUpdateProject(editingProjectId)
                          : handleCreateProject
                      }
                      className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors"
                    >
                      {editingProjectId ? "更新" : "创建"}
                    </button>
                    <button
                      onClick={resetProjectForm}
                      className="px-4 py-2 border border-border text-text-secondary rounded-lg hover:bg-surface-hover transition-colors"
                    >
                      取消
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>

          <section>
            <h2 className="text-xl font-medium text-text-primary mb-6">
              项目列表
            </h2>
            {projects.length === 0 ? (
              <p className="text-text-tertiary">暂无项目</p>
            ) : (
              <div className="space-y-0">
                {projects.map((project) => {
                  let techStack: string[] = [];
                  try {
                    techStack = JSON.parse(project.techStack);
                  } catch {}
                  return (
                    <div
                      key={project.id}
                      className="flex items-center justify-between py-4 border-b border-border-subtle last:border-0"
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-text-primary truncate">
                          {project.title}
                        </h3>
                        <p className="text-xs text-text-tertiary mt-1">
                          {techStack.length > 0 && (
                            <span>{techStack.join(", ")} · </span>
                          )}
                          {project.isPublished ? (
                            <span className="text-green-600">已发布</span>
                          ) : (
                            <span className="text-yellow-600">草稿</span>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() =>
                            handleTogglePublishProject(
                              project.id,
                              project.isPublished
                            )
                          }
                          className="px-3 py-1 text-xs border border-border rounded hover:bg-surface-hover transition-colors"
                        >
                          {project.isPublished ? "取消发布" : "发布"}
                        </button>
                        <button
                          onClick={() => startEditingProject(project)}
                          className="px-3 py-1 text-xs border border-border rounded hover:bg-surface-hover transition-colors"
                        >
                          编辑
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="px-3 py-1 text-xs border border-red-200 text-red-600 rounded hover:bg-red-50 transition-colors"
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
