import React, { useState } from "react";
import { Business, BusinessType, FilterOptions } from "../../types";
import { Search, Filter, Plus, Activity, MapPin } from "lucide-react";
import { useEmprendedores } from "../../context/EmprendedoresContext";

interface BusinessListProps {
  businesses: Business[];
  onViewDetail: (id: string) => void;
  onAddBusiness: () => void;
}

const BusinessList: React.FC<BusinessListProps> = ({
  businesses,
  onViewDetail,
  onAddBusiness,
}) => {
  const [filters, setFilters] = useState<FilterOptions>({
    businessTypes: [],
    status: [],
    searchTerm: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const { emprendedores } = useEmprendedores();
  console.log("Emprendedores:", emprendedores);

  const businessTypes: BusinessType[] = [
    "restaurant",
    "retail",
    "service",
    "technology",
    "manufacturing",
    "education",
    "healthcare",
    "other",
  ];

  const statusOptions = ["active", "inactive", "pending"];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      searchTerm: e.target.value,
    });
  };

  const toggleBusinessTypeFilter = (type: BusinessType) => {
    if (filters.businessTypes.includes(type)) {
      setFilters({
        ...filters,
        businessTypes: filters.businessTypes.filter((t) => t !== type),
      });
    } else {
      setFilters({
        ...filters,
        businessTypes: [...filters.businessTypes, type],
      });
    }
  };

  const toggleStatusFilter = (status: "active" | "inactive" | "pending") => {
    if (filters.status.includes(status)) {
      setFilters({
        ...filters,
        status: filters.status.filter((s) => s !== status),
      });
    } else {
      setFilters({
        ...filters,
        status: [...filters.status, status],
      });
    }
  };

  const resetFilters = () => {
    setFilters({
      businessTypes: [],
      status: [],
      searchTerm: "",
    });
  };

  const filteredBusinesses = emprendedores.filter((business) => {
    if (
      filters.searchTerm &&
      !business.name.toLowerCase().includes(filters.searchTerm.toLowerCase())
    ) {
      return false;
    }

    if (
      filters.businessTypes.length > 0 &&
      !filters.businessTypes.includes(business.type)
    ) {
      return false;
    }

    if (
      filters.status.length > 0 &&
      !filters.status.includes(business.status)
    ) {
      return false;
    }

    return true;
  });

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
    <div className="space-y-4">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-2xl font-bold">Emprendedores</h2>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1 sm:flex-none">
              <input
                type="text"
                placeholder="Buscar Negocio..."
                value={filters.searchTerm}
                onChange={handleSearchChange}
                className="input pl-9 w-full sm:w-60"
              />
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn-outline px-3 flex-1 sm:flex-none justify-center"
                title="Filter"
              >
                <Filter size={18} />
                <span className="ml-2 sm:hidden">Filtros</span>
              </button>

              <button
                onClick={onAddBusiness}
                className="btn-primary flex-1 sm:flex-none justify-center"
              >
                <Plus size={18} className="sm:mr-1" />
                <span className="ml-2 sm:ml-0">Añadir Emprendedor</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="card animate-fadeIn">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Filtros</h3>
            <button
              onClick={resetFilters}
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
            >
              Reset All
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="font-medium mb-2">Tipo de Rubro</h4>
              <div className="flex flex-wrap gap-2">
                {businessTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => toggleBusinessTypeFilter(type)}
                    className={`badge text-xs py-1.5 px-3 capitalize ${
                      filters.businessTypes.includes(type)
                        ? "bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Estado</h4>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    onClick={() =>
                      toggleStatusFilter(
                        status as "active" | "inactive" | "pending"
                      )
                    }
                    className={`badge text-xs py-1.5 px-3 capitalize ${
                      filters.status.includes(
                        status as "active" | "inactive" | "pending"
                      )
                        ? getStatusBadgeClass(
                            status as "active" | "inactive" | "pending"
                          )
                        : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Business Cards for Mobile */}
      <div className="block sm:hidden space-y-4">
        {filteredBusinesses.length > 0 ? (
          filteredBusinesses.map((business) => (
            <div
              key={business.id}
              className="card hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => onViewDetail(business.id)}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {business.imageUrl ? (
                    <img
                      className="h-16 w-16 rounded-lg object-cover"
                      src={business.imageUrl}
                      alt={business.name}
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400">
                      {business.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-base font-medium truncate">
                        {business.name}
                      </h3>
                      <span className="badge badge-secondary text-xs capitalize mt-1">
                        {business.type}
                      </span>
                    </div>
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

                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center">
                      <MapPin size={14} className="mr-1 flex-shrink-0" />
                      <span className="truncate">{business.address}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No businesses found matching your criteria.
          </div>
        )}
      </div>

      {/* Business Table for Desktop */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Nombre
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Tipo
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Ubicacion
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Estado
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Ultima Actualización
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredBusinesses.length > 0 ? (
              filteredBusinesses.map((business) => (
                <tr
                  key={business.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {business.imageUrl ? (
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={business.imageUrl}
                            alt={business.name}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400">
                            {business.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium">
                          {business.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {business.contact.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="badge badge-secondary capitalize">
                      {business.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <MapPin size={14} className="mr-1 flex-shrink-0" />
                      <span className="truncate max-w-[200px]">
                        {business.address}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`badge ${getStatusBadgeClass(
                        business.status
                      )} flex items-center`}
                    >
                      <Activity size={12} className="mr-1" />
                      {business.status.charAt(0).toUpperCase() +
                        business.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(business.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onViewDetail(business.id)}
                      className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
                    >
                      Ver Detalles
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                >
                  No hay negocios con estos rubros o estados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BusinessList;
