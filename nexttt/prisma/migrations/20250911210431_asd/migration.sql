-- DropForeignKey
ALTER TABLE "public"."AsignacionCapacitacion" DROP CONSTRAINT "AsignacionCapacitacion_capacitacionId_fkey";

-- AddForeignKey
ALTER TABLE "public"."AsignacionCapacitacion" ADD CONSTRAINT "AsignacionCapacitacion_capacitacionId_fkey" FOREIGN KEY ("capacitacionId") REFERENCES "public"."Capacitacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
