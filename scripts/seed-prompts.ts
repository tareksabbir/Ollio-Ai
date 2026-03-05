// scripts/seed-prompts.ts
import prisma from "../src/lib/db";
import {
  PROMPT,
  RESPONSE_PROMPT,
  FRAGMENT_TITLE_PROMPT,
} from "../src/prompt/ui-prompt";

async function main() {
  try {
    console.log("🔍 Checking database connection...");

    await prisma.$connect();
    console.log("✅ Database connected successfully!");

    console.log("🌱 Seeding prompts...");

    // UI Generation Prompt
    const uiPrompt = await prisma.promptTemplate.upsert({
      where: { name: "ui-generation" },
      update: {
        content: PROMPT,
        updatedAt: new Date(),
      },
      create: {
        name: "ui-generation",
        content: PROMPT,
        description: "Main system prompt for UI generation agent",
        category: "system",
        tags: ["production", "ui", "generation"],
        metadata: {
          model: "stepfun/step-3.5-flash:free",
          temperature: 0.1,
          maxTokens: 4000,
        },
      },
    });
    console.log(`✅ Created/Updated: ${uiPrompt.name} (v${uiPrompt.version})`);

    // Response Generation Prompt
    const responsePrompt = await prisma.promptTemplate.upsert({
      where: { name: "response-generation" },
      update: {
        content: RESPONSE_PROMPT,
        updatedAt: new Date(),
      },
      create: {
        name: "response-generation",
        content: RESPONSE_PROMPT,
        description: "Generates user-friendly response messages",
        category: "response",
        tags: ["production", "response"],
        metadata: {
          model: "stepfun/step-3.5-flash:free",
        },
      },
    });
    console.log(
      `✅ Created/Updated: ${responsePrompt.name} (v${responsePrompt.version})`,
    );

    // Fragment Title Prompt
    const titlePrompt = await prisma.promptTemplate.upsert({
      where: { name: "fragment-title" },
      update: {
        content: FRAGMENT_TITLE_PROMPT,
        updatedAt: new Date(),
      },
      create: {
        name: "fragment-title",
        content: FRAGMENT_TITLE_PROMPT,
        description: "Generates short titles for code fragments",
        category: "response",
        tags: ["production", "title"],
        metadata: {
          model: "stepfun/step-3.5-flash:free",
        },
      },
    });
    console.log(
      `✅ Created/Updated: ${titlePrompt.name} (v${titlePrompt.version})`,
    );

    console.log("\n🎉 All prompts seeded successfully!");

    const allPrompts = await prisma.promptTemplate.findMany({
      select: {
        name: true,
        version: true,
        category: true,
        usageCount: true,
      },
    });

    console.log("\n📊 Current Prompts:");
    console.table(allPrompts);
  } catch (error) {
    console.error("\n❌ Error seeding prompts:");

    if (error instanceof Error) {
      console.error(error.message);
      console.error(error.stack);
    }

    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    console.log("\n🔌 Disconnecting from database...");
    await prisma.$disconnect();
    console.log("✅ Disconnected successfully!");
  });
