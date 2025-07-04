/*
  Warnings:

  - Made the column `payment` on table `Order` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "payment" SET NOT NULL;
