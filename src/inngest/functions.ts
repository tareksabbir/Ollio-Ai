/* eslint-disable @typescript-eslint/no-unused-vars */

// import {
//   openai,
//   createAgent,
//   createTool,
//   createNetwork,
//   type Tool,
//   type Message,
//   createState,
// } from "@inngest/agent-kit";
// import { inngest } from "./client";
// import { Sandbox } from "@e2b/code-interpreter";
// import {
//   getSandBox,
//   lastAssistantTextMessageContent,
//   parseAgentOutput,
// } from "./utils";
// import { z } from "zod";
// import prisma from "@/lib/db";
// import { PromptManager } from "@/lib/prompt-manager";

// interface AgentState {
//   summary: string;
//   files: { [path: string]: string };
// }

// // ✅ Proper type definitions for tool results
// type FileOperationResult =
//   | { success: true; fileCount: number }
//   | { success: false; error: string };

// type FileReadResult =
//   | { success: true; contents: Array<{ path: string; content: string }> }
//   | { success: false; error: string };

// export const uiGenerationAgent = inngest.createFunction(
//   { id: "ui-Generation-Agent" },
//   { event: "ui-Generation-Agent/run" },
//   async ({ event, step }) => {
//     try {
//       // Validate input
//       if (!event.data?.value || !event.data?.projectId) {
//         throw new Error("Missing required data: value or projectId");
//       }

//       console.log("🚀 Starting UI Generation Agent for project:", event.data.projectId);

//       // Create sandbox
//       const sandboxId = await step.run("get-sandbox-id", async () => {
//         console.log("📦 Creating sandbox...");
//         const sandbox = await Sandbox.create("ollio");
//         console.log("✅ Sandbox created:", sandbox.sandboxId);
//         return sandbox.sandboxId;
//       });

//       // Get previous messages
//       const previousMessages = await step.run(
//         "get-previous-messages",
//         async () => {
//           console.log("📝 Fetching previous messages...");
//           const formattedMessages: Message[] = [];
//           const messages = await prisma.message.findMany({
//             where: {
//               projectId: event.data?.projectId,
//             },
//             orderBy: {
//               createdAt: "desc",
//             },
//             take: 5,
//           });

//           for (const message of messages) {
//             formattedMessages.push({
//               type: "text",
//               role: message.role === "ASSISTANT" ? "assistant" : "user",
//               content: message.content,
//             });
//           }
//           console.log(`✅ Found ${messages.length} previous messages`);
//           return formattedMessages.reverse();
//         }
//       );

//       // Load prompts
//       const prompts = await step.run("load-prompts", async () => {
//         console.log("🔄 Loading prompts from database...");

//         try {
//           const [systemPromptData, responsePromptData, titlePromptData] =
//             await Promise.all([
//               PromptManager.getPrompt("ui-generation", {
//                 projectId: event.data?.projectId,
//               }).catch(err => {
//                 console.error("❌ Failed to load ui-generation prompt:", err);
//                 return null;
//               }),
//               PromptManager.getPrompt("response-generation").catch(err => {
//                 console.error("❌ Failed to load response-generation prompt:", err);
//                 return null;
//               }),
//               PromptManager.getPrompt("fragment-title").catch(err => {
//                 console.error("❌ Failed to load fragment-title prompt:", err);
//                 return null;
//               }),
//             ]);

//           if (!systemPromptData?.content) {
//             throw new Error("UI generation prompt not found or empty");
//           }
//           if (!responsePromptData?.content) {
//             throw new Error("Response generation prompt not found or empty");
//           }
//           if (!titlePromptData?.content) {
//             throw new Error("Fragment title prompt not found or empty");
//           }

//           console.log("✅ All prompts loaded successfully");
//           console.log("- System prompt version:", systemPromptData.version);
//           console.log("- Response prompt version:", responsePromptData.version);
//           console.log("- Title prompt version:", titlePromptData.version);

//           return {
//             system: systemPromptData.content,
//             response: responsePromptData.content,
//             title: titlePromptData.content,
//           };
//         } catch (error) {
//           console.error("❌ Error loading prompts:", error);
//           throw new Error(
//             `Failed to load prompts: ${error instanceof Error ? error.message : "Unknown error"}`
//           );
//         }
//       });

