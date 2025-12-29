import prisma from "@/lib/db";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import z from "zod";

export const fragmentsRouter = createTRPCRouter({
  update: baseProcedure
    .input(
      z.object({
        fragmentId: z.string().min(1, {
          message: "Fragment ID is required",
        }),
        files: z.record(z.string(), z.string()),
      })
    )
    .mutation(async ({ input }) => {
      const existingFragment = await prisma.fragment.findUnique({
        where: {
          id: input.fragmentId,
        },
      });

      if (!existingFragment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Fragment not found",
        });
      }

      const updatedFragment = await prisma.fragment.update({
        where: {
          id: input.fragmentId,
        },
        data: {
          files: input.files,
          updatedAt: new Date(),
        },
      });

      return updatedFragment;
    }),

  getOne: baseProcedure
    .input(
      z.object({
        fragmentId: z.string().min(1, {
          message: "Fragment ID is required",
        }),
      })
    )
    .query(async ({ input }) => {
      const fragment = await prisma.fragment.findUnique({
        where: {
          id: input.fragmentId,
        },
        include: {
          message: true,
        },
      });

      if (!fragment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Fragment not found",
        });
      }

      return fragment;
    }),
});