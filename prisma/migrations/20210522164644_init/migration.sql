/*
  Warnings:

  - You are about to alter the column `dataNascimento` on the `Pessoa` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(3)` to `Unsupported("date")`.

*/
-- AlterTable
ALTER TABLE "Pessoa" ALTER COLUMN "dataNascimento" SET DATA TYPE date;
