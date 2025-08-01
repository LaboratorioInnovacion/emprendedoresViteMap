/*
  Warnings:

  - You are about to drop the column `email` on the `Emprendedor` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Emprendedor` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."Rol" AS ENUM ('SUPERUSUARIO', 'ADMIN', 'EMPRENDEDOR');

-- DropIndex
DROP INDEX "public"."Emprendedor_email_key";

-- AlterTable
ALTER TABLE "public"."Emprendedor" DROP COLUMN "email",
DROP COLUMN "password";

-- CreateTable
CREATE TABLE "public"."Usuario" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "rol" "public"."Rol" NOT NULL DEFAULT 'EMPRENDEDOR',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "emprendedorId" INTEGER,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "public"."Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_emprendedorId_key" ON "public"."Usuario"("emprendedorId");

-- AddForeignKey
ALTER TABLE "public"."Usuario" ADD CONSTRAINT "Usuario_emprendedorId_fkey" FOREIGN KEY ("emprendedorId") REFERENCES "public"."Emprendedor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
