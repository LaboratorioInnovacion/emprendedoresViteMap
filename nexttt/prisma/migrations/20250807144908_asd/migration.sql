-- AlterTable
ALTER TABLE "public"."Emprendimiento" ALTER COLUMN "denominacion" DROP NOT NULL,
ALTER COLUMN "direccion" DROP NOT NULL,
ALTER COLUMN "requiereCapacitacion" DROP NOT NULL,
ALTER COLUMN "requiereConsultoria" DROP NOT NULL,
ALTER COLUMN "requiereHerramientasTecno" DROP NOT NULL,
ALTER COLUMN "usaRedesSociales" DROP NOT NULL,
ALTER COLUMN "usaMediosPagoElectronicos" DROP NOT NULL,
ALTER COLUMN "poseeSucursales" DROP NOT NULL,
ALTER COLUMN "createdAt" DROP NOT NULL,
ALTER COLUMN "updatedAt" DROP NOT NULL;
