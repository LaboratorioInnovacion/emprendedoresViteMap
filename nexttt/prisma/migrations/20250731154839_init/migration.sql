-- CreateEnum
CREATE TYPE "public"."Genero" AS ENUM ('Masculino', 'Femenino', 'MujerTrans', 'VaronTrans', 'NoBinario', 'Ninguna', 'PrefieroNoDecir');

-- CreateEnum
CREATE TYPE "public"."NivelEstudios" AS ENUM ('SinEscolarizar', 'PrimarioIncompleto', 'PrimarioCompleto', 'SecundarioIncompleto', 'SecundarioCompleto', 'TerciarioUniversitarioIncompleto', 'TerciarioUniversitarioCompleto', 'Posgrado');

-- CreateEnum
CREATE TYPE "public"."MotivacionEmprender" AS ENUM ('Pasion', 'Independencia', 'Oportunidad', 'NecesidadEconomica', 'Otro');

-- CreateEnum
CREATE TYPE "public"."EtapaEmprendimiento" AS ENUM ('Idea', 'EnMarcha', 'Consolidado');

-- CreateEnum
CREATE TYPE "public"."TipoEmprendimiento" AS ENUM ('Individual', 'Asociativo', 'Familiar', 'Cooperativo');

-- CreateEnum
CREATE TYPE "public"."PlaneaIncorporar" AS ENUM ('Si', 'No', 'NoLoSabe');

-- CreateEnum
CREATE TYPE "public"."PercepcionPlanta" AS ENUM ('Adecuada', 'Mayor', 'Menor', 'NoLoSabe');

-- CreateEnum
CREATE TYPE "public"."TipoBeneficiario" AS ENUM ('Emprendedor', 'Emprendimiento');

-- CreateEnum
CREATE TYPE "public"."EstadoAsignacion" AS ENUM ('Otorgada', 'Pendiente', 'Rechazada');

-- CreateEnum
CREATE TYPE "public"."Sector" AS ENUM ('ProduccionElaboracion', 'Comercio', 'Servicios');

-- CreateEnum
CREATE TYPE "public"."ActividadSectorial" AS ENUM ('Produccion_Alimentos_Artesanal', 'Produccion_Alimentos_Industrial', 'Produccion_Articulos_Hogar', 'Produccion_Indumentaria', 'Produccion_Quimicos_Hogar', 'Produccion_Belleza', 'Produccion_Grafica', 'Produccion_Vivero', 'Produccion_Otro', 'Comercio_Indumentaria', 'Comercio_Alimentos', 'Comercio_Articulos_Hogar', 'Comercio_Libreria', 'Comercio_Informatica', 'Comercio_Belleza', 'Comercio_Mascotas', 'Comercio_Regional', 'Comercio_Construccion', 'Comercio_Vivero', 'Comercio_Otro', 'Servicio_Profesionales', 'Servicio_Salud', 'Servicio_Educativos', 'Servicio_Turisticos', 'Servicio_Reparacion_Electro', 'Servicio_Reparacion_Vehiculos', 'Servicio_Construccion', 'Servicio_Gastronomicos', 'Servicio_Otro');

