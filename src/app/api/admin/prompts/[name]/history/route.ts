// app/api/admin/prompts/[name]/history/route.ts
import { PromptManager } from "@/lib/prompt-manager";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function GET(
  request: Request,
  context: { params: Promise<{ name: string; }> }
) {
  const resolvedParams = await context.params;
  const { name } = resolvedParams;
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const history = await PromptManager.getHistory(name, 20);
  return NextResponse.json(history);
}