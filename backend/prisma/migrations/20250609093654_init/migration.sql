-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('CUCI', 'SETRIKA', 'CUCI_SETRIKA');

-- CreateEnum
CREATE TYPE "ServiceCategory" AS ENUM ('NORMAL', 'EXPRESS');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" INTEGER NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "uniqueCode" TEXT NOT NULL,
    "adminId" INTEGER NOT NULL,
    "serviceType" "ServiceType" NOT NULL,
    "serviceCategory" "ServiceCategory" NOT NULL,
    "Category" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "dropOffDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pickUpDate" TIMESTAMP(3) NOT NULL,
    "status" "OrderStatus" NOT NULL,
    "price" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Order_uniqueCode_key" ON "Order"("uniqueCode");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
