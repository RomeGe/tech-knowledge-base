import { prisma } from "@/lib/prisma";

const siteUrl = "https://lslff-embedded-ntc.vercel.app";

export async function GET() {
  const articles = await prisma.article.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
    take: 20,
    select: {
      id: true,
      title: true,
      content: true,
      category: true,
      createdAt: true,
    },
  });

  const items = articles
    .map(
      (a) => `
    <item>
      <title><![CDATA[${a.title}]]></title>
      <link>${siteUrl}/?expand=${a.id}</link>
      <guid isPermaLink="false">${a.id}</guid>
      <pubDate>${new Date(a.createdAt).toUTCString()}</pubDate>
      <category>${a.category}</category>
      <description><![CDATA[${a.content.slice(0, 200)}...]]></description>
    </item>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Tech.KB - 个人技术知识库</title>
    <link>${siteUrl}</link>
    <description>个人技术知识库，记录嵌入式系统、硬件设计、编程技术的文章与项目经验。</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
