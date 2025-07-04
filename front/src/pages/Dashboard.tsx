import React, { use, useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import StatCard from "../../../nexttt/src/components/dashboard/StatCard.js";
import RecentBusinessCard from "../../../nexttt/src/components/dashboard/RecentBusinessCard.js";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import {
  businesses,
  dashboardStats,
  calculateMapCenter,
  businessTypeColors,
} from "../data/mockData";
// import {businesses } from '../api/api.js'
import {
  BarChart3,
  Building2,
  Map,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  Globe,
  Activity,
} from "lucide-react";
import { Icon } from "leaflet";
import type { Business, BusinessType } from "../types";
import { fetchBusinessData } from "../api/api.js";
import { useEmprendedores } from "../context/EmprendedoresContext.jsx";

const Dashboard: React.FC = () => {
  const { isMobileSidebarOpen, isMobile } = useOutletContext() as {
    isMobileSidebarOpen: boolean;
    isMobile: boolean;
  };
  const recentBusinesses = businesses.slice(0, 3);
  const mapCenter = calculateMapCenter();
  const [Negocios, setNegocios] = useState<Business[]>([]);
  const { emprendedores } = useEmprendedores() as { emprendedores: Business[] };
  const [searchTerm, setSearchTerm] = useState(""); // Filtro de búsqueda
const [selectedTypes, setSelectedTypes] = useState<string[]>([]); // Filtro por tipo
  const navigate = useNavigate();

  // Create custom map pins for businesses
  const createBusinessIcon = (type: BusinessType) => {
    const color = businessTypeColors[type];
    // SVG circular simple, como el de la posición actual de Google Maps
    const svgIcon = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='24' height='24'><circle cx='16' cy='16' r='10' fill='${color}' stroke='white' stroke-width='2'/></svg>`;
    const iconUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svgIcon)}`;

    return new Icon({
      iconUrl,
      iconSize: [28, 28],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16],
    });
  };
  const filteredBusinesses = Negocios.filter((business) => {
  const matchesSearch =
    business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.address.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesType =
    selectedTypes.length === 0 || selectedTypes.includes(business.type);

  return matchesSearch && matchesType;
});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchBusinessData();
        // Process the data as needed
        console.log("datos excel ", data);
        setNegocios(data);
      } catch (error) {
        console.error("Error fetching business data:", error);
      }
    };
    fetchData();
  }, []);

  // Get status badge class
  const getStatusBadgeClass = (status: "active" | "inactive" | "pending") => {
    switch (status) {
      case "active":
        return "bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-500";
      case "inactive":
        return "bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-500";
      case "pending":
        return "bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-500";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Bienvenido al Sistema de Emprendedores
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/businesses" className="btn-outline">
            <Building2 size={18} className="mr-1" />
            Emprendedores
          </Link>
          <Link to="/map" className="btn-primary">
            <Map size={18} className="mr-1" />
            Explorar Mapa
          </Link>
        </div>
      </div>

      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"> */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
        <StatCard cantidad={emprendedores.length} />
        {emprendedores.map((empre) => (
          <StatCard key={empre.id} empre={empre} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Map
                size={20}
                className="text-primary-600 dark:text-primary-400 mr-2"
              />
              <h2 className="text-xl font-semibold">Mapa Negocios</h2>
            </div>
            <Link
              to="/map"
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center"
            >
              Vista Mapa <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>

          <div className="h-80 lg:h-[500px] rounded-lg overflow-hidden">
            {!(isMobile && isMobileSidebarOpen) && (
              <MapContainer
                // @ts-expect-error center is valid for MapContainer in react-leaflet v4
                center={mapCenter}
                zoom={12}
                style={{ height: "100%", width: "100%" }}
                zoomControl={false}
              >
                <TileLayer
                  // @ts-expect-error attribution is valid for TileLayer in react-leaflet v4
                  attribution=""
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {Negocios.map((business) => (
                  // Workaround: MarkerProps de react-leaflet no incluye 'icon', pero sí es soportada in tiempo de ejecución por Leaflet.
                  <Marker
                    key={business.id}
                    position={[business.location.lat, business.location.lng]}
                    {...({ icon: createBusinessIcon(business.type) } as any)}
                  >
                    <Popup>
                      <div className="w-64">
                        <div className="flex items-start gap-3 mb-3">
                          {business.imageUrl ? (
                            <img
                              src={business.imageUrl}
                              alt={business.name}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 text-xl font-bold">
                              {business.name.charAt(0)}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-base mb-1">
                              {business.name}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              <span className="badge badge-secondary text-xs capitalize">
                                {business.type}
                              </span>
                              <span
                                className={`badge ${getStatusBadgeClass(
                                  business.status
                                )} flex items-center text-xs`}
                              >
                                <Activity size={12} className="mr-1" />
                                {business.status.charAt(0).toUpperCase() +
                                  business.status.slice(1)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm">
                          <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                            {business.description}
                          </p>

                          <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <MapPin size={14} className="mr-1 flex-shrink-0" />
                            <span className="truncate">{business.address}</span>
                          </div>

                          <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <Phone size={14} className="mr-1 flex-shrink-0" />
                            <span>{business.contact.phone}</span>
                          </div>

                          {/* <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <Mail size={14} className="mr-1 flex-shrink-0" />
                            <span className="truncate">
                              {business.contact.email}
                            </span>
                          </div> */}

                          {/* {business.contact.website && (
                            <div className="flex items-center text-gray-600 dark:text-gray-400">
                              <Globe size={14} className="mr-1 flex-shrink-0" />
                              <a 
                                href={business.contact.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="truncate text-primary-600 dark:text-primary-400 hover:underline"
                              >
                                {business.contact.website.replace(/^https?:\/\//, '')}
                              </a>
                            </div>
                          )} */}
                        </div>

                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                          <Link
                            to={`/businesses/${business.id}`}
                            className="btn-primary w-full justify-center text-sm py-1.5"
                            style={{ color: '#fff' }}
                          >
                            Ver Detalles
                          </Link>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {Object.entries(businessTypeColors).map(([type, color]) => (
              <div key={type} className="flex items-center">
                <div
                  className="h-3 w-3 rounded-full mr-1"
                  style={{ backgroundColor: color }}
                ></div>
                <span className="text-xs capitalize">{type}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Building2
                size={20}
                className="text-primary-600 dark:text-primary-400 mr-2"
              />
              <h2 className="text-xl font-semibold">Negocios Recientes</h2>
            </div>
            <Link
              to="/businesses"
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center"
            >
              Ver Todo<ArrowRight size={16} className="ml-1" />
            </Link>
          </div>

          {emprendedores.slice(-3).map((business) => (
            <RecentBusinessCard key={business.id} business={business} />
          ))}
        </div>
      </div>

      {/* <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <BarChart3 size={20} className="text-primary-600 dark:text-primary-400 mr-2" />
            <h2 className="text-xl font-semibold">Business Activity</h2>
          </div>
          <div>
            <select className="input text-sm">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
        </div>
        
        <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">Activity chart visualization would appear here</p>
        </div>
      </div> */}
    </div>
  );
};

export default Dashboard;
