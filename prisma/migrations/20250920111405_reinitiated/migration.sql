-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('PENDING', 'SENT', 'FAILED');

-- CreateTable
CREATE TABLE "public"."Letter" (
    "idUuid" TEXT NOT NULL,
    "hashedUuid" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Letter_pkey" PRIMARY KEY ("idUuid")
);

-- CreateTable
CREATE TABLE "public"."Content" (
    "idUuid" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sendDate" TIMESTAMP(3) NOT NULL,
    "status" "public"."Status" NOT NULL DEFAULT 'PENDING',
    "letterId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Content_pkey" PRIMARY KEY ("idUuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "Letter_hashedUuid_key" ON "public"."Letter"("hashedUuid");

-- CreateIndex
CREATE UNIQUE INDEX "Letter_email_key" ON "public"."Letter"("email");

-- AddForeignKey
ALTER TABLE "public"."Content" ADD CONSTRAINT "Content_letterId_fkey" FOREIGN KEY ("letterId") REFERENCES "public"."Letter"("idUuid") ON DELETE CASCADE ON UPDATE CASCADE;
