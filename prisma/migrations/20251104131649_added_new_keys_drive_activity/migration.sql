-- AlterTable
ALTER TABLE "activity" ADD COLUMN     "allowed_sem" INTEGER,
ADD COLUMN     "cgpa_greater_than" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "drive" ADD COLUMN     "allowed_sem" INTEGER,
ADD COLUMN     "cgpa_greater_than" DOUBLE PRECISION;
