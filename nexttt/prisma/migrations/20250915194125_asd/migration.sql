-- AlterTable
ALTER TABLE "public"."Emprendimiento" ALTER COLUMN "etapa" DROP NOT NULL,
ALTER COLUMN "sector" DROP NOT NULL,
ALTER COLUMN "actividadPrincipal" DROP NOT NULL,
ALTER COLUMN "tipoEmprendimiento" DROP NOT NULL;
