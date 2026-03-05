/* eslint-disable @typescript-eslint/no-unused-vars */

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

type ErrorDetectionResult = {
  hasErrors: boolean;
  errors: Array<{
    type: "runtime" | "file_analysis";
    message: string;
    file?: string;
    suggestion?: string;
  }>;
  summary: string;
};

/**
 * ✅ Lightweight error detection - NO BUILD CHECK
 * Only checks: 1) Dev server errors, 2) Static file analysis
 */
async function detectErrorsInSandbox(
  sandboxId: string,
  currentFiles: { [path: string]: string },
): Promise<ErrorDetectionResult> {
  console.log("🔍 Running lightweight error detection...");

  const detectedErrors: ErrorDetectionResult["errors"] = [];

  try {
    const sandbox = await getSandBox(sandboxId);

    // ✅ Check 1: Dev server runtime errors (quick check - 10 seconds only)
    console.log("🔍 Checking dev server for runtime errors...");
    try {
      const devResult = await sandbox.commands.run(
        "cd /home/project && timeout 10s npm run dev 2>&1 || true",
      );

      const devOutput = devResult.stdout + devResult.stderr;

      // Critical error patterns that break the app
      const criticalPatterns = [
        {
          pattern: /cannot find module|module not found/i,
          message: "Missing module/dependency",
          suggestion: "Install missing package",
        },
        {
          pattern: /is not defined|reference error/i,
          message: "Undefined variable or missing import",
          suggestion: "Check imports and add 'use client' if using hooks",
        },
        {
          pattern: /hydration failed|hydration error/i,
          message: "Hydration mismatch detected",
          suggestion: "Add 'use client' or wrap dynamic content in useEffect",
        },
        {
          pattern: /unexpected token|syntax error/i,
          message: "Syntax error in code",
          suggestion: "Check JSX syntax and brackets",
        },
        {
          pattern: /failed to compile/i,
          message: "Compilation failed",
          suggestion: "Check file syntax and imports",
        },
      ];

      for (const { pattern, message, suggestion } of criticalPatterns) {
        if (pattern.test(devOutput)) {
          // Get specific error lines
          const errorLines = devOutput
            .split("\n")
            .filter((line) => pattern.test(line))
            .slice(0, 2); // Only first 2 occurrences

          for (const errorLine of errorLines) {
            detectedErrors.push({
              type: "runtime",
              message: `${message}: ${errorLine.trim().slice(0, 150)}`,
              suggestion,
            });
          }
        }
      }
    } catch (err) {
      console.log("⚠️ Dev server check completed with timeout (expected)");
    }

    // ✅ Check 2: Static file analysis (fast, no sandbox commands needed)
    console.log("📄 Analyzing files for common React/Next.js issues...");

    for (const [path, content] of Object.entries(currentFiles)) {
      // Skip non-component files
      if (
        !path.endsWith(".tsx") &&
        !path.endsWith(".jsx") &&
        !path.endsWith(".ts") &&
        !path.endsWith(".js")
      ) {
        continue;
      }

      const issues: Array<{ message: string; suggestion: string }> = [];

      // Issue 1: Missing 'use client' with React hooks
      const hasHooks =
        content.includes("useState") ||
        content.includes("useEffect") ||
        content.includes("useCallback") ||
        content.includes("useMemo") ||
        content.includes("useRef") ||
        content.includes("useContext");

      const hasClientDirective =
        content.includes("'use client'") || content.includes('"use client"');

      if (hasHooks && !hasClientDirective) {
        issues.push({
          message: "React hooks detected without 'use client' directive",
          suggestion: "Add 'use client' at the very top of the file",
        });
      }

      // Issue 2: Event handlers without 'use client'
      const hasInteractivity =
        content.includes("onClick") ||
        content.includes("onChange") ||
        content.includes("onSubmit") ||
        content.includes("onInput") ||
        content.includes("onFocus") ||
        content.includes("onBlur");

      if (hasInteractivity && !hasClientDirective && !hasHooks) {
        issues.push({
          message: "Event handlers detected without 'use client' directive",
          suggestion:
            "Add 'use client' at the top - required for interactive elements",
        });
      }

      // Issue 3: Client-only APIs without proper handling
      const hasClientOnlyCode =
        content.includes("window.") ||
        content.includes("document.") ||
        content.includes("localStorage") ||
        content.includes("sessionStorage") ||
        content.includes("navigator.");

      const hasUseEffectWrapper = content.includes("useEffect");

      if (hasClientOnlyCode && !hasClientDirective && !hasUseEffectWrapper) {
        issues.push({
          message: "Browser APIs detected - may cause SSR/hydration errors",
          suggestion:
            "Add 'use client' directive OR wrap browser code in useEffect",
        });
      }

      // Issue 4: Dynamic content that can cause hydration issues
      const hasDynamicContent =
        content.includes("new Date()") ||
        content.includes("Math.random()") ||
        content.includes("Date.now()");

      if (hasDynamicContent && !hasClientDirective && !hasUseEffectWrapper) {
        issues.push({
          message: "Dynamic content detected - may cause hydration mismatch",
          suggestion:
            "Add 'use client' OR wrap in useEffect OR add suppressHydrationWarning",
        });
      }

      // Issue 5: Missing imports for used hooks
      if (hasHooks) {
        const importReactLine = content
          .split("\n")
          .find((line) => line.includes("import") && line.includes("react"));

        if (importReactLine) {
          const usedHooks = [
            "useState",
            "useEffect",
            "useCallback",
            "useMemo",
            "useRef",
            "useContext",
          ].filter((hook) => content.includes(hook));

          const missingHooks = usedHooks.filter(
            (hook) => !importReactLine.includes(hook),
          );

          if (missingHooks.length > 0) {
            issues.push({
              message: `Missing hook imports: ${missingHooks.join(", ")}`,
              suggestion: `Add to import: import { ${missingHooks.join(", ")} } from 'react'`,
            });
          }
        }
      }

      // Add all issues for this file
      for (const issue of issues) {
        detectedErrors.push({
          type: "file_analysis",
          message: issue.message,
          file: path,
          suggestion: issue.suggestion,
        });
      }
    }

    // ✅ Return result
    const hasErrors = detectedErrors.length > 0;

    if (!hasErrors) {
      console.log("✅ No errors detected - preview should work!");
      return {
        hasErrors: false,
        errors: [],
        summary: "✅ No errors detected. Preview is ready!",
      };
    }

    console.log(`⚠️ Found ${detectedErrors.length} potential issue(s)`);

    return {
      hasErrors: true,
      errors: detectedErrors,
      summary: `Found ${detectedErrors.length} issue(s) that may need fixing`,
    };
  } catch (error) {
    console.error("❌ Error detection failed:", error);
    return {
      hasErrors: false,
      errors: [],
      summary: "Error detection could not complete",
    };
  }
}

