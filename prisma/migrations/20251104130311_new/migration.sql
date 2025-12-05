/*
  Warnings:

  - You are about to drop the column `type_tag` on the `activity` table. All the data in the column will be lost.
  - You are about to drop the `_ActivityLogToUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ApprovalToUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CandidateToInstitution` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CandidateToUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_NotificationToUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PaymentToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `description` to the `activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `drive` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ActivityCategory" AS ENUM ('Independent', 'PartOfDrive', 'PreRequisite');

-- DropForeignKey
ALTER TABLE "public"."_ActivityLogToUser" DROP CONSTRAINT "_ActivityLogToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_ActivityLogToUser" DROP CONSTRAINT "_ActivityLogToUser_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."_ApprovalToUser" DROP CONSTRAINT "_ApprovalToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_ApprovalToUser" DROP CONSTRAINT "_ApprovalToUser_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."_CandidateToInstitution" DROP CONSTRAINT "_CandidateToInstitution_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_CandidateToInstitution" DROP CONSTRAINT "_CandidateToInstitution_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."_CandidateToUser" DROP CONSTRAINT "_CandidateToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_CandidateToUser" DROP CONSTRAINT "_CandidateToUser_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."_NotificationToUser" DROP CONSTRAINT "_NotificationToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_NotificationToUser" DROP CONSTRAINT "_NotificationToUser_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."_PaymentToUser" DROP CONSTRAINT "_PaymentToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_PaymentToUser" DROP CONSTRAINT "_PaymentToUser_B_fkey";

-- AlterTable
ALTER TABLE "activity" DROP COLUMN "type_tag",
ADD COLUMN     "category" "ActivityCategory",
ADD COLUMN     "description" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "drive" ADD COLUMN     "description" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."_ActivityLogToUser";

-- DropTable
DROP TABLE "public"."_ApprovalToUser";

-- DropTable
DROP TABLE "public"."_CandidateToInstitution";

-- DropTable
DROP TABLE "public"."_CandidateToUser";

-- DropTable
DROP TABLE "public"."_NotificationToUser";

-- DropTable
DROP TABLE "public"."_PaymentToUser";

-- DropEnum
DROP TYPE "public"."ActivityTypeTag";

-- AddForeignKey
ALTER TABLE "candidate" ADD CONSTRAINT "candidate_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidate" ADD CONSTRAINT "candidate_institution_id_fkey" FOREIGN KEY ("institution_id") REFERENCES "institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidate" ADD CONSTRAINT "candidate_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_log" ADD CONSTRAINT "activity_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "approval" ADD CONSTRAINT "approval_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
