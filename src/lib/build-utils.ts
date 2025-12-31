/* eslint-disable @typescript-eslint/no-unused-vars */
// lib/build-utils.ts (Enhanced Version)
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";

const execAsync = promisify(exec);

export async function buildNextJsProject(
  files: Record<string, string>,
  projectId: string
): Promise<{ success: boolean; buildPath: string; error?: string }> {
  const buildDir = path.join(process.cwd(), "builds", projectId);
  const baseTemplate = path.join(process.cwd(), "base-template");

  try {
    console.log(`[Build] Starting build for project ${projectId}`);

    // Step 1: Check if base template exists
    const hasBaseTemplate = await fs
      .access(baseTemplate)
      .then(() => true)
      .catch(() => false);

    if (hasBaseTemplate) {
      console.log(`[Build] Using base template for faster build`);
      
      // Copy base template instead of creating from scratch
      await execAsync(`cp -r ${baseTemplate} ${buildDir}`);
    } else {
      console.log(`[Build] No base template found, creating from scratch`);
      await fs.mkdir(buildDir, { recursive: true });
      
      // Create Next.js app from scratch (slower)
      await execAsync(
        "npx --yes create-next-app@latest . --yes",
        { cwd: buildDir, timeout: 300000 }
      );
      
      // Initialize Shadcn
      await execAsync(
        "npx --yes shadcn@latest init --yes -b neutral --force",
        { cwd: buildDir, timeout: 300000 }
      );
      
      // Add all components
      await execAsync(
        "npx --yes shadcn@latest add --all --yes",
        { cwd: buildDir, timeout: 300000 }
      );
    }

    // Step 2: Write agent-generated files (overwrite existing)
    console.log(`[Build] Writing ${Object.keys(files).length} files`);
    for (const [filePath, content] of Object.entries(files)) {
      const fullPath = path.join(buildDir, filePath);
      await fs.mkdir(path.dirname(fullPath), { recursive: true });
      await fs.writeFile(fullPath, content);
    }

    // Step 3: Install only NEW dependencies (if any in files)
    const needsInstall = await checkIfNeedsInstall(files, buildDir);
    if (needsInstall) {
      console.log(`[Build] Installing additional dependencies...`);
      await execAsync("npm install --legacy-peer-deps", {
        cwd: buildDir,
        timeout: 300000,
      });
    }

    // Step 4: Build the project
    console.log(`[Build] Building Next.js project...`);
    await execAsync("npm run build", {
      cwd: buildDir,
      timeout: 300000,
    });

    console.log(`[Build] ✅ Build successful for ${projectId}`);
    return {
      success: true,
      buildPath: buildDir,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[Build] ❌ Build failed for ${projectId}:`, errorMessage);

    return {
      success: false,
      buildPath: buildDir,
      error: errorMessage,
    };
  }
}

// Check if package.json was modified and needs npm install
async function checkIfNeedsInstall(
  files: Record<string, string>,
  buildDir: string
): Promise<boolean> {
  // If agent created/modified package.json, we need to install
  if (files["package.json"]) {
    return true;
  }

  // Check if any import statements use packages not in base template
  const codeFiles = Object.entries(files).filter(([path]) =>
    /\.(tsx?|jsx?)$/.test(path)
  );

  for (const [, content] of codeFiles) {
    // Check for imports that might be new packages
    const importMatches = content.match(/import .+ from ['"]([^'"]+)['"]/g);
    if (importMatches) {
      for (const match of importMatches) {
        const pkg = match.match(/from ['"]([^'"]+)['"]/)?.[1];
        // If importing from npm package (not relative path)
        if (pkg && !pkg.startsWith(".") && !pkg.startsWith("@/")) {
          // Check if it's a standard package
          const standardPackages = [
            "react",
            "react-dom",
            "next",
            "lucide-react",
            "tailwindcss",
          ];
          if (!standardPackages.some((std) => pkg.startsWith(std))) {
            return true; // New package detected
          }
        }
      }
    }
  }

  return false;
}

export async function getPreviewUrl(projectId: string): Promise<string> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return `${baseUrl}/preview/${projectId}`;
}

export async function cleanupBuildDirectory(projectId: string): Promise<void> {
  const buildDir = path.join(process.cwd(), "builds", projectId);

  try {
    await fs.rm(buildDir, { recursive: true, force: true });
    console.log(`[Cleanup] Removed build directory: ${buildDir}`);
  } catch (error) {
    console.error(`[Cleanup] Failed to remove ${buildDir}:`, error);
  }
}

// Optional: Create base template programmatically
export async function createBaseTemplate(): Promise<void> {
  const baseTemplate = path.join(process.cwd(), "base-template");

  console.log("[Setup] Creating base template...");

  await fs.mkdir(baseTemplate, { recursive: true });

  // Create Next.js app
  await execAsync("npx --yes create-next-app@latest . --yes", {
    cwd: baseTemplate,
    timeout: 300000,
  });

  // Initialize Shadcn
  await execAsync("npx --yes shadcn@latest init --yes -b neutral --force", {
    cwd: baseTemplate,
    timeout: 300000,
  });

  // Add all components
  await execAsync("npx --yes shadcn@latest add --all --yes", {
    cwd: baseTemplate,
    timeout: 300000,
  });

  console.log("[Setup] ✅ Base template created successfully");
}