//       // Initialize state
//       const state = createState<AgentState>(
//         {
//           summary: "",
//           files: {},
//         },
//         {
//           messages: previousMessages,
//         }
//       );

//       console.log("🤖 Creating code agent...");

//       // Create code agent
//       const codeAgent = createAgent<AgentState>({
//         name: "code-agent",
//         description: "An Expert coding agent for UI generation",
//         system: prompts.system,
//         model: openai({
//           model: "gpt-4.1",
//           defaultParameters: { temperature: 0.1 },
//         }),
//         tools: [
//           // Terminal tool
//           createTool({
//             name: "terminal",
//             description: "Use the terminal to run commands in the sandbox",
//             parameters: z.object({
//               command: z.string().describe("The command to run in terminal"),
//             }),
//             handler: async ({ command }, { step }) => {
//               return await step?.run("terminal", async () => {
//                 console.log("💻 Running command:", command);
//                 const buffers = { stdout: "", stderr: "" };
//                 try {
//                   const sandbox = await getSandBox(sandboxId);
//                   const result = await sandbox.commands.run(command, {
//                     onStdout: (data: string) => {
//                       buffers.stdout += data;
//                     },
//                     onStderr: (data: string) => {
//                       buffers.stderr += data;
//                     },
//                   });
//                   console.log("✅ Command executed successfully");
//                   return result.stdout || buffers.stdout;
//                 } catch (error) {
//                   const errorMessage = `Command failed: ${error}\nstdout: ${buffers.stdout}\nstderr: ${buffers.stderr}`;
//                   console.error("❌", errorMessage);
//                   return errorMessage;
//                 }
//               });
//             },
//           }),

//           // ✅ FIXED: Create/Update files tool with proper types
//           createTool({
//             name: "createOrUpdateFiles",
//             description: "Create or update multiple files in the sandbox file system",
//             parameters: z.object({
//               files: z
//                 .array(
//                   z.object({
//                     path: z.string().describe("File path (e.g., /home/user/app.tsx)"),
//                     content: z.string().describe("File content"),
//                   })
//                 )
//                 .describe("Array of files to create or update"),
//             }),
//             handler: async ({ files }, { step, network }: Tool.Options<AgentState>) => {
//               // Write files inside step.run with proper typing
//               const result = await step?.run("createOrUpdateFiles", async (): Promise<FileOperationResult> => {
//                 console.log(`📝 Creating/updating ${files.length} file(s)...`);
//                 try {
//                   const sandbox = await getSandBox(sandboxId);

//                   for (const file of files) {
//                     await sandbox.files.write(file.path, file.content);
//                     console.log(`✅ Wrote to sandbox: ${file.path}`);
//                   }

//                   return { success: true, fileCount: files.length };
//                 } catch (error) {
//                   const errorMsg = error instanceof Error ? error.message : "Unknown error";
//                   console.error("❌ Error writing files:", errorMsg);
//                   return { success: false, error: errorMsg };
//                 }
//               });

//               // ✅ Type-safe checking with proper narrowing
//               if (!result) {
//                 return "Error: No result from file operation";
//               }

//               if (result.success) {
//                 // ✅ TypeScript knows this is { success: true; fileCount: number }
//                 const updatedFiles = { ...(network.state.data.files || {}) };

//                 for (const file of files) {
//                   updatedFiles[file.path] = file.content;
//                   console.log(`📦 Added to state: ${file.path}`);
//                 }

//                 network.state.data.files = updatedFiles;

//                 console.log(`✅ State updated with ${Object.keys(updatedFiles).length} total files`);
//                 return `Successfully created/updated ${result.fileCount} file(s). Total files in state: ${Object.keys(updatedFiles).length}`;
//               } else {
//                 // ✅ TypeScript knows this is { success: false; error: string }
//                 return `Error: ${result.error}`;
//               }
//             },
//           }),

//           // ✅ Read files tool with proper types
//           createTool({
//             name: "readFiles",
//             description: "Read one or more files from the sandbox",
//             parameters: z.object({
//               files: z.array(z.string()).describe("Array of file paths to read"),
//             }),
//             handler: async ({ files }, { step }) => {
//               const result = await step?.run("readFiles", async (): Promise<FileReadResult> => {
//                 console.log(`📖 Reading ${files.length} file(s)...`);
//                 try {
//                   const sandbox = await getSandBox(sandboxId);
//                   const contents: Array<{ path: string; content: string }> = [];

