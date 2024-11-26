/*
  Warnings:

  - Added the required column `comment` to the `Driver` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Driver" ADD COLUMN     "comment" TEXT NOT NULL;
