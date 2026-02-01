// app/api/admin/prompts/[name]/experiments/route.ts
import { PromptManager } from "@/lib/prompt-manager";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

interface ExperimentBody {
  name: string;
  variant: string;
  content: string;
  trafficPercent: number;
}

export async function POST(
  request: Request,
  context: { params: Promise<{ name: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name } = await context.params;
  const body = (await request.json()) as ExperimentBody;
  const experiment = await PromptManager.createExperiment(name, body);

  return NextResponse.json(experiment);
}