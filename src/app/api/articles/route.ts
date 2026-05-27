import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const runtime = 'edge';

// GET: Fetch all articles (admin) or published articles (public)
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    const { searchParams } = new URL(request.url);
    const admin = searchParams.get("admin") === "true";

    if (admin && !session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const where = admin ? {} : { isPublished: true };
    const articles = await prisma.article.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(articles);
  } catch (error) {
    console.error("Fetch articles error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST: Create a new article
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { title, content, category, tags } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const article = await prisma.article.create({
      data: {
        title,
        content,
        category: category || "uncategorized",
        tags: tags ? JSON.stringify(tags) : "[]",
      },
    });

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error("Create article error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
