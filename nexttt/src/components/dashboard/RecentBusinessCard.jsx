'use client';
import { MapPin, Phone, Mail, Globe, Activity } from 'lucide-react';
import { useEmprendedores } from "./../../context/EmprendedoresContext.jsx";

function RecentBusinessCard({ business }) {
  const getStatusBadgeClass = () => {
    switch (business.status) {
      case 'active':
        return 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-500';
      case 'inactive':
        return 'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-500';
      case 'pending':
        return 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-500';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex flex-col sm:flex-row gap-4">
        {business.imageUrl && (
          <div className="flex-shrink-0">
            <img 
              src={business.imageUrl} 
              alt={business.name} 
              className="w-full sm:w-24 h-24 object-cover rounded-md"
            />
          </div>
        )}

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium mb-1">{business.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{business.description}</p>
            </div>
            <span className={`badge ${getStatusBadgeClass()} flex items-center`}>
              <Activity size={12} className="mr-1" />
              {business.status.charAt(0).toUpperCase() + business.status.slice(1)}
            </span>
          </div>

          <div className="mt-2 space-y-1">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <MapPin size={14} className="mr-1 flex-shrink-0" />
              <span className="truncate">{business.address}</span>
            </div>

            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Phone size={14} className="mr-1 flex-shrink-0" />
              <span>{business.contact.phone}</span>
            </div>

            <div className="flex justify-between items-center mt-3">
              <span className="badge badge-secondary">{business.type}</span>
              <a 
                href={`/businesses/${business.id}`}
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
              >
                Ver Detalles
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecentBusinessCard;