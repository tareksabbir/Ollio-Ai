import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { z } from "zod";
import prisma from "@/lib/db";

export const htmlCodeRouter = createTRPCRouter({
  // Get all projects (Public)
  getMany: baseProcedure.query(async () => {
    return await prisma.htmlCode.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });
  }),

  // Create/Upload a new project (Protected - assuming you want auth)
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        category: z.string().min(1),
        image: z.string().url(), // Assuming you pass a URL
        code: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      return await prisma.htmlCode.create({
        data: {
          title: input.title,
          category: input.category,
          image: input.image,
          code: input.code,
        },
      });
    }),
});
