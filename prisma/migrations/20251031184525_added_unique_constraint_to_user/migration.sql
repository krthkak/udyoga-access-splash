/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `candidate` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "candidate_user_id_key" ON "candidate"("user_id");
