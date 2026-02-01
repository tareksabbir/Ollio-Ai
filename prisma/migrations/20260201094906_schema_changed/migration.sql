-- CreateTable
CREATE TABLE "PromptTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "content" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "successRate" DOUBLE PRECISION,
    "avgLatency" DOUBLE PRECISION,
    "description" TEXT,
    "category" TEXT,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,

    CONSTRAINT "PromptTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromptVersion" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "metadata" JSONB,
    "changeLog" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PromptVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromptExperiment" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "variant" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "trafficPercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "successRate" DOUBLE PRECISION,
    "avgLatency" DOUBLE PRECISION,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PromptExperiment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromptLog" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "promptName" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "variant" TEXT,
    "latency" INTEGER NOT NULL,
    "success" BOOLEAN NOT NULL,
    "error" TEXT,
    "projectId" TEXT,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PromptLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PromptTemplate_name_key" ON "PromptTemplate"("name");

-- CreateIndex
CREATE INDEX "PromptTemplate_name_isActive_idx" ON "PromptTemplate"("name", "isActive");

-- CreateIndex
CREATE INDEX "PromptTemplate_category_idx" ON "PromptTemplate"("category");

-- CreateIndex
CREATE INDEX "PromptVersion_templateId_createdAt_idx" ON "PromptVersion"("templateId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "PromptVersion_templateId_version_key" ON "PromptVersion"("templateId", "version");

-- CreateIndex
CREATE INDEX "PromptExperiment_templateId_isActive_idx" ON "PromptExperiment"("templateId", "isActive");

-- CreateIndex
CREATE INDEX "PromptExperiment_variant_idx" ON "PromptExperiment"("variant");

-- CreateIndex
CREATE INDEX "PromptLog_templateId_createdAt_idx" ON "PromptLog"("templateId", "createdAt");

-- CreateIndex
CREATE INDEX "PromptLog_promptName_success_idx" ON "PromptLog"("promptName", "success");

-- CreateIndex
CREATE INDEX "PromptLog_projectId_idx" ON "PromptLog"("projectId");

-- AddForeignKey
ALTER TABLE "PromptVersion" ADD CONSTRAINT "PromptVersion_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "PromptTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromptExperiment" ADD CONSTRAINT "PromptExperiment_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "PromptTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
