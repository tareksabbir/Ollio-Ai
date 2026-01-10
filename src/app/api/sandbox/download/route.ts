import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";
import archiver from "archiver";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { 
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const { fragmentId } = await req.json();

    const fragment = await prisma.fragment.findUnique({
      where: { id: fragmentId },
    });

    if (!fragment || !fragment.files) {
      return new Response(
        JSON.stringify({ error: "Fragment not found or empty" }), 
        { 
          status: 404,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const archive = archiver("zip", { zlib: { level: 9 } });

    // Add files
    for (const [filePath, content] of Object.entries(fragment.files)) {
      if (typeof content !== "string") continue;
      archive.append(content, { name: filePath });
    }

    // Create ReadableStream from archiver
    const stream = new ReadableStream({
      start(controller) {
        archive.on("data", (chunk: Buffer) => {
          controller.enqueue(new Uint8Array(chunk));
        });
        
        archive.on("end", () => {
          controller.close();
        });
        
        archive.on("error", (err) => {
          controller.error(err);
        });

        // Start archiving
        archive.finalize();
      },
    });

    const fileName = `${fragment.title.replace(/\s+/g, "-")}-source.zip`;

    return new Response(stream, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });

  } catch (error) {
    console.error("Download Error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Failed to prepare download",
        details: error instanceof Error ? error.message : "Unknown error"
      }),
      { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}

export const maxDuration = 30;