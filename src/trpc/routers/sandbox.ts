// sandbox.ts
import z from "zod";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { Sandbox } from "@e2b/code-interpreter";
import prisma from "@/lib/db";

export const sandboxRouter = createTRPCRouter({
  // Restore Sandbox Mutation
  restore: baseProcedure
    .input(
      z.object({
        fragmentId: z.string().min(1, { message: "Fragment ID is required" }),
      })
    )
    .mutation(async ({ input }) => {
      const { fragmentId } = input;

      // 1. Database থেকে Fragment খুঁজে বের করা
      const fragment = await prisma.fragment.findUnique({
        where: { id: fragmentId },
      });

      if (!fragment || !fragment.files) {
        throw new Error("Fragment not found or has no files");
      }

      const files = fragment.files as Record<string, string>;

      // 2. নতুন Sandbox তৈরি করা
      const sandbox = await Sandbox.create("ollio-ai");

      // 3. ফাইলগুলো Sandbox এ লেখা
      for (const [path, content] of Object.entries(files)) {
        await sandbox.files.write(path, content);
      }

      // 4. Dependencies ইনস্টল করা (যদি থাকে)
      if (files["package.json"]) {
        try {
          await sandbox.commands.run("npm install");
        } catch (e) {
          console.error("NPM install failed:", e);
        }
      }

      // 5. Dev Server চালু করা
      await sandbox.commands.run("npm run dev", { background: true });

      // 6. URL জেনারেট ও ডাটাবেস আপডেট
      const host = sandbox.getHost(3000);
      const newUrl = `https://${host}`;
      const newSandboxId = sandbox.sandboxId;

      await prisma.fragment.update({
        where: { id: fragmentId },
        data: { sandboxUrl: newUrl },
      });

      return { url: newUrl, sandboxId: newSandboxId };
    }),

  // Ping Sandbox Mutation (Keep Alive)
  ping: baseProcedure
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
        // পিং ফেইল করলেও আমরা এরর থ্রো করব না, যাতে ফ্রন্টএন্ড ক্র্যাশ না করে
        console.error("Ping failed:", error);
        return { success: false };
      }
    }),
});