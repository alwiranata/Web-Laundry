/*
  Warnings:

  - Changed the type of `payment` on the `Order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "OrderStatusPayment" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "payment",
ADD COLUMN     "payment" "OrderStatusPayment" NOT NULL;

-- DropEnum
DROP TYPE "OrderPayment";
