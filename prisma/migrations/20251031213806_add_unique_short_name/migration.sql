/*
  Warnings:

  - A unique constraint covering the columns `[short_name]` on the table `department` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "department_short_name_key" ON "department"("short_name");
