import { openai, createAgent } from "@inngest/agent-kit";
import { inngest } from "./client";


export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event }) => {
    const codeAgent = createAgent({
      name: "code-agent",
      system:
        "You are an expert next.js developer. You write readable amintainable code. you write simple nextjs snippets like button with simple nextjs and react snnipets",
      model: openai({ model: "gpt-4o" }),
    });
    const { output } = await codeAgent.run(`output : ${event.data.value}`);
    console.log(output);
    return { output };
  }
);