//                   for (const file of files) {
//                     try {
//                       const content = await sandbox.files.read(file);
//                       contents.push({ path: file, content });
//                       console.log(`✅ Read: ${file}`);
//                     } catch (fileError) {
//                       console.error(`❌ Error reading file ${file}:`, fileError);
//                     }
//                   }

//                   return { success: true, contents };
//                 } catch (error) {
//                   const errorMsg = error instanceof Error ? error.message : "Unknown error";
//                   console.error("❌ Error reading files:", errorMsg);
//                   return { success: false, error: errorMsg };
//                 }
//               });

//               if (!result) {
//                 return JSON.stringify({ error: "No result from read operation" });
//               }

//               if (result.success) {
//                 return JSON.stringify(result.contents, null, 2);
//               } else {
//                 return JSON.stringify({ error: result.error });
//               }
//             },
//           }),
//         ],
//         lifecycle: {
//           onResponse: async ({ result, network }) => {
//             const lastAssistantMessageText = lastAssistantTextMessageContent(result);
//             if (lastAssistantMessageText && network) {
//               if (lastAssistantMessageText.includes("<task_summary>")) {
//                 network.state.data.summary = lastAssistantMessageText;
//                 console.log("✅ Task summary captured");
//               }
//             }
//             return result;
//           },
//         },
//       });

//       // Create network
//       console.log("🌐 Creating agent network...");
//       const network = createNetwork<AgentState>({
//         name: "coding-agent-network",
//         agents: [codeAgent],
//         maxIter: 15,
//         defaultState: state,
//         router: async ({ network }) => {
//           const taskSummary = network.state.data.summary;
//           if (taskSummary) {
//             console.log("✅ Task completed, stopping network");
//             return;
//           }
//           return codeAgent;
//         },
//       });

//       // Run the network
//       console.log("🚀 Running agent network...");
//       const result = await network.run(event.data?.value, { state });
//       console.log("✅ Agent network execution completed");

//       // ✅ DEBUG: Check final state
//       console.log("📊 Final state check:");
//       console.log("- Summary exists:", !!result.state.data.summary);
//       console.log("- Files count:", Object.keys(result.state.data.files || {}).length);
//       console.log("- File paths:", Object.keys(result.state.data.files || {}));

//       // Generate fragment title
//       console.log("🏷️ Generating fragment title...");
//       const fragmentTitleGenerator = createAgent({
//         name: "fragment-title-generator",
//         description: "Generates a concise title for the UI fragment",
//         system: prompts.title,
//         model: openai({ model: "gpt-4o-mini" }),
//       });

//       // Generate response
//       console.log("💬 Generating user response...");
//       const responseGenerator = createAgent({
//         name: "response-generator",
//         description: "Generates a user-friendly response",
//         system: prompts.response,
//         model: openai({ model: "gpt-4o-mini" }),
//       });

//       const { output: fragmentTitleOutput } = await fragmentTitleGenerator.run(
//         result.state.data.summary || "UI Fragment"
//       );

//       const { output: responseOutput } = await responseGenerator.run(
//         result.state.data.summary || "Task completed successfully"
//       );

//       // Check for errors
//       const isError =
//         !result.state.data.summary ||
//         Object.keys(result.state.data.files || {}).length === 0;

//       if (isError) {
//         console.warn("⚠️ Generation completed with errors or no files");
//         console.warn("- Has summary:", !!result.state.data.summary);
//         console.warn("- Files count:", Object.keys(result.state.data.files || {}).length);
//       }

//       // Get sandbox URL
//       const sandboxUrl = await step.run("get-sandbox-url", async () => {
//         try {
//           console.log("🔗 Getting sandbox URL...");
//           const sandbox = await getSandBox(sandboxId);
//           const host = sandbox.getHost(3000);
//           const url = `https://${host}`;
//           console.log("✅ Sandbox URL:", url);
//           return url;
//         } catch (error) {
//           console.error("❌ Error getting sandbox URL:", error);
//           return null;
//         }
//       });

