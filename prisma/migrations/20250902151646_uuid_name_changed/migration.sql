/*
  Warnings:

  - The primary key for the `Letter` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `uuid` on the `Letter` table. All the data in the column will be lost.
  - The required column `idUuid` was added to the `Letter` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "public"."Letter" DROP CONSTRAINT "Letter_pkey",
DROP COLUMN "uuid",
ADD COLUMN     "idUuid" TEXT NOT NULL,
ADD CONSTRAINT "Letter_pkey" PRIMARY KEY ("idUuid");
