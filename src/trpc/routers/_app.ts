import { createTRPCRouter } from "../init";
import { usageRouter } from "@/modules/usage/server/procedures";
import { projectsRouter } from "@/modules/projects/server/procedures";
import { messagesRouter } from "@/modules/messages/server/procedures";
import { fragmentsRouter } from "@/modules/fragments/server/procedures";
import { sandboxRouter } from "@/modules/sandbox/server/procedures";

export const appRouter = createTRPCRouter({
  usage: usageRouter,
  messages: messagesRouter,
  projects: projectsRouter,
  fragments: fragmentsRouter,
  sandbox: sandboxRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
