/*
  Warnings:

  - Changed the type of `customer_id` on the `Rides` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Rides" DROP COLUMN "customer_id",
ADD COLUMN     "customer_id" INTEGER NOT NULL;
