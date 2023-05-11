-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'WARD', 'COUNTY', 'NATIONAL');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "roles" "Role"[] DEFAULT ARRAY['ADMIN']::"Role"[],
    "isConfirmed" BOOLEAN NOT NULL DEFAULT true,
    "confirmOTP" TEXT,
    "otpTries" INTEGER NOT NULL DEFAULT 0,
    "status" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
