/*
  Warnings:

  - A unique constraint covering the columns `[hashedUuid]` on the table `Letter` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Letter_hashedUuid_key" ON "public"."Letter"("hashedUuid");
