import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const siteUrl = "https://lslff-embedded-ntc.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, projects] = await Promise.all([
    prisma.article.findMany({
      where: { isPublished: true },
      select: { id: true, updatedAt: true },
    }),
    prisma.project.findMany({
      where: { isPublished: true },
      select: { id: true, updatedAt: true },
    }),
  ]);

  const staticPages = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1 },
    { url: `${siteUrl}/about`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${siteUrl}/projects`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${siteUrl}/archive`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${siteUrl}/links`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${siteUrl}/changelog`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
  ];

  const articlePages = articles.map((a) => ({
    url: `${siteUrl}/?expand=${a.id}`,
    lastModified: new Date(a.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const projectPages = projects.map((p) => ({
    url: `${siteUrl}/projects/${p.id}`,
    lastModified: new Date(p.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...articlePages, ...projectPages];
}
