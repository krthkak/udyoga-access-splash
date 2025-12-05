-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female', 'others');

-- CreateEnum
CREATE TYPE "InstitutionStatus" AS ENUM ('verified', 'unverified');

-- CreateEnum
CREATE TYPE "EntityStatus" AS ENUM ('approved', 'active', 'rejected', 'pending', 'inactive');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('JD', 'certificate', 'resume');

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('GD', 'interview', 'seminar', 'course');

-- CreateEnum
CREATE TYPE "ActivityTypeTag" AS ENUM ('PreRequisite', 'Stage');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('successful', 'refunded', 'pending');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('onboarding', 'drive', 'activity');

-- CreateEnum
CREATE TYPE "AudienceTypeName" AS ENUM ('Institution', 'Public');

-- CreateEnum
CREATE TYPE "EnrollmentStatus" AS ENUM ('enrolled', 'completed', 'dropped', 'in_progress', 'failed', 'passed');

-- CreateTable
CREATE TABLE "candidate" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" "Gender" NOT NULL,
    "institution_id" TEXT NOT NULL,
    "department_id" TEXT NOT NULL,
    "semester" INTEGER NOT NULL,
    "bio" TEXT,
    "resume" TEXT,
    "additional_documents" TEXT[],
    "cgpa" DOUBLE PRECISION,
    "hobbies" TEXT[],
    "certifications" TEXT[],
    "created_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "candidate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "institution" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "status" "InstitutionStatus" NOT NULL DEFAULT 'unverified',
    "created_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "institution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "department" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "short_name" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "desc" TEXT,
    "created_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "drive" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "available_positions" INTEGER NOT NULL,
    "company_details" TEXT NOT NULL,
    "requirements" TEXT NOT NULL,
    "keypoints" TEXT[],
    "image" TEXT NOT NULL,
    "documents" TEXT[],
    "applies" TEXT[],
    "created_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "status" "EntityStatus" NOT NULL DEFAULT 'pending',

    CONSTRAINT "drive_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "internal_name" TEXT NOT NULL,
    "type" "ActivityType" NOT NULL,
    "tag" TEXT,
    "type_tag" "ActivityTypeTag",
    "bg_color" TEXT,
    "external_url" TEXT,
    "details" TEXT NOT NULL,
    "keypoints" TEXT[],
    "image" TEXT NOT NULL,
    "documents" TEXT[],
    "applies" TEXT[],
    "baseprice" DECIMAL(10,2) NOT NULL,
    "created_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "status" "EntityStatus" NOT NULL DEFAULT 'pending',

    CONSTRAINT "activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment" (
    "id" TEXT NOT NULL,
    "transaction_id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "payment_status" "PaymentStatus" NOT NULL,
    "payment_mode" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "transaction_type" "TransactionType" NOT NULL,
    "activity_id" TEXT,
    "drive_id" TEXT,
    "created_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document" (
    "id" TEXT NOT NULL,
    "document_type" "DocumentType" NOT NULL,
    "file_type" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "created_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audience_type" (
    "id" TEXT NOT NULL,
    "name" "AudienceTypeName" NOT NULL,
    "created_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audience_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "drive_activity" (
    "id" TEXT NOT NULL,
    "drive_id" TEXT NOT NULL,
    "activity_id" TEXT NOT NULL,
    "is_required" BOOLEAN NOT NULL DEFAULT false,
    "allowed_sem" INTEGER,
    "cgpa_greater_than" DOUBLE PRECISION,
    "baseprice" DECIMAL(10,2) NOT NULL,
    "created_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "status" "EntityStatus" NOT NULL DEFAULT 'pending',

    CONSTRAINT "drive_activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "institution_activity" (
    "id" TEXT NOT NULL,
    "institution_id" TEXT NOT NULL,
    "activity_id" TEXT NOT NULL,
    "is_required" BOOLEAN NOT NULL DEFAULT false,
    "allowed_sem" INTEGER,
    "cgpa_greater_than" DOUBLE PRECISION,
    "baseprice" DECIMAL(10,2) NOT NULL,
    "created_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "status" "EntityStatus" NOT NULL DEFAULT 'pending',

    CONSTRAINT "institution_activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "institution_drive" (
    "id" TEXT NOT NULL,
    "institution_id" TEXT NOT NULL,
    "drive_id" TEXT NOT NULL,
    "is_required" BOOLEAN NOT NULL DEFAULT false,
    "allowed_sem" INTEGER,
    "cgpa_greater_than" DOUBLE PRECISION,
    "created_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "status" "EntityStatus" NOT NULL DEFAULT 'pending',

    CONSTRAINT "institution_drive_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "candidate_activity" (
    "id" TEXT NOT NULL,
    "candidate_id" TEXT NOT NULL,
    "activity_id" TEXT NOT NULL,
    "enrollment_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "completion_date" TIMESTAMP(6),
    "enrollment_status" "EnrollmentStatus" NOT NULL DEFAULT 'enrolled',
    "is_selected" BOOLEAN,
    "selection_date" TIMESTAMP(6),
    "score" DOUBLE PRECISION,
    "remarks" TEXT,
    "payment_id" TEXT,
    "created_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "drive_id" TEXT,

    CONSTRAINT "candidate_activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "candidate_drive" (
    "id" TEXT NOT NULL,
    "candidate_id" TEXT NOT NULL,
    "drive_id" TEXT NOT NULL,
    "application_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "enrollment_status" "EnrollmentStatus" NOT NULL DEFAULT 'enrolled',
    "is_selected" BOOLEAN,
    "selection_date" TIMESTAMP(6),
    "remarks" TEXT,
    "payment_id" TEXT,
    "created_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "candidate_drive_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hobby" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "desc" TEXT,
    "created_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hobby_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_log" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "approval" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "approval_type" TEXT NOT NULL,
    "old_target_id" TEXT,
    "target_id" TEXT NOT NULL,
    "created_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "status" "EntityStatus" NOT NULL DEFAULT 'pending',
    "updated_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "approval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "created_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "role" TEXT NOT NULL DEFAULT 'candidate',
    "status" TEXT NOT NULL DEFAULT 'onboarding',
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "first_name" TEXT,
    "last_name" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CandidateToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CandidateToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_PaymentToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PaymentToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_NotificationToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_NotificationToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ActivityLogToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ActivityLogToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ApprovalToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ApprovalToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "candidate_student_id_key" ON "candidate"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "candidate_activity_candidate_id_activity_id_key" ON "candidate_activity"("candidate_id", "activity_id");

-- CreateIndex
CREATE UNIQUE INDEX "candidate_drive_candidate_id_drive_id_key" ON "candidate_drive"("candidate_id", "drive_id");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "_CandidateToUser_B_index" ON "_CandidateToUser"("B");

-- CreateIndex
CREATE INDEX "_PaymentToUser_B_index" ON "_PaymentToUser"("B");

-- CreateIndex
CREATE INDEX "_NotificationToUser_B_index" ON "_NotificationToUser"("B");

-- CreateIndex
CREATE INDEX "_ActivityLogToUser_B_index" ON "_ActivityLogToUser"("B");

-- CreateIndex
CREATE INDEX "_ApprovalToUser_B_index" ON "_ApprovalToUser"("B");

-- AddForeignKey
ALTER TABLE "candidate" ADD CONSTRAINT "candidate_institution_id_fkey" FOREIGN KEY ("institution_id") REFERENCES "institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidate" ADD CONSTRAINT "candidate_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_drive_id_fkey" FOREIGN KEY ("drive_id") REFERENCES "drive"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "drive_activity" ADD CONSTRAINT "drive_activity_drive_id_fkey" FOREIGN KEY ("drive_id") REFERENCES "drive"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "drive_activity" ADD CONSTRAINT "drive_activity_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institution_activity" ADD CONSTRAINT "institution_activity_institution_id_fkey" FOREIGN KEY ("institution_id") REFERENCES "institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institution_activity" ADD CONSTRAINT "institution_activity_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institution_drive" ADD CONSTRAINT "institution_drive_institution_id_fkey" FOREIGN KEY ("institution_id") REFERENCES "institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institution_drive" ADD CONSTRAINT "institution_drive_drive_id_fkey" FOREIGN KEY ("drive_id") REFERENCES "drive"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidate_activity" ADD CONSTRAINT "candidate_activity_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidate_activity" ADD CONSTRAINT "candidate_activity_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidate_activity" ADD CONSTRAINT "candidate_activity_drive_id_fkey" FOREIGN KEY ("drive_id") REFERENCES "drive"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidate_drive" ADD CONSTRAINT "candidate_drive_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidate_drive" ADD CONSTRAINT "candidate_drive_drive_id_fkey" FOREIGN KEY ("drive_id") REFERENCES "drive"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CandidateToUser" ADD CONSTRAINT "_CandidateToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CandidateToUser" ADD CONSTRAINT "_CandidateToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PaymentToUser" ADD CONSTRAINT "_PaymentToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "payment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PaymentToUser" ADD CONSTRAINT "_PaymentToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NotificationToUser" ADD CONSTRAINT "_NotificationToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "notification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NotificationToUser" ADD CONSTRAINT "_NotificationToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActivityLogToUser" ADD CONSTRAINT "_ActivityLogToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "activity_log"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActivityLogToUser" ADD CONSTRAINT "_ActivityLogToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ApprovalToUser" ADD CONSTRAINT "_ApprovalToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "approval"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ApprovalToUser" ADD CONSTRAINT "_ApprovalToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
