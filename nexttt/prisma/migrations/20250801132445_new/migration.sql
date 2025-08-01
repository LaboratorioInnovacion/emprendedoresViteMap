/*
  Warnings:

  - The values [MujerTrans,VaronTrans,NoBinario,Ninguna] on the enum `Genero` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."Genero_new" AS ENUM ('Masculino', 'Femenino', 'PrefieroNoDecir');
ALTER TABLE "public"."Emprendedor" ALTER COLUMN "genero" TYPE "public"."Genero_new" USING ("genero"::text::"public"."Genero_new");
ALTER TYPE "public"."Genero" RENAME TO "Genero_old";
ALTER TYPE "public"."Genero_new" RENAME TO "Genero";
DROP TYPE "public"."Genero_old";
COMMIT;
