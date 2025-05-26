import { Business, DashboardStat, BusinessType } from '../types';
import { BarChart3, Users, MapPin, TrendingUp, BadgeDollarSign, Activity } from 'lucide-react';

// Mock businesses data
export const businesses: Business[] = [
  {
    id: '1',
    name: 'Tech Innovations Hub',
    description: 'A co-working space and innovation center for tech startups.',
    type: 'technology',
    address: '123 Innovation St, Silicon Valley, CA',
    location: {
      lat: 37.7749,
      lng: -122.4194
    },
    contact: {
      phone: '+1 (555) 123-4567',
      email: 'contact@techhub.com',
      website: 'https://techhub.example.com'
    },
    status: 'active',
    imageUrl: 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    createdAt: '2023-01-15T08:30:00Z',
    updatedAt: '2023-06-20T14:45:00Z'
  },
  {
    id: '2',
    name: 'Green Earth Organics',
    description: 'Sustainable organic food marketplace supporting local farmers.',
    type: 'retail',
    address: '456 Eco Lane, Portland, OR',
    location: {
      lat: 45.5152,
      lng: -122.6784
    },
    contact: {
      phone: '+1 (555) 987-6543',
      email: 'hello@greenearth.org'
    },
    status: 'active',
    imageUrl: 'https://images.pexels.com/photos/3184192/pexels-photo-3184192.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    createdAt: '2023-02-10T10:15:00Z',
    updatedAt: '2023-07-01T11:20:00Z'
  },
  {
    id: '3',
    name: 'HealthFirst Clinic',
    description: 'Community healthcare clinic offering affordable services.',
    type: 'healthcare',
    address: '789 Wellness Ave, Chicago, IL',
    location: {
      lat: 41.8781,
      lng: -87.6298
    },
    contact: {
      phone: '+1 (555) 234-5678',
      email: 'info@healthfirst.med',
      website: 'https://healthfirst.example.org'
    },
    status: 'active',
    imageUrl: 'https://images.pexels.com/photos/4386464/pexels-photo-4386464.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    createdAt: '2023-03-05T09:45:00Z',
    updatedAt: '2023-07-15T16:30:00Z'
  },
  {
    id: '4',
    name: 'Bright Minds Academy',
    description: 'Educational center focusing on STEM programs for youth.',
    type: 'education',
    address: '101 Learning Blvd, Boston, MA',
    location: {
      lat: 42.3601,
      lng: -71.0589
    },
    contact: {
      phone: '+1 (555) 876-5432',
      email: 'admin@brightminds.edu'
    },
    status: 'active',
    imageUrl: 'https://images.pexels.com/photos/256455/pexels-photo-256455.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    createdAt: '2023-04-20T11:00:00Z',
    updatedAt: '2023-08-05T13:15:00Z'
  },
  {
    id: '5',
    name: 'Urban Eats & Treats',
    description: 'Popular food truck collective featuring diverse cuisines.',
    type: 'restaurant',
    address: '202 Foodie Street, Austin, TX',
    location: {
      lat: 30.2672,
      lng: -97.7431
    },
    contact: {
      phone: '+1 (555) 345-6789',
      email: 'eat@urbaneats.com'
    },
    status: 'active',
    imageUrl: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    createdAt: '2023-05-12T13:30:00Z',
    updatedAt: '2023-08-20T10:45:00Z'
  },
  {
    id: '6',
    name: 'Craftsman Workshop',
    description: 'Shared workspace for artisans and small-scale manufacturers.',
    type: 'manufacturing',
    address: '303 Maker Way, Detroit, MI',
    location: {
      lat: 42.3314,
      lng: -83.0458
    },
    contact: {
      phone: '+1 (555) 456-7890',
      email: 'create@craftsman.co',
      website: 'https://craftsman.example.com'
    },
    status: 'pending',
    imageUrl: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    createdAt: '2023-06-08T14:45:00Z',
    updatedAt: '2023-09-01T15:30:00Z'
  },
  {
    id: '7',
    name: 'Serene Spa & Wellness',
    description: 'Holistic wellness center offering massage and relaxation services.',
    type: 'service',
    address: '404 Tranquil Path, Sedona, AZ',
    location: {
      lat: 34.8697,
      lng: -111.7610
    },
    contact: {
      phone: '+1 (555) 567-8901',
      email: 'relax@serenespa.com'
    },
    status: 'inactive',
    imageUrl: 'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    createdAt: '2023-07-22T09:15:00Z',
    updatedAt: '2023-09-15T11:20:00Z'
  },
  {
    id: '8',
    name: 'InnoVenture Capital',
    description: 'Funding and mentorship program for early-stage businesses.',
    type: 'other',
    address: '505 Investor Avenue, New York, NY',
    location: {
      lat: 40.7128,
      lng: -74.0060
    },
    contact: {
      phone: '+1 (555) 678-9012',
      email: 'invest@innoventure.fund',
      website: 'https://innoventure.example.org'
    },
    status: 'active',
    imageUrl: 'https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    createdAt: '2023-08-17T16:30:00Z',
    updatedAt: '2023-10-05T14:45:00Z'
  }
];

// Get counts of businesses by type
const getBusinessTypeCount = (type: BusinessType): number => {
  return businesses.filter(business => business.type === type).length;
};

// Dashboard statistics
export const dashboardStats: DashboardStat[] = [
  {
    id: 'total-businesses',
    title: 'Total Emprendedores',
    value: businesses.length,
    change: 12.5,
    trend: 'up',
    icon: 'BarChart3'
  },
  {
    id: 'active-businesses',
    title: 'Actividad Emprendedores',
    value: businesses.filter(b => b.status === 'active').length,
    change: 8.2,
    trend: 'up',
    icon: 'Activity'
  },
  {
    id: 'technology-ventures',
    title: 'Tech Ventures',
    value: getBusinessTypeCount('technology'),
    change: 5.1,
    trend: 'up',
    icon: 'TrendingUp'
  },
  {
    id: 'retail-locations',
    title: 'Retail Locations',
    value: getBusinessTypeCount('retail'),
    change: -2.3,
    trend: 'down',
    icon: 'BadgeDollarSign'
  },
];

// Business types with corresponding colors for the map markers
export const businessTypeColors: Record<BusinessType, string> = {
  restaurant: '#EF4444',       // Red
  retail: '#3B82F6',           // Blue
  service: '#8B5CF6',          // Purple
  technology: '#10B981',       // Green
  manufacturing: '#F59E0B',    // Amber
  education: '#6366F1',        // Indigo
  healthcare: '#EC4899',       // Pink
  other: '#6B7280',            // Gray
};

// Generate a default map center based on business locations
export const calculateMapCenter = (): [number, number] => {
  // if (businesses.length === 0) return [-28.46957, -65.78524]; // Default to NYC if no businesses
 return [-28.46957, -65.78524]; // Default to NYC if no businesses
  
  const totalLat = businesses.reduce((sum, business) => sum + business.location.lat, 0);
  const totalLng = businesses.reduce((sum, business) => sum + business.location.lng, 0);
  
  return [
    totalLat / businesses.length,
    totalLng / businesses.length
  ];
};