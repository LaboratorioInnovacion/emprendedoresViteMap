-- DropIndex
DROP INDEX "public"."Emprendedor_cuil_key";

-- DropIndex
DROP INDEX "public"."Emprendedor_dni_key";

-- AlterTable
ALTER TABLE "public"."Emprendedor" ALTER COLUMN "nombre" DROP NOT NULL,
ALTER COLUMN "apellido" DROP NOT NULL,
ALTER COLUMN "dni" DROP NOT NULL,
ALTER COLUMN "cuil" DROP NOT NULL;
