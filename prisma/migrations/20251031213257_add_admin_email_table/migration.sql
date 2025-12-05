-- CreateTable
CREATE TABLE "AdminEmail" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "created_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminEmail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminEmail_email_key" ON "AdminEmail"("email");
