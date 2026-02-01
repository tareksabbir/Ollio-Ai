// modules/prompts/server/procedures.ts
import { PromptManager } from "@/lib/prompt-manager";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import prisma from "@/lib/db";

export const promptsRouter = createTRPCRouter({
  // Get all prompts
  getAll: protectedProcedure.query(async () => {
    return await prisma.promptTemplate.findMany({
      orderBy: { updatedAt: "desc" },
      include: {
        _count: {
          select: { versions: true, experiments: true },
        },
      },
    });
  }),

  // Get single prompt with versions
  getOne: protectedProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ input }) => {
      const prompt = await prisma.promptTemplate.findUnique({
        where: { name: input.name },
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
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Prompt not found",
        });
      }

      return prompt;
    }),

  // Create/Update prompt
  upsert: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        content: z.string(),
        metadata: z.record(z.string(), z.unknown()).optional(),
        description: z.string().optional(),
        category: z.string().optional(),
        tags: z.array(z.string()).optional(),
        changeLog: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await PromptManager.upsertPrompt(input.name, input.content, {
        metadata: input.metadata,
        description: input.description,
        category: input.category,
        tags: input.tags,
        userId: ctx.auth.userId,
        changeLog: input.changeLog,
      });
    }),

  // Delete prompt
  delete: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input }) => {
      await prisma.promptTemplate.delete({
        where: { name: input.name },
      });

      return { success: true };
    }),

  // Get history
  getHistory: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        limit: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      return await PromptManager.getHistory(input.name, input.limit);
    }),

  // Rollback to version
  rollback: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        version: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await PromptManager.rollback(
        input.name,
        input.version,
        ctx.auth.userId
      );
    }),

  // Get analytics
  getAnalytics: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        days: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      return await PromptManager.getAnalytics(input.name, input.days ?? 7);
    }),

  // Create A/B test experiment
  createExperiment: protectedProcedure
    .input(
      z.object({
        templateName: z.string(),
        name: z.string(),
        variant: z.string(),
        content: z.string(),
        trafficPercent: z.number().min(0).max(100),
      })
    )
    .mutation(async ({ input }) => {
      return await PromptManager.createExperiment(input.templateName, {
        name: input.name,
        variant: input.variant,
        content: input.content,
        trafficPercent: input.trafficPercent,
      });
    }),

  // Get all experiments for a prompt
  getExperiments: protectedProcedure
    .input(z.object({ templateName: z.string() }))
    .query(async ({ input }) => {
      const template = await prisma.promptTemplate.findUnique({
        where: { name: input.templateName },
      });

      if (!template) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Template not found",
        });
      }

      return await prisma.promptExperiment.findMany({
        where: { templateId: template.id },
        orderBy: { createdAt: "desc" },
      });
    }),

  // Toggle experiment active status
  toggleExperiment: protectedProcedure
    .input(
      z.object({
        experimentId: z.string(),
        isActive: z.boolean(),
      })
    )
    .mutation(async ({ input }) => {
      return await prisma.promptExperiment.update({
        where: { id: input.experimentId },
        data: { isActive: input.isActive },
      });
    }),
});