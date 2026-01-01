-- AlterTable
ALTER TABLE "Fragment" ADD COLUMN     "sandboxId" TEXT,
ADD COLUMN     "sandboxUpdatedAt" TIMESTAMP(3),
ALTER COLUMN "sandboxUrl" DROP NOT NULL;
