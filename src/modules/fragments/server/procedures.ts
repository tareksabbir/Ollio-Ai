import prisma from "@/lib/db";
import { protectedProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import z from "zod";

export const fragmentsRouter = createTRPCRouter({
  update: protectedProcedure
    .input(
      z.object({
        fragmentId: z.string().min(1, {
          message: "Fragment ID is required",
        }),
        files: z.record(z.string(), z.string()),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Fragment খুঁজে বের করো এবং verify করো যে এটা এই user এর
      const existingFragment = await prisma.fragment.findUnique({
        where: {
          id: input.fragmentId,
        },
        include: {
          message: {
            include: {
              projet: true, // project এর মাধ্যমে userId চেক করবো
            },
          },
        },
      });

      if (!existingFragment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Fragment not found",
        });
      }

      // Check করো fragment টা এই user এর কিনা
      if (existingFragment.message?.projet?.userId !== ctx.auth.userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to update this fragment",
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

  getOne: protectedProcedure
    .input(
      z.object({
        fragmentId: z.string().min(1, {
          message: "Fragment ID is required",
        }),
      })
    )
    .query(async ({ input, ctx }) => {
      const fragment = await prisma.fragment.findUnique({
        where: {
          id: input.fragmentId,
        },
        include: {
          message: {
            include: {
              projet: true,
            },
          },
        },
      });

      if (!fragment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Fragment not found",
        });
      }

      // Check করো fragment টা এই user এর কিনা
      if (fragment.message?.projet?.userId !== ctx.auth.userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to access this fragment",
        });
      }

      return fragment;
    }),
});