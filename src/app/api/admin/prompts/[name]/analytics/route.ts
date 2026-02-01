// app/api/admin/prompts/[name]/analytics/route.ts
import { PromptManager } from "@/lib/prompt-manager";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: Promise<{ name: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name } = await context.params;
  const { searchParams } = new URL(request.url);
  const days = parseInt(searchParams.get("days") || "7");

  const analytics = await PromptManager.getAnalytics(name, days);
  return NextResponse.json(analytics);
}


