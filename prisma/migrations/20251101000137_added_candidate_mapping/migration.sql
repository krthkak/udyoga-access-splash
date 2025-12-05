-- CreateTable
CREATE TABLE "_CandidateToInstitution" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CandidateToInstitution_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CandidateToInstitution_B_index" ON "_CandidateToInstitution"("B");

-- AddForeignKey
ALTER TABLE "_CandidateToInstitution" ADD CONSTRAINT "_CandidateToInstitution_A_fkey" FOREIGN KEY ("A") REFERENCES "candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CandidateToInstitution" ADD CONSTRAINT "_CandidateToInstitution_B_fkey" FOREIGN KEY ("B") REFERENCES "institution"("id") ON DELETE CASCADE ON UPDATE CASCADE;
