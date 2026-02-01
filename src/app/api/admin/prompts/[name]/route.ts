// app/api/admin/prompts/[name]/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(
  request: Request,
  context: { params: Promise<{ name: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name } = await context.params;

  const prompt = await prisma.promptTemplate.findUnique({
    where: { name },
    include: {
      versions: {
        orderBy: { version: "desc" },
        take: 10,
      },
      experiments: {
        where: { isActive: true },
      },
    },
  });

  if (!prompt) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(prompt);
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ name: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name } = await context.params;

  await prisma.promptTemplate.delete({
    where: { name },
  });

  return NextResponse.json({ success: true });
}