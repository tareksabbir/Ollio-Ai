import z from "zod";
import { protectedProcedure, createTRPCRouter } from "@/trpc/init";
import { Sandbox } from "@e2b/code-interpreter";
import prisma from "@/lib/db";
import { TRPCError } from "@trpc/server";

export const sandboxRouter = createTRPCRouter({
  restore: protectedProcedure
    .input(
      z.object({
        fragmentId: z.string().min(1, { message: "Fragment ID is required" }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { fragmentId } = input;

      // Fragment খুঁজে বের করো এবং verify করো
      const fragment = await prisma.fragment.findUnique({
        where: { id: fragmentId },
        include: {
          message: {
            include: {
              project: true,
            },
          },
        },
      });

      if (!fragment || !fragment.files) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Fragment not found or has no files",
        });
      }

      // Check করো fragment টা এই user এর কিনা
      if (fragment.message?.project?.userId !== ctx.auth.userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to restore this sandbox",
        });
      }

      const files = fragment.files as Record<string, string>;

      // নতুন Sandbox তৈরি করা
      const sandbox = await Sandbox.create("ollio-ai");

      // ফাইলগুলো Sandbox এ লেখা
      for (const [path, content] of Object.entries(files)) {
        await sandbox.files.write(path, content);
      }

      // Dependencies ইনস্টল করা
      if (files["package.json"]) {
        try {
          await sandbox.commands.run("npm install");
        } catch (e) {
          console.error("NPM install failed:", e);
        }
      }

      // Dev Server চালু করা
      await sandbox.commands.run("npm run dev", { background: true });

      // URL জেনারেট ও ডাটাবেস আপডেট
      const host = sandbox.getHost(3000);
      const newUrl = `https://${host}`;
      const newSandboxId = sandbox.sandboxId;

      await prisma.fragment.update({
        where: { id: fragmentId },
        data: {
          sandboxUrl: newUrl,
          sandboxId: newSandboxId,
        },
      });

      return { url: newUrl, sandboxId: newSandboxId };
    }),

  ping: protectedProcedure
    .input(
      z.object({
        sandboxId: z.string().min(1, { message: "Sandbox ID is required" }),
      })
    )
    .mutation(async ({ input }) => {
      const { sandboxId } = input;

      try {
        const sandbox = await Sandbox.connect(sandboxId);
        await sandbox.commands.run("echo 'ping'");
        return { success: true };
      } catch (error) {
        console.error("Ping failed:", error);
        return { success: false };
      }
    }),
});
