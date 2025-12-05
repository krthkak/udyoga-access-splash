/*
  Warnings:

  - You are about to drop the column `contactPerson` on the `institution` table. All the data in the column will be lost.
  - You are about to drop the column `contactPhoneDetails` on the `institution` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "institution" DROP COLUMN "contactPerson",
DROP COLUMN "contactPhoneDetails",
ADD COLUMN     "contact_person" TEXT,
ADD COLUMN     "contact_phone_details" TEXT;
