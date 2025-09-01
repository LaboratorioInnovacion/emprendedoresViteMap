-- CreateTable
CREATE TABLE "public"."LogAccion" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER,
    "entidad" TEXT NOT NULL,
    "entidadId" INTEGER NOT NULL,
    "accion" TEXT NOT NULL,
    "descripcion" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LogAccion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."LogAccion" ADD CONSTRAINT "LogAccion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
