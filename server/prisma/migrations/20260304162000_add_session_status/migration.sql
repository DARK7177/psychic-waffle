/*
  Warnings:

  - A unique constraint covering the columns `[name,courseCode]` on the table `Subject` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'active';

-- CreateIndex
CREATE UNIQUE INDEX "Subject_name_courseCode_key" ON "Subject"("name", "courseCode");
