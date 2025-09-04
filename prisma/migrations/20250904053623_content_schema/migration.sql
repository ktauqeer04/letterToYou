/*
  Warnings:

  - You are about to drop the column `content` on the `Letter` table. All the data in the column will be lost.
  - You are about to drop the column `sendDate` on the `Letter` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Letter` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Letter" DROP COLUMN "content",
DROP COLUMN "sendDate",
DROP COLUMN "status";

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

-- AddForeignKey
ALTER TABLE "public"."Content" ADD CONSTRAINT "Content_letterId_fkey" FOREIGN KEY ("letterId") REFERENCES "public"."Letter"("idUuid") ON DELETE CASCADE ON UPDATE CASCADE;
