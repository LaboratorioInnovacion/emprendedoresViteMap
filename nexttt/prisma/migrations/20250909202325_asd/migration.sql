/*
  Warnings:

  - A unique constraint covering the columns `[emprendedorOtrosId]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Asignacion" ADD COLUMN     "emprendedorOtrosId" INTEGER;

-- AlterTable
ALTER TABLE "public"."AsignacionCapacitacion" ADD COLUMN     "emprendedorOtrosId" INTEGER;

-- AlterTable
ALTER TABLE "public"."Emprendimiento" ADD COLUMN     "emprendedorOtrosId" INTEGER;

-- AlterTable
ALTER TABLE "public"."Usuario" ADD COLUMN     "emprendedorOtrosId" INTEGER;

-- CreateTable
CREATE TABLE "public"."EmprendedorOtros" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT,
    "apellido" TEXT,
    "genero" "public"."Genero",
    "dni" TEXT,
    "cuil" TEXT,
    "fotoDni" TEXT,
    "fechaNacimiento" TIMESTAMP(3) NOT NULL,
    "paisOrigen" TEXT,
    "ciudadOrigen" TEXT,
    "departamento" TEXT,
    "direccion" TEXT,
    "ubicacion" BYTEA,
    "nivelEstudios" "public"."NivelEstudios",
    "motivacionEmprender" "public"."MotivacionEmprender",
    "cantidadEmprendimientos" INTEGER,
    "poseeOtrosSustentos" BOOLEAN,
    "tiposSustento" TEXT[],
    "tieneDependientesEconomicos" BOOLEAN,
    "telefono" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "fotoPerfil" TEXT,

    CONSTRAINT "EmprendedorOtros_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_emprendedorOtrosId_key" ON "public"."Usuario"("emprendedorOtrosId");

-- AddForeignKey
ALTER TABLE "public"."Emprendimiento" ADD CONSTRAINT "Emprendimiento_emprendedorOtrosId_fkey" FOREIGN KEY ("emprendedorOtrosId") REFERENCES "public"."EmprendedorOtros"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Asignacion" ADD CONSTRAINT "Asignacion_emprendedorOtrosId_fkey" FOREIGN KEY ("emprendedorOtrosId") REFERENCES "public"."EmprendedorOtros"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Usuario" ADD CONSTRAINT "Usuario_emprendedorOtrosId_fkey" FOREIGN KEY ("emprendedorOtrosId") REFERENCES "public"."EmprendedorOtros"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AsignacionCapacitacion" ADD CONSTRAINT "AsignacionCapacitacion_emprendedorOtrosId_fkey" FOREIGN KEY ("emprendedorOtrosId") REFERENCES "public"."EmprendedorOtros"("id") ON DELETE SET NULL ON UPDATE CASCADE;