//       // Save result to database
//       await step.run("save-result", async () => {
//         console.log("💾 Saving result to database...");

//         if (isError) {
//           console.log("⚠️ Saving error message");
//           return await prisma.message.create({
//             data: {
//               projectId: event.data?.projectId,
//               content: "Something went wrong while generating the UI. Please try again.",
//               role: "ASSISTANT",
//               type: "ERROR",
//             },
//           });
//         }

//         console.log("✅ Saving successful result with fragment");
//         return await prisma.message.create({
//           data: {
//             projectId: event.data?.projectId,
//             content: parseAgentOutput(responseOutput),
//             role: "ASSISTANT",
//             type: "RESULT",
//             fragment: {
//               create: {
//                 sandboxUrl: sandboxUrl || "",
//                 sandboxId: sandboxId,
//                 title: parseAgentOutput(fragmentTitleOutput),
//                 files: result.state.data.files,
//               },
//             },
//           },
//         });
//       });

//       console.log("🎉 UI Generation Agent completed successfully!");

//       return {
//         url: sandboxUrl,
//         title: parseAgentOutput(fragmentTitleOutput),
//         files: result.state.data.files,
//         summary: result.state.data.summary,
//       };

//     } catch (error) {
//       console.error("❌ Agent execution failed:", error);

//       await step.run("save-error-message", async () => {
//         try {
//           console.log("💾 Saving error message to database");
//           return await prisma.message.create({
//             data: {
//               projectId: event.data?.projectId,
//               content: `Error: ${error instanceof Error ? error.message : "An unexpected error occurred"}`,
//               role: "ASSISTANT",
//               type: "ERROR",
//             },
//           });
//         } catch (dbError) {
//           console.error("❌ Failed to save error message:", dbError);
//           return null;
//         }
//       });

//       throw error;
//     }
//   }
// );

// inngest/functions.ts - COMPLETE SOLUTION WITH DATABASE PERSISTENCE

import {
  openai,
  createAgent,
  createTool,
  createNetwork,
  type Tool,
  type Message,
  createState,
} from "@inngest/agent-kit";
import { inngest } from "./client";
import { Sandbox } from "@e2b/code-interpreter";
import {
  getSandBox,
  lastAssistantTextMessageContent,
  parseAgentOutput,
} from "./utils";
import { z } from "zod";
import prisma from "@/lib/db";
import { PromptManager } from "@/lib/prompt-manager";

interface AgentState {
  summary: string;
  files: { [path: string]: string };
}

type FileOperationResult =
  | { success: true; fileCount: number }
  | { success: false; error: string };

type FileReadResult =
  | { success: true; contents: Array<{ path: string; content: string }> }
  | { success: false; error: string };

