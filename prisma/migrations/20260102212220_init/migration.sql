/*
  Warnings:

  - Added the required column `userId` to the `Fragment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Fragment" ADD COLUMN     "userId" TEXT NOT NULL;
