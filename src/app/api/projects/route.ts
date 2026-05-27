import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const runtime = 'edge';

// GET: Fetch all projects (admin) or published projects (public)
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
    const projects = await prisma.project.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Fetch projects error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST: Create a new project
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { title, description, content, techStack, githubUrl, liveUrl, imageUrl } = await request.json();

    if (!title || !description || !content) {
      return NextResponse.json(
        { error: "Title, description and content are required" },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        content,
        techStack: techStack ? JSON.stringify(techStack) : "[]",
        githubUrl,
        liveUrl,
        imageUrl,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Create project error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
