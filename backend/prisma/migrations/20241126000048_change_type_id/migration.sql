/*
  Warnings:

  - The primary key for the `Driver` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Rides` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `ride_id` column on the `Rides` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `driver_id` on the `Driver` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `driver_id` on the `Rides` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Rides" DROP CONSTRAINT "Rides_driver_id_fkey";

-- AlterTable
ALTER TABLE "Driver" DROP CONSTRAINT "Driver_pkey",
DROP COLUMN "driver_id",
ADD COLUMN     "driver_id" INTEGER NOT NULL,
ADD CONSTRAINT "Driver_pkey" PRIMARY KEY ("driver_id");

-- AlterTable
ALTER TABLE "Rides" DROP CONSTRAINT "Rides_pkey",
DROP COLUMN "driver_id",
ADD COLUMN     "driver_id" INTEGER NOT NULL,
DROP COLUMN "ride_id",
ADD COLUMN     "ride_id" SERIAL NOT NULL,
ADD CONSTRAINT "Rides_pkey" PRIMARY KEY ("ride_id");

-- AddForeignKey
ALTER TABLE "Rides" ADD CONSTRAINT "Rides_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "Driver"("driver_id") ON DELETE RESTRICT ON UPDATE CASCADE;
