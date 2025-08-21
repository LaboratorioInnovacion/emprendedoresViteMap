import React from "react";
// import BusinessMap from "../components/map/BusinessMap";
import  BusinessMapDashboard  from "../map/BusinessMapDashboard";
import { useRouter } from "next/navigation";

/**
 * Componente de mapa para el dashboard, adaptado al formato de BusinessMap
 * Recibe los negocios ya filtrados y adaptados
 */
const DashboardMap = ({ businesses, defaultViewport }) => {
  const router = useRouter();
  // Adaptar los datos al formato esperado por BusinessMap
  const adaptedBusinesses = businesses.map((business) => {
    // Decodificar ubicación robustamente
    let location = { lat: -28.46957, lng: -65.78524 };
    if (business.ubicacion) {
      if (
        typeof business.ubicacion.lat === "number" &&
        typeof business.ubicacion.lng === "number"
      ) {
        location = business.ubicacion;
      } else if (typeof business.ubicacion === "string") {
        try {
          const parsed = JSON.parse(business.ubicacion);
          if (
            parsed &&
            typeof parsed.lat === "number" &&
            typeof parsed.lng === "number"
          ) {
            location = parsed;
          }
        } catch {}
      } else if (
        typeof business.ubicacion === "object" &&
        Object.keys(business.ubicacion).every((k) => !isNaN(Number(k)))
      ) {
        try {
          const str = String.fromCharCode(...Object.values(business.ubicacion));
          const parsed = JSON.parse(str);
          if (
            parsed &&
            typeof parsed.lat === "number" &&
            typeof parsed.lng === "number"
          ) {
            location = parsed;
          }
        } catch {}
      }
    }
    // Detectar el sector principal a partir del valor de actividadPrincipal
    const actividad = business.actividadPrincipal || "";
    let type = "Otro";
    if (actividad.startsWith("Produccion")) type = "Produccion";
    else if (actividad.startsWith("Comercio")) type = "Comercio";
    else if (actividad.startsWith("Servicio")) type = "Servicio";
    return {
      id: business.id,
      name: business.denominacion,
      type,
      actividadPrincipal: business.actividadPrincipal || "Otro",
      address: business.direccion,
      location,
      imageUrl: business.imageUrl,
      status: business.etapa ? business.etapa.toLowerCase() : "active",
      contact: {
        phone: business.telefono || business.contact?.phone || "",
        email: business.email || business.contact?.email || "",
        website: business.web || business.contact?.website || "",
      },
      description: business.descripcion || business.actividadPrincipal || "",
      createdAt: business.createdAt || "",
      updatedAt: business.updatedAt || "",
    };
  });

  return (
    <BusinessMapDashboard
      emprendedores={adaptedBusinesses}
      defaultViewport={defaultViewport}
      onBusinessSelect={id => router.push(`/emprendimientos/${id}`)}
    />
  );
};

export default DashboardMap;
