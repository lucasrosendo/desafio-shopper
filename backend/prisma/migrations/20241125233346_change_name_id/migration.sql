/*
  Warnings:

  - The primary key for the `Driver` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Driver` table. All the data in the column will be lost.
  - The primary key for the `Rides` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `driverId` on the `Rides` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Rides` table. All the data in the column will be lost.
  - The required column `driver_id` was added to the `Driver` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `driver_id` to the `Rides` table without a default value. This is not possible if the table is not empty.
  - The required column `ride_id` was added to the `Rides` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "Rides" DROP CONSTRAINT "Rides_driverId_fkey";

-- AlterTable
ALTER TABLE "Driver" DROP CONSTRAINT "Driver_pkey",
DROP COLUMN "id",
ADD COLUMN     "driver_id" TEXT NOT NULL,
ADD CONSTRAINT "Driver_pkey" PRIMARY KEY ("driver_id");

-- AlterTable
ALTER TABLE "Rides" DROP CONSTRAINT "Rides_pkey",
DROP COLUMN "driverId",
DROP COLUMN "id",
ADD COLUMN     "driver_id" TEXT NOT NULL,
ADD COLUMN     "ride_id" TEXT NOT NULL,
ADD CONSTRAINT "Rides_pkey" PRIMARY KEY ("ride_id");

-- AddForeignKey
ALTER TABLE "Rides" ADD CONSTRAINT "Rides_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "Driver"("driver_id") ON DELETE RESTRICT ON UPDATE CASCADE;
