// Adaptación para Next.js
'use client';
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from 'next/navigation';
import { Business } from "../../types";
import { businesses } from "../../data/mockData";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Building2, MapPin, Phone, Mail, Globe, Calendar, Clock, ChevronLeft, Activity, Pencil, Trash2, Star } from "lucide-react";
import { useEmprendedores } from "../../context/EmprendedoresContext";

const BusinessDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const [business, setBusiness] = useState<Business | null>(null);
  const { emprendedores, loading } = useEmprendedores();

  useEffect(() => {
    if (!loading) {
      const foundBusiness = emprendedores.find((b) => b.id === params.id);
      setBusiness(foundBusiness || null);
    }
  }, [params.id, emprendedores, loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Cargando datos...</p>
      </div>
    );
  }
  if (!business) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Building2 size={48} className="text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold mb-2">No se encontró Emprendedor</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          El negocio que estás buscando no existe o ha sido eliminado.
        </p>
        <button onClick={() => router.push("/businesses")} className="btn-primary">
          Volver a Lista de Emprendedores
        </button>
      </div>
    );
  }
  return (
    <div>Detalle de negocio adaptado a Next.js</div>
  );
};

export default BusinessDetailPage;
