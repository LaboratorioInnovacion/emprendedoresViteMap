// Adaptación para Next.js
'use client';
import React, { useEffect, useState } from "react";
import StatCard from "../dashboard/StatCard";
import RecentBusinessCard from "../dashboard/RecentBusinessCard";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { businesses, dashboardStats, calculateMapCenter, businessTypeColors } from "../../data/mockData";
import { BarChart3, Building2, Map, ArrowRight, MapPin, Phone, Mail, Globe, Activity } from "lucide-react";
import { Icon } from "leaflet";
import type { Business, BusinessType } from "../../types";
import { useEmprendedores } from "../../context/EmprendedoresContext";

const Dashboard: React.FC = () => {
  // Adaptar lógica de contexto y hooks para Next.js
  const recentBusinesses = businesses.slice(0, 3);
  const mapCenter = calculateMapCenter();
  const [Negocios, setNegocios] = useState<Business[]>([]);
  const { emprendedores } = useEmprendedores() as { emprendedores: Business[] };
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  // ...resto de la lógica y renderizado...
  return (
    <div>Dashboard adaptado a Next.js</div>
  );
};

export default Dashboard;
