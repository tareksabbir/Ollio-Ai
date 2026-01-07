import { createTRPCRouter } from "../init";
import { usageRouter } from "@/modules/usage/server/procedures";
import { projectsRouter } from "@/modules/projects/server/procedures";
import { messagesRouter } from "@/modules/messages/server/procedures";
import { fragmentsRouter } from "@/modules/fragments/server/procedures";
import { sandboxRouter } from "@/modules/sandbox/server/procedures";
import { htmlCodeRouter } from "@/modules/html-code/server/procedure";

export const appRouter = createTRPCRouter({
  usage: usageRouter,
  messages: messagesRouter,
  projects: projectsRouter,
  fragments: fragmentsRouter,
  sandbox: sandboxRouter,
  htmlCode: htmlCodeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