/**
 * ✅ Smart auto-fix for detected errors
 */
async function autoFixErrors(
  sandboxId: string,
  currentFiles: { [path: string]: string },
  errors: ErrorDetectionResult["errors"],
): Promise<{ [path: string]: string }> {
  console.log("🔧 Auto-fixing detected errors...");

  const fixedFiles = { ...currentFiles };
  const sandbox = await getSandBox(sandboxId);
  let fixCount = 0;

  for (const error of errors) {
    // ✅ Fix 1: Add 'use client' directive
    if (
      error.file &&
      fixedFiles[error.file] &&
      (error.message.includes("'use client'") ||
        error.message.includes("hooks") ||
        error.message.includes("Event handlers") ||
        error.message.includes("Browser APIs") ||
        error.message.includes("Dynamic content"))
    ) {
      const content = fixedFiles[error.file];

      if (
        !content.includes("'use client'") &&
        !content.includes('"use client"')
      ) {
        console.log(`  ✅ Adding 'use client' to ${error.file}`);
        fixedFiles[error.file] = `'use client'\n\n${content}`;

        try {
          await sandbox.files.write(error.file, fixedFiles[error.file]);
          fixCount++;
        } catch (err) {
          console.error(`  ❌ Failed to write ${error.file}:`, err);
        }
      }
    }

    // ✅ Fix 2: Add missing hook imports
    if (error.file && error.message.includes("Missing hook imports")) {
      const content = fixedFiles[error.file];
      const importMatch = content.match(
        /import\s+{([^}]+)}\s+from\s+['"]react['"]/,
      );

      if (importMatch) {
        const missingHooksMatch = error.message.match(/imports:\s+(.+)/);

        if (missingHooksMatch) {
          const missingHooks = missingHooksMatch[1].split(", ");
          const existingImports = importMatch[1]
            .split(",")
            .map((i) => i.trim());

          const allImports = [
            ...new Set([...existingImports, ...missingHooks]),
          ];
          const newImportLine = `import { ${allImports.join(", ")} } from 'react'`;

          console.log(`  ✅ Adding missing imports to ${error.file}`);

          fixedFiles[error.file] = content.replace(
            /import\s+{[^}]+}\s+from\s+['"]react['"]/,
            newImportLine,
          );

          try {
            await sandbox.files.write(error.file, fixedFiles[error.file]);
            fixCount++;
          } catch (err) {
            console.error(`  ❌ Failed to write ${error.file}:`, err);
          }
        }
      }
    }

    // ✅ Fix 3: Install missing dependencies
    if (
      error.message.includes("Cannot find module") ||
      error.message.includes("module not found")
    ) {
      const moduleMatch = error.message.match(/['"`]([^'"`@/][^'"`]*)['"`]/);

      if (moduleMatch && moduleMatch[1]) {
        const moduleName = moduleMatch[1];

        if (
          !moduleName.startsWith("@/") &&
          !moduleName.startsWith("./") &&
          !moduleName.startsWith("../")
        ) {
          console.log(`  📦 Installing missing dependency: ${moduleName}`);

          try {
            await sandbox.commands.run(
              `cd /home/project && npm install ${moduleName} --legacy-peer-deps`,
            );
            fixCount++;
            console.log(`  ✅ Installed ${moduleName}`);
          } catch (err) {
            console.log(`  ⚠️ Could not install ${moduleName}`);
          }
        }
      }
    }
  }

  console.log(`✅ Auto-fix completed (${fixCount} fixes applied)`);
  return fixedFiles;
}

