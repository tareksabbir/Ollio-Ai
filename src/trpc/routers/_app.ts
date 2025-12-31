import { projectsRouter } from "@/modules/projects/server/procedures";
import { messagesRouter } from "@/modules/messages/server/procedures";
import { fragmentsRouter } from "./fragments";
import { sandboxRouter } from "./sandbox"; 
import { createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
  messages: messagesRouter,
  projects: projectsRouter,
  fragments: fragmentsRouter,
  sandbox: sandboxRouter, 
});

// export type definition of API
export type AppRouter = typeof appRouter;