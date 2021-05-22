/*
  Warnings:

  - Added the required column `tipoTransacao` to the `Transacao` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transacao" ADD COLUMN     "tipoTransacao" INTEGER NOT NULL;
