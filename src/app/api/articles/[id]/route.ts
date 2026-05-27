import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const runtime = 'edge';

interface ArticleParams {
  params: Promise<{ id: string }>;
}

// GET: Fetch a single article
export async function GET(request: NextRequest, { params }: ArticleParams) {
  try {
    const { id } = await params;
    const session = await getSession();

    const article = await prisma.article.findUnique({
      where: { id },
    });

    if (!article) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      );
    }

    // Only allow access to unpublished articles for authenticated users
    if (!article.isPublished && !session) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error("Fetch article error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT: Update an article
export async function PUT(request: NextRequest, { params }: ArticleParams) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { title, content, category, tags, isPublished } = await request.json();

    const article = await prisma.article.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(category !== undefined && { category }),
        ...(tags !== undefined && { tags: JSON.stringify(tags) }),
        ...(isPublished !== undefined && { isPublished }),
      },
    });

    return NextResponse.json(article);
  } catch (error) {
    console.error("Update article error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE: Delete an article
export async function DELETE(request: NextRequest, { params }: ArticleParams) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await prisma.article.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete article error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
