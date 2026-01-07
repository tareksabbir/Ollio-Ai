-- CreateTable
CREATE TABLE "HtmlProject" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "htmlContent" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "views" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HtmlProject_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HtmlProject_category_idx" ON "HtmlProject"("category");

-- CreateIndex
CREATE INDEX "HtmlProject_userId_idx" ON "HtmlProject"("userId");

-- CreateIndex
CREATE INDEX "HtmlProject_isPublic_idx" ON "HtmlProject"("isPublic");
