-- DropForeignKey
ALTER TABLE "public"."Asignacion" DROP CONSTRAINT "Asignacion_herramientaId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Asignacion" ADD CONSTRAINT "Asignacion_herramientaId_fkey" FOREIGN KEY ("herramientaId") REFERENCES "public"."Herramienta"("id") ON DELETE CASCADE ON UPDATE CASCADE;
