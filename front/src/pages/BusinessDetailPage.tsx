import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Business } from "../types";
import { businesses } from "../data/mockData";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  Clock,
  ChevronLeft,
  Activity,
  Pencil,
  Trash2,
} from "lucide-react";
import { useEmprendedores } from "../context/EmprendedoresContext.jsx";

const BusinessDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [business, setBusiness] = useState<Business | null>(null);
  const { emprendedores } = useEmprendedores();

  // Load business details
  useEffect(() => {
    const foundBusiness = emprendedores.find((b) => b.id === id);
    setBusiness(foundBusiness || null);
  }, [id]);

  // Handle not found
  if (!business) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Building2 size={48} className="text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold mb-2">No se encontro Emprendedor</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          El negocio que estás buscando no existe o ha sido eliminado.
        </p>
        <button onClick={() => navigate("/businesses")} className="btn-primary">
          Volver a Lista de Emprendedores
        </button>
      </div>
    );
  }

  // Get status badge class
  const getStatusBadgeClass = () => {
    switch (business.status) {
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center">
          <button
            onClick={() => navigate("/businesses")}
            className="mr-3 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronLeft
              size={20}
              className="text-gray-600 dark:text-gray-400"
            />
          </button>
          <div>
            <h1 className="text-2xl font-bold">{business.name}</h1>
            <div className="flex items-center mt-1">
              <span className="badge badge-secondary capitalize mr-2">
                {business.type}
              </span>
              <span
                className={`badge ${getStatusBadgeClass()} flex items-center`}
              >
                <Activity size={12} className="mr-1" />
                {business.status.charAt(0).toUpperCase() +
                  business.status.slice(1)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="btn-outline">
            <Pencil size={18} className="mr-1" />
            Editar
          </button>
          <button className="btn bg-error-600 text-white hover:bg-error-700 focus:ring-error-500">
            <Trash2 size={18} className="mr-1" />
            Borrar
          </button>
        </div>
      </div>

      {/* Business details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Business info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main info card */}
          <div className="card">
            <div className="flex flex-col md:flex-row gap-6">
              {business.imageUrl && (
                <div className="md:w-1/3">
                  <img
                    src={business.imageUrl}
                    alt={business.name}
                    className="w-full h-48 md:h-full object-cover rounded-lg"
                  />
                </div>
              )}
              <div className={business.imageUrl ? "md:w-2/3" : "w-full"}>
                <h2 className="text-xl font-semibold mb-4">
                  Informacion de Negocio
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {business.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <MapPin
                        size={18}
                        className="text-gray-500 mt-0.5 mr-2 flex-shrink-0"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Direccion
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {business.address}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Phone
                        size={18}
                        className="text-gray-500 mt-0.5 mr-2 flex-shrink-0"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Telefono
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {business.contact.phone}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Mail
                        size={18}
                        className="text-gray-500 mt-0.5 mr-2 flex-shrink-0"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Email
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {business.contact.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {business.contact.website && (
                      <div className="flex items-start">
                        <Globe
                          size={18}
                          className="text-gray-500 mt-0.5 mr-2 flex-shrink-0"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Sitio Web
                          </p>
                          <a
                            href={business.contact.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                          >
                            {business.contact.website.replace(
                              /^https?:\/\//,
                              ""
                            )}
                          </a>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start">
                      <Calendar
                        size={18}
                        className="text-gray-500 mt-0.5 mr-2 flex-shrink-0"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Creado
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(business.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Clock
                        size={18}
                        className="text-gray-500 mt-0.5 mr-2 flex-shrink-0"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Ultima Actualizacion
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(business.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional cards could go here */}
          {/* <div className="card">
            <h2 className="text-xl font-semibold mb-4">Performance Statistics</h2>
            <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">Performance statistics would appear here</p>
            </div>
          </div> */}
        </div>

        {/* Right column - Map and actions */}
        <div className="space-y-6">
          {/* Map card */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Location</h2>
            <div className="h-64 rounded-lg overflow-hidden">
              <MapContainer
                center={[business.location.lat, business.location.lng]}
                zoom={14}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                  position={[business.location.lat, business.location.lng]}
                >
                  <Popup>{business.name}</Popup>
                </Marker>
              </MapContainer>
            </div>
            <div className="mt-4">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${business.location.lat},${business.location.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 dark:text-primary-400 hover:underline text-sm"
              >
                View on Google Maps
              </a>
            </div>
          </div>

          {/* Quick actions card */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="btn-primary w-full justify-center">
                <Mail size={18} className="mr-2" />
                Contact Business
              </button>
              <button className="btn-outline w-full justify-center">
                <Pencil size={18} className="mr-2" />
                Edit Details
              </button>
              {/* <button className="btn-outline w-full justify-center">
                <Building2 size={18} className="mr-2" />
                View Similar Businesses
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetailPage;
