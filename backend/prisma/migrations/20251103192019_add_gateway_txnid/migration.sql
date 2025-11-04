/*
  Warnings:

  - Made the column `transactionId` on table `Payment` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Payment" ALTER COLUMN "gateway" SET DEFAULT 'razorpay',
ALTER COLUMN "transactionId" SET NOT NULL;
