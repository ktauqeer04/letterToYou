/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Letter` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Letter_email_key" ON "public"."Letter"("email");