export const uiGenerationAgent = inngest.createFunction(
  { id: "ui-Generation-Agent" },
  { event: "ui-Generation-Agent/run" },
  async ({ event, step }) => {
    try {
      if (!event.data?.value || !event.data?.projectId) {
        throw new Error("Missing required data: value or projectId");
      }

      console.log(
        "🚀 Starting UI Generation Agent for project:",
        event.data.projectId,
      );

      // ✅ STEP 1: Database থেকে existing files load করুন
      const { existingFiles, lastSandboxId, isFirstGeneration } =
        await step.run("load-existing-files-from-database", async () => {
          console.log("📂 Loading existing files from database...");

          // Project এর last successful fragment খুঁজুন
          const lastFragment = await prisma.fragment.findFirst({
            where: {
              message: {
                projectId: event.data?.projectId,
                type: "RESULT", // শুধু successful results
              },
            },
            orderBy: {
              createdAt: "desc",
            },
            select: {
              files: true,
              sandboxId: true,
            },
          });

          if (!lastFragment) {
            console.log("✅ First generation - no existing files");
            return {
              existingFiles: {},
              lastSandboxId: null,
              isFirstGeneration: true,
            };
          }

          // Files JSON থেকে parse করুন
          const files = lastFragment.files as { [path: string]: string };
          const fileCount = Object.keys(files || {}).length;

          console.log(`✅ Loaded ${fileCount} existing files from database`);
          console.log("📄 Existing files:", Object.keys(files || {}));

          return {
            existingFiles: files || {},
            lastSandboxId: lastFragment.sandboxId,
            isFirstGeneration: false,
          };
        });

      // ✅ STEP 2: Sandbox create/reuse করুন এবং existing files restore করুন
      const sandboxId = await step.run("setup-sandbox-with-files", async () => {
        console.log("📦 Setting up sandbox...");

        // Try to reuse existing sandbox
        if (lastSandboxId) {
          try {
            console.log(
              "🔄 Attempting to reuse existing sandbox:",
              lastSandboxId,
            );
            const sandbox = await getSandBox(lastSandboxId);

            // Test if sandbox is alive
            await sandbox.commands.run("echo 'test'");

            console.log("✅ Reusing existing sandbox");
            return lastSandboxId;
          } catch (error) {
            console.log("⚠️ Existing sandbox expired, creating new one");
          }
        }

        // Create new sandbox
        console.log("📦 Creating new sandbox...");
        const sandbox = await Sandbox.create("ollio");
        console.log("✅ Sandbox created:", sandbox.sandboxId);

        // ✅ Restore existing files to sandbox
        if (Object.keys(existingFiles).length > 0) {
          console.log(
            `📥 Restoring ${Object.keys(existingFiles).length} files to sandbox...`,
          );

          for (const [path, content] of Object.entries(existingFiles)) {
            try {
              await sandbox.files.write(path, content);
              console.log(`✅ Restored: ${path}`);
            } catch (error) {
              console.error(`❌ Failed to restore ${path}:`, error);
            }
          }

          console.log("✅ All existing files restored to sandbox");
        }

        return sandbox.sandboxId;
      });

      // ✅ STEP 3: Previous messages load করুন WITH context
      const previousMessages = await step.run(
        "get-previous-messages-with-context",
        async () => {
          console.log("📝 Fetching previous messages...");
          const formattedMessages: Message[] = [];

          // ✅ Add existing files context if this is not first generation
          if (!isFirstGeneration && Object.keys(existingFiles).length > 0) {
            const fileList = Object.keys(existingFiles)
              .map((f) => `  - ${f}`)
              .join("\n");

            formattedMessages.push({
              type: "text",
              role: "system",
              content: `🔄 EXISTING PROJECT CONTEXT - READ CAREFULLY:This project has ${Object.keys(existingFiles).length} existing files already loaded from the database:${fileList}
              CRITICAL INSTRUCTIONS:
                 1. Files are already in the sandbox - DO NOT recreate from scratch
                 2. ALWAYS use readFiles() to check current code before making changes
                 3. Only modify what the user specifically requests
                 4. Preserve ALL existing functionality
                 5. Add new features alongside existing code
                 6. This is INCREMENTAL development, NOT a fresh start
                 Current state: All files restored to sandbox and ready for modification.`,
            });
          }

          // Load conversation history
          const messages = await prisma.message.findMany({
            where: {
              projectId: event.data?.projectId,
            },
            orderBy: {
              createdAt: "desc",
            },
            take: 10,
          });

          for (const message of messages) {
            formattedMessages.push({
              type: "text",
              role: message.role === "ASSISTANT" ? "assistant" : "user",
              content: message.content,
            });
          }

          console.log(`✅ Loaded ${messages.length} previous messages`);
          return formattedMessages.reverse();
        },
      );

      // ✅ STEP 4: Load prompts
      const prompts = await step.run("load-prompts", async () => {
        console.log("🔄 Loading prompts from database...");

        try {
          const [systemPromptData, responsePromptData, titlePromptData] =
            await Promise.all([
              PromptManager.getPrompt("ui-generation", {
                projectId: event.data?.projectId,
              }).catch((err) => {
                console.error("❌ Failed to load ui-generation prompt:", err);
                return null;
              }),
              PromptManager.getPrompt("response-generation").catch((err) => {
                console.error(
                  "❌ Failed to load response-generation prompt:",
                  err,
                );
                return null;
              }),
              PromptManager.getPrompt("fragment-title").catch((err) => {
                console.error("❌ Failed to load fragment-title prompt:", err);
                return null;
              }),
            ]);

          if (!systemPromptData?.content) {
            throw new Error("UI generation prompt not found or empty");
          }
          if (!responsePromptData?.content) {
            throw new Error("Response generation prompt not found or empty");
          }
          if (!titlePromptData?.content) {
            throw new Error("Fragment title prompt not found or empty");
          }

          console.log("✅ All prompts loaded successfully");

          return {
            system: systemPromptData.content,
            response: responsePromptData.content,
            title: titlePromptData.content,
          };
        } catch (error) {
          console.error("❌ Error loading prompts:", error);
          throw new Error(
            `Failed to load prompts: ${error instanceof Error ? error.message : "Unknown error"}`,
          );
        }
      });

      // ✅ STEP 5: Initialize state with existing files
      const state = createState<AgentState>(
        {
          summary: "",
          files: { ...existingFiles }, // Database থেকে নেওয়া files
        },
        {
          messages: previousMessages,
        },
      );

      console.log("🤖 Creating code agent...");
      console.log(
        `📊 State initialized with ${Object.keys(existingFiles).length} existing files`,
      );

      // ✅ STEP 6: Create agent with incremental development context
      const incrementalContext = !isFirstGeneration
        ? ` INCREMENTAL DEVELOPMENT MODE - CRITICAL CONTEXT            
                 EXISTING PROJECT STATE:
                     - Files in project: ${Object.keys(existingFiles).length}
                     - All files are loaded in sandbox from database
                     - This is NOT a fresh start - existing code must be preserved
                 MANDATORY WORKFLOW FOR ALL TASKS:
                 
                     1. BEFORE ANY CHANGES:                                        → Use readFiles() to check current implementation          
                     → Understand existing code structure                       
                                                                
                     2. MAKE TARGETED CHANGES:                                      → Only modify what user explicitly requests                
                     → Add new code alongside existing code                     
                     → Update imports/dependencies as needed  

                     3. PRESERVE EVERYTHING ELSE:                                  
                          → Keep all existing components intact                      
                          → Don't remove or rewrite working code                     
                        → Maintain current file structure                         
                        
                EXAMPLES:
                
                   ❌ WRONG APPROACH:
                       User: "Add dark mode toggle"
                          → Rewrite entire app/page.tsx from scratch
                          → Remove existing components
                          → Change file structure
                   ✅ CORRECT APPROACH:
                        User: "Add dark mode toggle"
                          → readFiles(["app/page.tsx"])
                          → Add useState for theme
                          → Insert toggle button in existing header
                          → Add theme classes
                          → Keep all other code unchanged
                  EXISTING FILES IN THIS PROJECT:
                  ${Object.keys(existingFiles)
                    .map((f) => `  • ${f}`)
                    .join(
                      "\n",
                    )}⚠️  REMEMBER: Files are already in the sandbox. Read first, modify precisely!`
        : "";

      const codeAgent = createAgent<AgentState>({
        name: "code-agent",
        description: "An Expert coding agent for incremental UI development",
        system: prompts.system + incrementalContext,
        model: openai({
          model: "gpt-4o",
          defaultParameters: { temperature: 0.1 },
        }),
        tools: [
          // Terminal tool
          createTool({
            name: "terminal",
            description: "Use the terminal to run commands in the sandbox",
            parameters: z.object({
              command: z.string().describe("The command to run in terminal"),
            }),
            handler: async ({ command }, { step }) => {
              return await step?.run("terminal", async () => {
                console.log("💻 Running command:", command);
                const buffers = { stdout: "", stderr: "" };
                try {
                  const sandbox = await getSandBox(sandboxId);
                  const result = await sandbox.commands.run(command, {
                    onStdout: (data: string) => {
                      buffers.stdout += data;
                    },
                    onStderr: (data: string) => {
                      buffers.stderr += data;
                    },
                  });
                  console.log("✅ Command executed successfully");
                  return result.stdout || buffers.stdout;
                } catch (error) {
                  const errorMessage = `Command failed: ${error}\nstdout: ${buffers.stdout}\nstderr: ${buffers.stderr}`;
                  console.error("❌", errorMessage);
                  return errorMessage;
                }
              });
            },
          }),

          // Create/Update files tool
          createTool({
            name: "createOrUpdateFiles",
            description:
              "Create new files or update existing files. Use this after reading current state with readFiles.",
            parameters: z.object({
              files: z
                .array(
                  z.object({
                    path: z.string().describe("File path (e.g., app/page.tsx)"),
                    content: z.string().describe("Complete file content"),
                  }),
                )
                .describe("Array of files to create or update"),
            }),
            handler: async (
              { files },
              { step, network }: Tool.Options<AgentState>,
            ) => {
              const result = await step?.run(
                "createOrUpdateFiles",
                async (): Promise<FileOperationResult> => {
                  console.log(
                    `📝 Creating/updating ${files.length} file(s)...`,
                  );
                  try {
                    const sandbox = await getSandBox(sandboxId);

                    for (const file of files) {
                      await sandbox.files.write(file.path, file.content);
                      console.log(
                        `✅ Wrote to sandbox: ${file.path} (${file.content.length} chars)`,
                      );
                    }

                    return { success: true, fileCount: files.length };
                  } catch (error) {
                    const errorMsg =
                      error instanceof Error ? error.message : "Unknown error";
                    console.error("❌ Error writing files:", errorMsg);
                    return { success: false, error: errorMsg };
                  }
                },
              );

              if (!result) {
                return "Error: No result from file operation";
              }

              if (result.success) {
                const updatedFiles = { ...(network.state.data.files || {}) };

                for (const file of files) {
                  updatedFiles[file.path] = file.content;
                  console.log(`📦 Added to state: ${file.path}`);
                }

                network.state.data.files = updatedFiles;

                console.log(
                  `✅ State updated with ${Object.keys(updatedFiles).length} total files`,
                );
                return `Successfully created/updated ${result.fileCount} file(s). Total files in project: ${Object.keys(updatedFiles).length}`;
              } else {
                return `Error: ${result.error}`;
              }
            },
          }),

          // Read files tool
          createTool({
            name: "readFiles",
            description:
              "Read current content of files from the sandbox. ALWAYS use this before modifying existing files to understand current implementation.",
            parameters: z.object({
              files: z
                .array(z.string())
                .describe("Array of file paths to read"),
            }),
            handler: async ({ files }, { step }) => {
              const result = await step?.run(
                "readFiles",
                async (): Promise<FileReadResult> => {
                  console.log(`📖 Reading ${files.length} file(s)...`);
                  try {
                    const sandbox = await getSandBox(sandboxId);
                    const contents: Array<{ path: string; content: string }> =
                      [];

                    for (const file of files) {
                      try {
                        const content = await sandbox.files.read(file);
                        contents.push({ path: file, content });
                        console.log(
                          `✅ Read: ${file} (${content.length} chars)`,
                        );
                      } catch (fileError) {
                        console.error(
                          `❌ Error reading file ${file}:`,
                          fileError,
                        );
                        contents.push({
                          path: file,
                          content: `ERROR: File not found or cannot be read: ${fileError}`,
                        });
                      }
                    }

                    return { success: true, contents };
                  } catch (error) {
                    const errorMsg =
                      error instanceof Error ? error.message : "Unknown error";
                    console.error("❌ Error reading files:", errorMsg);
                    return { success: false, error: errorMsg };
                  }
                },
              );

              if (!result) {
                return JSON.stringify({
                  error: "No result from read operation",
                });
              }

              if (result.success) {
                return JSON.stringify(result.contents, null, 2);
              } else {
                return JSON.stringify({ error: result.error });
              }
            },
          }),
        ],
        lifecycle: {
          onResponse: async ({ result, network }) => {
            const lastAssistantMessageText =
              lastAssistantTextMessageContent(result);
            if (lastAssistantMessageText && network) {
              if (lastAssistantMessageText.includes("<task_summary>")) {
                network.state.data.summary = lastAssistantMessageText;
                console.log("✅ Task summary captured");
              }
            }
            return result;
          },
        },
      });

      // Create network
      console.log("🌐 Creating agent network...");
      const network = createNetwork<AgentState>({
        name: "coding-agent-network",
        agents: [codeAgent],
        maxIter: 15,
        defaultState: state,
        router: async ({ network }) => {
          const taskSummary = network.state.data.summary;
          if (taskSummary) {
            console.log("✅ Task completed, stopping network");
            return;
          }
          return codeAgent;
        },
      });

      // Run the network
      console.log("🚀 Running agent network...");
      const result = await network.run(event.data?.value, { state });
      console.log("✅ Agent network execution completed");

      // Debug final state
      console.log("📊 Final state check:");
      console.log("- Summary exists:", !!result.state.data.summary);
      console.log(
        "- Files count:",
        Object.keys(result.state.data.files || {}).length,
      );
      console.log("- File paths:", Object.keys(result.state.data.files || {}));

      // Generate fragment title
      console.log("🏷️ Generating fragment title...");
      const fragmentTitleGenerator = createAgent({
        name: "fragment-title-generator",
        description: "Generates a concise title for the UI fragment",
        system: prompts.title,
        model: openai({ model: "gpt-4o-mini" }),
      });

      // Generate response
      console.log("💬 Generating user response...");
      const responseGenerator = createAgent({
        name: "response-generator",
        description: "Generates a user-friendly response",
        system: prompts.response,
        model: openai({ model: "gpt-4o-mini" }),
      });

      const { output: fragmentTitleOutput } = await fragmentTitleGenerator.run(
        result.state.data.summary || "UI Fragment",
      );

      const { output: responseOutput } = await responseGenerator.run(
        result.state.data.summary || "Task completed successfully",
      );

      // Check for errors
      const isError =
        !result.state.data.summary ||
        Object.keys(result.state.data.files || {}).length === 0;

      if (isError) {
        console.warn("⚠️ Generation completed with errors or no files");
        console.warn("- Has summary:", !!result.state.data.summary);
        console.warn(
          "- Files count:",
          Object.keys(result.state.data.files || {}).length,
        );
      }

      // Get sandbox URL
      const sandboxUrl = await step.run("get-sandbox-url", async () => {
        try {
          console.log("🔗 Getting sandbox URL...");
          const sandbox = await getSandBox(sandboxId);
          const host = sandbox.getHost(3000);
          const url = `https://${host}`;
          console.log("✅ Sandbox URL:", url);
          return url;
        } catch (error) {
          console.error("❌ Error getting sandbox URL:", error);
          return null;
        }
      });

      // ✅ STEP 7: Save merged files to database
      await step.run("save-result-with-merged-files", async () => {
        console.log("💾 Saving result to database...");

        if (isError) {
          console.log("⚠️ Saving error message");
          return await prisma.message.create({
            data: {
              projectId: event.data?.projectId,
              content:
                "Something went wrong while generating the UI. Please try again.",
              role: "ASSISTANT",
              type: "ERROR",
            },
          });
        }

        // ✅ Merge: existing files + newly modified/created files
        const finalFiles = {
          ...existingFiles, // Start with all existing files
          ...result.state.data.files, // Overwrite with new/modified files
        };

        console.log("✅ Saving successful result with fragment");
        console.log(
          `📦 Total files in fragment: ${Object.keys(finalFiles).length}`,
        );
        console.log(`  - Existing files: ${Object.keys(existingFiles).length}`);
        console.log(
          `  - Modified/new files: ${Object.keys(result.state.data.files || {}).length}`,
        );

        return await prisma.message.create({
          data: {
            projectId: event.data?.projectId,
            content: parseAgentOutput(responseOutput),
            role: "ASSISTANT",
            type: "RESULT",
            fragment: {
              create: {
                sandboxUrl: sandboxUrl || "",
                sandboxId: sandboxId,
                title: parseAgentOutput(fragmentTitleOutput),
                files: finalFiles, // ✅ Complete merged files save করুন
              },
            },
          },
        });
      });

      console.log("🎉 UI Generation Agent completed successfully!");

      return {
        url: sandboxUrl,
        title: parseAgentOutput(fragmentTitleOutput),
        files: result.state.data.files,
        summary: result.state.data.summary,
      };
    } catch (error) {
      console.error("❌ Agent execution failed:", error);

      await step.run("save-error-message", async () => {
        try {
          console.log("💾 Saving error message to database");
          return await prisma.message.create({
            data: {
              projectId: event.data?.projectId,
              content: `Error: ${error instanceof Error ? error.message : "An unexpected error occurred"}`,
              role: "ASSISTANT",
              type: "ERROR",
            },
          });
        } catch (dbError) {
          console.error("❌ Failed to save error message:", dbError);
          return null;
        }
      });

      throw error;
    }
  },
);
