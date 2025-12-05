/*
  Warnings:

  - Added the required column `baseprice` to the `drive` table without a default value. This is not possible if the table is not empty.
  - Added the required column `baseprice` to the `institution_drive` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CandidateStatus" AS ENUM ('verified', 'unverified');

-- AlterTable
ALTER TABLE "activity" ALTER COLUMN "status" SET DEFAULT 'active';

-- AlterTable
ALTER TABLE "candidate" ADD COLUMN     "status" "CandidateStatus" NOT NULL DEFAULT 'unverified';

-- AlterTable
ALTER TABLE "candidate_drive" ADD COLUMN     "enrollment_date" TIMESTAMP(6);

-- AlterTable
ALTER TABLE "drive" ADD COLUMN     "baseprice" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "bg_color" TEXT,
ADD COLUMN     "pre_requisities" TEXT[],
ADD COLUMN     "stages" TEXT[],
ADD COLUMN     "tag" TEXT,
ALTER COLUMN "status" SET DEFAULT 'active';

-- AlterTable
ALTER TABLE "drive_activity" ALTER COLUMN "status" SET DEFAULT 'active';

-- AlterTable
ALTER TABLE "institution_activity" ALTER COLUMN "status" SET DEFAULT 'active';

-- AlterTable
ALTER TABLE "institution_drive" ADD COLUMN     "baseprice" DECIMAL(10,2) NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'active';

-- CreateTable
CREATE TABLE "_DriveDepartments" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DriveDepartments_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ActivityDepartments" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ActivityDepartments_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_DriveDepartments_B_index" ON "_DriveDepartments"("B");

-- CreateIndex
CREATE INDEX "_ActivityDepartments_B_index" ON "_ActivityDepartments"("B");

-- AddForeignKey
ALTER TABLE "_DriveDepartments" ADD CONSTRAINT "_DriveDepartments_A_fkey" FOREIGN KEY ("A") REFERENCES "department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DriveDepartments" ADD CONSTRAINT "_DriveDepartments_B_fkey" FOREIGN KEY ("B") REFERENCES "drive"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActivityDepartments" ADD CONSTRAINT "_ActivityDepartments_A_fkey" FOREIGN KEY ("A") REFERENCES "activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActivityDepartments" ADD CONSTRAINT "_ActivityDepartments_B_fkey" FOREIGN KEY ("B") REFERENCES "department"("id") ON DELETE CASCADE ON UPDATE CASCADE;
