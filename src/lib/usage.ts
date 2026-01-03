import { RateLimiterPrisma } from "rate-limiter-flexible";
import prisma from "./db";
import { auth } from "@clerk/nextjs/server";

const FREE_POINTS = 5;
const DURATION = 30 * 24 * 60 * 60; // 30 days
// const PRO_PLAN = 100;
// const TEAM_PLAN = 300;
// const ENTERPRISE_PLAN = 1000;
const GENERATION_COST = 1;

export async function getUsageTracker() {
  //   const { has } = await auth();

  // Check plan access (FIXED: correct plan names)
  //   const hasProAccess = has({ plan: "pro_plan" }); // ✅ Fixed typo
  //   const hasTeamAccess = has({ plan: "team_plan" }); // ✅ Fixed typo
  //   const hasEnterpriseAccess = has({ plan: "enterprise_plan" }); // ✅ Fixed typo

  // Determine points based on plan (check from highest to lowest)
  //   let points = FREE_POINTS;
  //   if (hasEnterpriseAccess) {
  //     points = ENTERPRISE_PLAN;
  //   } else if (hasTeamAccess) {
  //     points = TEAM_PLAN;
  //   } else if (hasProAccess) {
  //     points = PRO_PLAN;
  //   }

  const usageTracker = new RateLimiterPrisma({
    storeClient: prisma,
    tableName: "Usage",
    points: FREE_POINTS,
    duration: DURATION,
  });

  return usageTracker;
}

export async function consumeCredits() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const usageTracker = await getUsageTracker();

  const result = await usageTracker.consume(userId, GENERATION_COST);
  return result;
}

export async function getUsageStatus() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const usageTracker = await getUsageTracker();
  const result = await usageTracker.get(userId);

  return result;
}
