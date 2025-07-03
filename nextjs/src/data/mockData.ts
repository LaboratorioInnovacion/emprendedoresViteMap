import { Business, DashboardStat, BusinessType } from "../types";
// ...resto del mockData original...
export const businesses: Business[] = [];
export const dashboardStats: DashboardStat[] = [];
export const calculateMapCenter = () => [0,0];
export const businessTypeColors: Record<BusinessType, string> = {
  "Gastronomía": "#E11D48",
  "Servicios": "#2563EB",
  "Indumentaria": "#D97706",
  "Tecnología": "#059669",
  "Educación": "#4F46E5",
  "Artesanía": "#4338CA",
  "Turismo": "#4F46E5",
  "Salud": "#DB2777",
  "Otro": "#4B5563"
};
