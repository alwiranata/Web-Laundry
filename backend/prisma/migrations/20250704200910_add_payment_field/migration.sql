-- CreateEnum
CREATE TYPE "OrderPayment" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "payment" "OrderPayment";
