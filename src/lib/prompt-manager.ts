// lib/prompt-manager.ts
import prisma from "@/lib/db";
import { Prisma } from "@/generated/prisma/client";

interface CachedPrompt {
  content: string;
  metadata: Prisma.JsonValue | null;
  version: number;
  timestamp: number;
}

interface PromptResponse {
  content: string;
  metadata: Prisma.JsonValue | null;
  version: number;
  variant?: string;
}

interface GetPromptOptions {
  userId?: string;
  projectId?: string;
  variant?: string;
}

interface UpsertPromptOptions {
  metadata?: Record<string, unknown>;
  description?: string;
  category?: string;
  tags?: string[];
  userId?: string;
  changeLog?: string;
}

interface CreateExperimentData {
  name: string;
  variant: string;
  content: string;
  trafficPercent: number;
}

interface AnalyticsResult {
  total: number;
  successful: number;
  failed: number;
  successRate: number;
  avgLatency: number;
}

export class PromptManager {
  private static cache = new Map<string, CachedPrompt>();
  private static CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  static async getPrompt(
    name: string,
    options?: GetPromptOptions
  ): Promise<PromptResponse> {
    const startTime = Date.now();

    try {
      // Check cache
      const cached = this.getCached(name);
      if (cached) {
        return {
          content: cached.content,
          metadata: cached.metadata,
          version: cached.version,
        };
      }

      // Get main template
      const template = await prisma.promptTemplate.findFirst({
        where: {
          name,
          isActive: true,
        },
        orderBy: {
          version: "desc",
        },
      });

      if (!template) {
        throw new Error(`Prompt template '${name}' not found`);
      }

      // Cache it
      this.setCache(name, {
        content: template.content,
        metadata: template.metadata,
        version: template.version,
        timestamp: Date.now(),
      });

      // Log usage (async)
      this.logUsage(name, template.version, startTime, true, options).catch(
        console.error
      );

      return {
        content: template.content,
        metadata: template.metadata,
        version: template.version,
      };
    } catch (error) {
      await this.logUsage(
        name,
        0,
        startTime,
        false,
        options,
        error instanceof Error ? error.message : "Unknown error"
      );
      throw error;
    }
  }

  private static getCached(name: string): CachedPrompt | null {
    const cached = this.cache.get(name);
    if (!cached) return null;

    const age = Date.now() - cached.timestamp;
    if (age > this.CACHE_TTL) {
      this.cache.delete(name);
      return null;
    }

    return cached;
  }

  private static setCache(name: string, data: CachedPrompt): void {
    this.cache.set(name, data);
  }

  private static async logUsage(
    promptName: string,
    version: number,
    startTime: number,
    success: boolean,
    options?: GetPromptOptions,
    error?: string
  ): Promise<void> {
    try {
      const latency = Date.now() - startTime;

      await prisma.promptLog.create({
        data: {
          templateId: promptName,
          promptName,
          version,
          variant: options?.variant || null,
          latency,
          success,
          error: error || null,
          projectId: options?.projectId || null,
          userId: options?.userId || null,
        },
      });
    } catch (err) {
      console.error("Failed to log prompt usage:", err);
    }
  }

  static async upsertPrompt(
    name: string,
    content: string,
    options?: UpsertPromptOptions
  ) {
    const existing = await prisma.promptTemplate.findUnique({
      where: { name },
    });

    if (existing) {
      // Create version history
      await prisma.promptVersion.create({
        data: {
          templateId: existing.id,
          version: existing.version,
          content: existing.content,
          metadata: existing.metadata as Prisma.InputJsonValue,
          changeLog: options?.changeLog || null,
          createdBy: options?.userId || null,
        },
      });

      // Update main template
      const updated = await prisma.promptTemplate.update({
        where: { name },
        data: {
          content,
          version: { increment: 1 },
          metadata: options?.metadata as Prisma.InputJsonValue,
          description: options?.description || null,
          tags: options?.tags || undefined,
          updatedAt: new Date(),
          createdBy: options?.userId || null,
        },
      });

      // Clear cache
      this.cache.delete(name);

      return updated;
    } else {
      // Create new
      return await prisma.promptTemplate.create({
        data: {
          name,
          content,
          metadata: options?.metadata as Prisma.InputJsonValue,
          description: options?.description || null,
          category: options?.category || "system",
          tags: options?.tags || [],
          createdBy: options?.userId || null,
        },
      });
    }
  }

  static async getHistory(name: string, limit = 10) {
    try {
      const template = await prisma.promptTemplate.findUnique({
        where: { name },
      });

      if (!template) return [];

      return await prisma.promptVersion.findMany({
        where: { templateId: template.id },
        orderBy: { version: "desc" },
        take: limit,
      });
    } catch (error) {
      console.error("Error in PromptManager.getHistory:", error);
      throw error;
    }
  }

  static async rollback(name: string, version: number, userId?: string) {
    const template = await prisma.promptTemplate.findUnique({
      where: { name },
    });

    if (!template) {
      throw new Error(`Template '${name}' not found`);
    }

    const targetVersion = await prisma.promptVersion.findUnique({
      where: {
        templateId_version: {
          templateId: template.id,
          version: version,
        },
      },
    });

    if (!targetVersion) {
      throw new Error(`Version ${version} not found`);
    }

    return await this.upsertPrompt(name, targetVersion.content, {
      metadata: targetVersion.metadata as Record<string, unknown>,
      userId,
      changeLog: `Rolled back to version ${version}`,
    });
  }

  static async createExperiment(
    templateName: string,
    data: CreateExperimentData
  ) {
    const template = await prisma.promptTemplate.findUnique({
      where: { name: templateName },
    });

    if (!template) {
      throw new Error(`Template '${templateName}' not found`);
    }

    return await prisma.promptExperiment.create({
      data: {
        templateId: template.id,
        name: data.name,
        variant: data.variant,
        content: data.content,
        trafficPercent: data.trafficPercent,
        isActive: true,
      },
    });
  }

  static async getAnalytics(name: string, days = 7): Promise<AnalyticsResult> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const logs = await prisma.promptLog.findMany({
        where: {
          promptName: name,
          createdAt: { gte: startDate },
        },
      });

      const total = logs.length;
      const successful = logs.filter((l) => l.success).length;
      const avgLatency =
        logs.reduce((sum, l) => sum + l.latency, 0) / total || 0;

      return {
        total,
        successful,
        failed: total - successful,
        successRate: total > 0 ? (successful / total) * 100 : 0,
        avgLatency: Math.round(avgLatency),
      };
    } catch (error) {
      console.error("Error in PromptManager.getAnalytics:", error);
      throw error;
    }
  }
}

export default PromptManager;