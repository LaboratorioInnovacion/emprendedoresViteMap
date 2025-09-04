-- CreateEnum
CREATE TYPE "public"."Departamentos" AS ENUM ('Ambato', 'Ancasti', 'Andalgala', 'AntofagastaDelaSierra', 'Belen', 'Capayan', 'Capital', 'ElAlto', 'FrayMamertoEsquiu', 'LaPaz', 'Paclin', 'Poman', 'SantaMaria', 'SantaRosa', 'Tinogasta', 'ValleViejo');

-- AlterTable
ALTER TABLE "public"."Emprendedor" ADD COLUMN     "fotoPerfil" TEXT;

-- AlterTable
ALTER TABLE "public"."Emprendimiento" ADD COLUMN     "fotoPerfil" TEXT;
