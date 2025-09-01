-- CreateTable
CREATE TABLE "public"."Capacitacion" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" TEXT[],
    "organismo" TEXT NOT NULL,
    "modalidad" TEXT,
    "descripcion" TEXT,
    "fechaInicio" TIMESTAMP(3),
    "fechaFin" TIMESTAMP(3),
    "cupo" INTEGER,
    "observaciones" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Capacitacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AsignacionCapacitacion" (
    "id" SERIAL NOT NULL,
    "capacitacionId" INTEGER NOT NULL,
    "beneficiarioTipo" "public"."TipoBeneficiario" NOT NULL,
    "emprendedorId" INTEGER,
    "emprendimientoId" INTEGER,
    "fechaAsignacion" TIMESTAMP(3) NOT NULL,
    "observaciones" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AsignacionCapacitacion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."AsignacionCapacitacion" ADD CONSTRAINT "AsignacionCapacitacion_capacitacionId_fkey" FOREIGN KEY ("capacitacionId") REFERENCES "public"."Capacitacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AsignacionCapacitacion" ADD CONSTRAINT "AsignacionCapacitacion_emprendedorId_fkey" FOREIGN KEY ("emprendedorId") REFERENCES "public"."Emprendedor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AsignacionCapacitacion" ADD CONSTRAINT "AsignacionCapacitacion_emprendimientoId_fkey" FOREIGN KEY ("emprendimientoId") REFERENCES "public"."Emprendimiento"("id") ON DELETE SET NULL ON UPDATE CASCADE;
