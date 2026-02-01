// app/api/admin/prompts/route.ts
import { PromptManager } from "@/lib/prompt-manager";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const prompts = await prisma.promptTemplate.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      _count: {
        select: { versions: true, experiments: true },
      },
    },
  });

  return NextResponse.json(prompts);
}

interface PromptCreateBody {
  name: string;
  content: string;
  metadata?: Record<string, unknown>;
  description?: string;
  category?: string;
  tags?: string[];
  changeLog?: string;
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as PromptCreateBody;
  const { name, content, metadata, description, category, tags, changeLog } =
    body;

  const updated = await PromptManager.upsertPrompt(name, content, {
    metadata,
    description,
    category,
    tags,
    userId,
    changeLog,
  });

  return NextResponse.json(updated);
}