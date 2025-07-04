/*
  Warnings:

  - The values [IN_PROGRESS,CANCELLED] on the enum `OrderStatusPayment` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OrderStatusPayment_new" AS ENUM ('PENDING', 'COMPLETED');
ALTER TABLE "Order" ALTER COLUMN "statusPayment" TYPE "OrderStatusPayment_new" USING ("statusPayment"::text::"OrderStatusPayment_new");
ALTER TYPE "OrderStatusPayment" RENAME TO "OrderStatusPayment_old";
ALTER TYPE "OrderStatusPayment_new" RENAME TO "OrderStatusPayment";
DROP TYPE "OrderStatusPayment_old";
COMMIT;
