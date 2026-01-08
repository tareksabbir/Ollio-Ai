import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { fragmentId } = await req.json();

    // 1. Fetch Fragment
    const fragment = await prisma.fragment.findUnique({
      where: { id: fragmentId },
    });

    if (!fragment || !fragment.files) {
      return NextResponse.json(
        { error: "Fragment not found or empty" },
        { status: 404 }
      );
    }

    // 2. Setup Temporary Directory (/tmp use hobe eta serverless e safe)
    const timestamp = Date.now();
    const tempDir = `/tmp/project-${timestamp}`;
    const archivePath = `/tmp/project-${timestamp}.tar.gz`;

    // Folder create korbo
    fs.mkdirSync(tempDir, { recursive: true });

    try {
      // 3. Files ke File System e Write korbo
      for (const [filePath, content] of Object.entries(fragment.files)) {
        if (typeof content !== "string") continue;

        const fullPath = path.join(tempDir, filePath);
        const dir = path.dirname(fullPath);

        // Folder create jodi na thake
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        // File write
        fs.writeFileSync(fullPath, content);
      }

      // 4. System `tar` command die compress korbo (Node.js native)
      // `tar -czf archive.tar.gz -C source_folder .`
      await execAsync(`tar -czf ${archivePath} -C ${tempDir} .`);

      // 5. Zip file read korbo
      const fileBuffer = fs.readFileSync(archivePath);

      // 6. Response send korbo
      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          "Content-Type": "application/gzip",
          "Content-Disposition": `attachment; filename="${fragment.title.replace(/\s+/g, "-")}-source.tar.gz"`,
          "Content-Length": fileBuffer.length.toString(),
        },
      });

    } finally {
      // 7. Cleanup: Temporary files delete korbo (Important)
      try {
        fs.rmSync(tempDir, { recursive: true, force: true });
        fs.rmSync(archivePath, { force: true });
      } catch (cleanupError) {
        console.error("Cleanup failed:", cleanupError);
      }
    }

  } catch (error) {
    console.error("Download Error:", error);
    return NextResponse.json(
      { error: "Failed to prepare download" },
      { status: 500 }
    );
  }
}