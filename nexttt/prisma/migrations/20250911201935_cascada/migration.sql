-- DropForeignKey
ALTER TABLE "public"."Emprendimiento" DROP CONSTRAINT "Emprendimiento_emprendedorId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Emprendimiento" ADD CONSTRAINT "Emprendimiento_emprendedorId_fkey" FOREIGN KEY ("emprendedorId") REFERENCES "public"."Emprendedor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
