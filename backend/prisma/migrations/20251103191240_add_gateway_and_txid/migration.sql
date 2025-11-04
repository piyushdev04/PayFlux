-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "gateway" TEXT NOT NULL DEFAULT 'Stripe',
ADD COLUMN     "transactionId" TEXT;