export const uiGenerationAgent = inngest.createFunction(
  { id: "ui-Generation-Agent" },
  { event: "ui-Generation-Agent/run" },
  async ({ event, step }) => {
    try {
      if (!event.data?.value || !event.data?.projectId) {
        throw new Error("Missing required data: value or projectId");
      }
      const selectedModel = event.data?.model || "stepfun/step-3.5-flash:free";
      console.log(
        "🚀 Starting UI Generation Agent for project:",
        event.data.projectId,
      );

      // ✅ STEP 1: Load existing files
      const { existingFiles, lastSandboxId, isFirstGeneration } =
        await step.run("load-existing-files-from-database", async () => {
          console.log("📂 Loading existing files from database...");

          const lastFragment = await prisma.fragment.findFirst({
            where: {
              message: {
                projectId: event.data?.projectId,
                type: "RESULT",
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

      // ✅ STEP 2: Setup sandbox with existing files
      const sandboxId = await step.run("setup-sandbox-with-files", async () => {
        console.log("📦 Setting up sandbox...");

        if (lastSandboxId) {
          try {
            console.log(
              "🔄 Attempting to reuse existing sandbox:",
              lastSandboxId,
            );
            const sandbox = await getSandBox(lastSandboxId);
            await sandbox.commands.run("echo 'test'");
            console.log("✅ Reusing existing sandbox");
            return lastSandboxId;
          } catch (error) {
            console.log("⚠️ Existing sandbox expired, creating new one");
          }
        }

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

      // ✅ STEP 3: Load messages with context
      const previousMessages = await step.run(
        "get-previous-messages-with-context",
        async () => {
          console.log("📝 Fetching previous messages...");
          const formattedMessages: Message[] = [];

          // ✅ Add existing files context if not first generation
          if (!isFirstGeneration && Object.keys(existingFiles).length > 0) {
            const fileList = Object.keys(existingFiles)
              .map((f) => `  - ${f}`)
              .join("\n");

            formattedMessages.push({
              type: "text",
              role: "system",
              content: `🔄 EXISTING PROJECT CONTEXT - READ CAREFULLY:

This project has ${Object.keys(existingFiles).length} existing files already loaded from the database:
${fileList}

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
          files: { ...existingFiles },
        },
        {
          messages: previousMessages,
        },
      );

      console.log("🤖 Creating code agent...");
      console.log(
        `📊 State initialized with ${Object.keys(existingFiles).length} existing files`,
      );

      // ✅ STEP 6: Create incremental context
      const incrementalContext = !isFirstGeneration
        ? `

INCREMENTAL DEVELOPMENT MODE - CRITICAL CONTEXT

EXISTING PROJECT STATE:
  - Files in project: ${Object.keys(existingFiles).length}
  - All files are loaded in sandbox from database
  - This is NOT a fresh start - existing code must be preserved

MANDATORY WORKFLOW FOR ALL TASKS:

1. BEFORE ANY CHANGES:
   → Use readFiles() to check current implementation
   → Understand existing code structure

2. MAKE TARGETED CHANGES:
   → Only modify what user explicitly requests
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
  .join("\n")}

⚠️ REMEMBER: Files are already in the sandbox. Read first, modify precisely!
`
        : "";

      // ✅ STEP 7: Create agent with proper tools
      const codeAgent = createAgent<AgentState>({
        name: "code-agent",
        description: "An Expert coding agent for incremental UI development",
        system: prompts.system + incrementalContext,
        // model: openai({
        //   model: selectedModel,
        //   defaultParameters: { temperature: 0.1 },
        // }),
        model: openai({
          model: selectedModel, // OpenRouter model string
          apiKey: process.env.OPENROUTER_API_KEY,
          baseUrl: "https://openrouter.ai/api/v1",
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

      // ✅ STEP 8: Create network
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

      // ✅ STEP 9: Run the network
      console.log("🚀 Running agent network...");
      const result = await network.run(event.data?.value, { state });
      console.log("✅ Agent network execution completed");

      // ✅ STEP 10: Merge files BEFORE error detection
      const mergedFiles = {
        ...existingFiles,
        ...result.state.data.files,
      };

      console.log("📊 Files merged:");
      console.log(`  - Existing files: ${Object.keys(existingFiles).length}`);
      console.log(
        `  - Modified/new files: ${Object.keys(result.state.data.files || {}).length}`,
      );
      console.log(`  - Total files: ${Object.keys(mergedFiles).length}`);

      // ✅ STEP 11: ERROR DETECTION & AUTO-FIX
      const { detectedErrors, fixedFiles, errorSummary } = await step.run(
        "detect-and-fix-errors",
        async () => {
          console.log("\n🔍 ===== FINAL ERROR CHECK =====\n");

          // Detect errors using merged files
          const errorResult = await detectErrorsInSandbox(
            sandboxId,
            mergedFiles,
          );

          if (!errorResult.hasErrors) {
            console.log("✅ No errors - preview ready!");
            return {
              detectedErrors: [],
              fixedFiles: mergedFiles,
              errorSummary: errorResult.summary,
            };
          }

          console.log(`⚠️ Found ${errorResult.errors.length} issues`);
          console.log("🔧 Attempting auto-fix...\n");

          // Auto-fix
          const fixed = await autoFixErrors(
            sandboxId,
            mergedFiles,
            errorResult.errors,
          );

          // Re-check
          console.log("\n🔍 Re-checking after fixes...");
          const recheckResult = await detectErrorsInSandbox(sandboxId, fixed);

          if (!recheckResult.hasErrors) {
            console.log("✅ All errors fixed!");
            return {
              detectedErrors: errorResult.errors,
              fixedFiles: fixed,
              errorSummary: "✅ Auto-fixed successfully",
            };
          } else {
            console.log(`⚠️ ${recheckResult.errors.length} issues remain`);
            return {
              detectedErrors: recheckResult.errors,
              fixedFiles: fixed,
              errorSummary: `⚠️ ${recheckResult.errors.length} issue(s) remain`,
            };
          }
        },
      );

      // ✅ STEP 12: Check for critical errors
      const isError =
        !result.state.data.summary ||
        Object.keys(fixedFiles || {}).length === 0;

      if (isError) {
        console.warn("⚠️ Generation completed with errors or no files");
        console.warn("- Has summary:", !!result.state.data.summary);
        console.warn("- Files count:", Object.keys(fixedFiles || {}).length);
      }

      // ✅ STEP 13: Get sandbox URL
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

      // ✅ STEP 14: Generate responses
      console.log("🏷️ Generating fragment title...");
      const fragmentTitleGenerator = createAgent({
        name: "fragment-title-generator",
        description: "Generates a concise title for the UI fragment",
        system: prompts.title,
        // model: openai({ model: "gpt-4o-mini" }),
        model: openai({
          model: "stepfun/step-3.5-flash:free", // OpenRouter model string
          apiKey: process.env.OPENROUTER_API_KEY,
          baseUrl: "https://openrouter.ai/api/v1",
          defaultParameters: { temperature: 0.1 },
        }),
      });

      console.log("💬 Generating user response...");
      const responseGenerator = createAgent({
        name: "response-generator",
        description: "Generates a user-friendly response",
        system: prompts.response,
        // model: openai({ model: "gpt-4o-mini" }),
        model: openai({
          model: "stepfun/step-3.5-flash:free", // OpenRouter model string
          apiKey: process.env.OPENROUTER_API_KEY,
          baseUrl: "https://openrouter.ai/api/v1",
          defaultParameters: { temperature: 0.1 },
        }),
      });

      const { output: fragmentTitleOutput } = await fragmentTitleGenerator.run(
        result.state.data.summary || "UI Fragment",
      );

      const responseContext =
        detectedErrors.length > 0
          ? `${result.state.data.summary}\n\n${errorSummary}`
          : result.state.data.summary || "Task completed successfully";

      const { output: responseOutput } =
        await responseGenerator.run(responseContext);

      // ✅ STEP 15: Save to database
      await step.run("save-result-with-fixed-files", async () => {
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

        console.log("✅ Saving successful result with fragment");
        console.log(
          `📦 Total files in fragment: ${Object.keys(fixedFiles).length}`,
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
                files: fixedFiles, // ✅ Save fixed files
              },
            },
          },
        });
      });

      console.log(
        `\n🎉 UI Generation Agent completed! Errors fixed: ${detectedErrors.length}\n`,
      );

      return {
        url: sandboxUrl,
        title: parseAgentOutput(fragmentTitleOutput),
        files: fixedFiles,
        summary: result.state.data.summary,
        errorsFixed: detectedErrors.length,
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

// // 1. User: "Create a counter with increment/decrement"
// //    ↓
// // 2. Agent generates all code
// //    ↓
// // 3. Get sandbox URL
// //    ↓
// // 4. ✅ FINAL ERROR CHECK (10 seconds)
// //    ├─ Dev server check (10s)
// //    │  └─ Finds: "useState is not defined"
// //    │
// //    └─ File analysis (<1s)
// //       └─ Finds: "Missing 'use client' in app/page.tsx"
// //    ↓
// // 5. 🔧 AUTO-FIX
// //    └─ Adds 'use client' to app/page.tsx
// //    ↓
// // 6. 🔍 RE-CHECK (10s)
// //    └─ ✅ No errors!
// //    ↓
// // 7. 💾 Save fixed files to database
// //    ↓
// // 8. ✅ Return URL to user

// // Total time: ~20 seconds (vs 45-55 seconds with build)
