/*
  Warnings:

  - Added the required column `priceCategory` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "priceCategory" INTEGER NOT NULL,
ALTER COLUMN "dropOffDate" DROP DEFAULT;
