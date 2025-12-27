import { openai, createAgent } from "@inngest/agent-kit";
import { inngest } from "./client";
import { Sandbox } from "@e2b/code-interpreter";
import { getSandBox } from "./utils";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("ollio-ai-sandbox");
      return sandbox.sandboxId;
    });

    const codeAgent = createAgent({
      name: "code-agent",
      system:
        "You are an expert next.js developer. You write readable amintainable code. you write simple nextjs snippets like button with simple nextjs and react snnipets",
      model: openai({ model: "gpt-4o" }),
    });
    const { output } = await codeAgent.run(`output : ${event.data.value}`);

    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandBox(sandboxId);
      const host = sandbox.getHost(3000);
      return `https://${host}`;
    });

    return { output, sandboxUrl };
  }
);
