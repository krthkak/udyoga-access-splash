/*
  Warnings:

  - The values [PreRequisite] on the enum `ActivityCategory` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `bg_color` on the `drive` table. All the data in the column will be lost.
  - You are about to drop the column `pre_requisities` on the `drive` table. All the data in the column will be lost.
  - You are about to drop the column `stages` on the `drive` table. All the data in the column will be lost.
  - You are about to drop the column `activity_id` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the column `drive_id` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the column `transaction_id` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `payment` table. All the data in the column will be lost.
  - You are about to alter the column `amount` on the `payment` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - A unique constraint covering the columns `[provider_order_id]` on the table `payment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[provider_payment_id]` on the table `payment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `type` to the `drive_activity` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DriveActivityType" AS ENUM ('STAGE', 'PREREQUISITE');

-- AlterEnum
BEGIN;
CREATE TYPE "ActivityCategory_new" AS ENUM ('Independent', 'PartOfDrive');
ALTER TABLE "activity" ALTER COLUMN "category" TYPE "ActivityCategory_new" USING ("category"::text::"ActivityCategory_new");
ALTER TYPE "ActivityCategory" RENAME TO "ActivityCategory_old";
ALTER TYPE "ActivityCategory_new" RENAME TO "ActivityCategory";
DROP TYPE "public"."ActivityCategory_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "payment" DROP CONSTRAINT "payment_activity_id_fkey";

-- DropForeignKey
ALTER TABLE "payment" DROP CONSTRAINT "payment_drive_id_fkey";

-- DropForeignKey
ALTER TABLE "payment" DROP CONSTRAINT "payment_user_id_fkey";

-- AlterTable
ALTER TABLE "drive" DROP COLUMN "bg_color",
DROP COLUMN "pre_requisities",
DROP COLUMN "stages",
ADD COLUMN     "company_name" TEXT NOT NULL DEFAULT 'company_name';

-- AlterTable
ALTER TABLE "drive_activity" ADD COLUMN     "type" "DriveActivityType" NOT NULL;

-- AlterTable
ALTER TABLE "payment" DROP COLUMN "activity_id",
DROP COLUMN "drive_id",
DROP COLUMN "transaction_id",
DROP COLUMN "user_id",
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'INR',
ADD COLUMN     "fee" DECIMAL(10,2),
ADD COLUMN     "idempotency_key" TEXT,
ADD COLUMN     "notes" JSONB,
ADD COLUMN     "provider" TEXT,
ADD COLUMN     "provider_order_id" TEXT,
ADD COLUMN     "provider_payment_id" TEXT,
ADD COLUMN     "provider_response" JSONB,
ADD COLUMN     "provider_signature" TEXT,
ADD COLUMN     "receipt" TEXT,
ADD COLUMN     "tax" DECIMAL(10,2),
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(10,2);

-- CreateTable
CREATE TABLE "CollegeAdmin" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "institution_id" TEXT NOT NULL,
    "created_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CollegeAdmin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "candidate_payment" (
    "id" TEXT NOT NULL,
    "candidate_id" TEXT NOT NULL,
    "activity_id" TEXT,
    "drive_id" TEXT,
    "payment_id" TEXT,
    "amount" DECIMAL(10,2),
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "status" "PaymentStatus" NOT NULL DEFAULT 'pending',
    "transaction_type" "TransactionType" NOT NULL,
    "created_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "candidate_payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CollegeAdmin_email_key" ON "CollegeAdmin"("email");

-- CreateIndex
CREATE INDEX "candidate_payment_candidate_id_idx" ON "candidate_payment"("candidate_id");

-- CreateIndex
CREATE INDEX "candidate_payment_payment_id_idx" ON "candidate_payment"("payment_id");

-- CreateIndex
CREATE INDEX "candidate_payment_activity_id_idx" ON "candidate_payment"("activity_id");

-- CreateIndex
CREATE INDEX "candidate_payment_drive_id_idx" ON "candidate_payment"("drive_id");

-- CreateIndex
CREATE UNIQUE INDEX "payment_provider_order_id_key" ON "payment"("provider_order_id");

-- CreateIndex
CREATE UNIQUE INDEX "payment_provider_payment_id_key" ON "payment"("provider_payment_id");

-- AddForeignKey
ALTER TABLE "candidate_payment" ADD CONSTRAINT "candidate_payment_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidate_payment" ADD CONSTRAINT "candidate_payment_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidate_payment" ADD CONSTRAINT "candidate_payment_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidate_payment" ADD CONSTRAINT "candidate_payment_drive_id_fkey" FOREIGN KEY ("drive_id") REFERENCES "drive"("id") ON DELETE SET NULL ON UPDATE CASCADE;
