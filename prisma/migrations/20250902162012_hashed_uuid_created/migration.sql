/*
  Warnings:

  - Added the required column `hashedUuid` to the `Letter` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Letter" ADD COLUMN     "hashedUuid" TEXT NOT NULL;