-- CreateTable
CREATE TABLE "public"."Emprendedor" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "genero" "public"."Genero" NOT NULL,
    "dni" TEXT NOT NULL,
    "cuil" TEXT NOT NULL,
    "fotoDni" TEXT,
    "fechaNacimiento" TIMESTAMP(3) NOT NULL,
    "paisOrigen" TEXT,
    "ciudadOrigen" TEXT,
    "departamento" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "ubicacion" BYTEA,
    "nivelEstudios" "public"."NivelEstudios" NOT NULL,
    "motivacionEmprender" "public"."MotivacionEmprender" NOT NULL,
    "cantidadEmprendimientos" INTEGER,
    "poseeOtrosSustentos" BOOLEAN,
    "tiposSustento" TEXT[],
    "tieneDependientesEconomicos" BOOLEAN,
    "telefono" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Emprendedor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Emprendimiento" (
    "id" SERIAL NOT NULL,
    "emprendedorId" INTEGER NOT NULL,
    "etapa" "public"."EtapaEmprendimiento" NOT NULL,
    "denominacion" TEXT NOT NULL,
    "fechaInicio" TIMESTAMP(3),
    "inscripcionArca" BOOLEAN NOT NULL,
    "cuit" TEXT,
    "sector" "public"."Sector" NOT NULL,
    "actividadPrincipal" "public"."ActividadSectorial" NOT NULL,
    "tipoEmprendimiento" "public"."TipoEmprendimiento" NOT NULL,
    "direccion" TEXT NOT NULL,
    "ubicacion" BYTEA,
    "telefono" TEXT,
    "email" TEXT,
    "web" TEXT,
    "redSocial1" TEXT,
    "redSocial2" TEXT,
    "tienePersonal" BOOLEAN NOT NULL,
    "cantidadPersonal" INTEGER,
    "modoIncorporacionPersonal" TEXT[],
    "planeaIncorporarPersonal" "public"."PlaneaIncorporar",
    "percepcionPlantaPersonal" "public"."PercepcionPlanta",
    "requiereCapacitacion" BOOLEAN NOT NULL,
    "tiposCapacitacion" TEXT[],
    "otrosTiposCapacitacion" TEXT,
    "requiereConsultoria" BOOLEAN NOT NULL,
    "tiposConsultoria" TEXT[],
    "otrosTiposConsultoria" TEXT,
    "requiereHerramientasTecno" BOOLEAN NOT NULL,
    "tiposHerramientasTecno" TEXT[],
    "otrasHerramientasTecno" TEXT,
    "usaRedesSociales" BOOLEAN NOT NULL,
    "tiposRedesSociales" TEXT[],
    "usaMediosPagoElectronicos" BOOLEAN NOT NULL,
    "canalesComercializacion" TEXT[],
    "otrosCanalesComercializacion" TEXT,
    "poseeSucursales" BOOLEAN NOT NULL,
    "cantidadSucursales" INTEGER,
    "ubicacionSucursales" TEXT[],
    "planeaAbrirSucursal" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Emprendimiento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Herramienta" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "origenTipo" TEXT[],
    "origenOrganismo" TEXT NOT NULL,
    "tipoBeneficiario" "public"."TipoBeneficiario" NOT NULL,
    "tipoHerramientaEmprendimiento" TEXT[],
    "tipoHerramientaEmprendedor" TEXT[],
    "montoTotal" DOUBLE PRECISION,
    "montoPorBeneficiario" DOUBLE PRECISION,
    "poseeVencimiento" BOOLEAN NOT NULL DEFAULT false,
    "fechaInicioVigencia" TIMESTAMP(3),
    "fechaFinVigencia" TIMESTAMP(3),
    "cupo" INTEGER NOT NULL,
    "observaciones" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Herramienta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Asignacion" (
    "id" SERIAL NOT NULL,
    "herramientaId" INTEGER NOT NULL,
    "beneficiarioTipo" "public"."TipoBeneficiario" NOT NULL,
    "emprendedorId" INTEGER,
    "emprendimientoId" INTEGER,
    "fechaAsignacion" TIMESTAMP(3) NOT NULL,
    "estado" "public"."EstadoAsignacion",
    "observaciones" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Asignacion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Emprendedor_dni_key" ON "public"."Emprendedor"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "Emprendedor_cuil_key" ON "public"."Emprendedor"("cuil");

-- CreateIndex
CREATE UNIQUE INDEX "Emprendedor_email_key" ON "public"."Emprendedor"("email");

-- AddForeignKey
ALTER TABLE "public"."Emprendimiento" ADD CONSTRAINT "Emprendimiento_emprendedorId_fkey" FOREIGN KEY ("emprendedorId") REFERENCES "public"."Emprendedor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Asignacion" ADD CONSTRAINT "Asignacion_herramientaId_fkey" FOREIGN KEY ("herramientaId") REFERENCES "public"."Herramienta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Asignacion" ADD CONSTRAINT "Asignacion_emprendedorId_fkey" FOREIGN KEY ("emprendedorId") REFERENCES "public"."Emprendedor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Asignacion" ADD CONSTRAINT "Asignacion_emprendimientoId_fkey" FOREIGN KEY ("emprendimientoId") REFERENCES "public"."Emprendimiento"("id") ON DELETE SET NULL ON UPDATE CASCADE;
