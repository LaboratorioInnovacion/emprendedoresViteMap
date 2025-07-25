export interface Business {
  id: string;
  name: string;
  description: string;
  type: BusinessType;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  status: 'active' | 'inactive' | 'pending';
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export type BusinessType = 
 | "Gastronomía" // Rojo vibrante
 | "Servicios" // Azul profundo
 | "Indumentaria" // Ámbar intenso
 | "Tecnología" // Verde fresco
 | "Educación" // Índigo saturado
 | "Artesanía" // Índigo oscuro
 | "Turismo" // Índigo profundo
 | "Salud" // Rosa profundo
 | "Otro" // Gris oscuro

export interface DashboardStat {
  id: string;
  title: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  avatarUrl?: string;
}

export interface MapViewport {
  center: [number, number];
  zoom: number;
}

export interface FilterOptions {
  businessTypes: BusinessType[];
  status: ('active' | 'inactive' | 'pending')[];
  searchTerm: string;
}