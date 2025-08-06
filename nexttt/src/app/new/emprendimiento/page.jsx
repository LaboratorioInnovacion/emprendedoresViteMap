"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix íconos Leaflet en Next.js
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

export default function EmprendimientosPage() {
  const { data: session, status } = useSession();
  const [emprendimientos, setEmprendimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (status === "authenticated" && session.user.emprendedorId) {
      fetch(`/api/emprendimientos?emprendedorId=${session.user.emprendedorId}`)
        .then((res) => res.json())
        .then((data) => {
          setEmprendimientos(data);
          setLoading(false);
        });
    }
  }, [status, session]);

  const handleSelect = (item) => {
    setForm({ ...item });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const method = form.id ? "PUT" : "POST";
    const url = form.id ? "/api/emprendimientos/" + form.id : "/api/emprendimientos";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const saved = await res.json();
      setEmprendimientos((prev) => {
        if (method === "PUT") return prev.map((e) => (e.id === saved.id ? saved : e));
        return [...prev, saved];
      });
      setForm(null);
      alert("Guardado con éxito");
    } else {
      alert("Error al guardar");
    }
  };

  if (status === "loading" || loading) return <p>Cargando emprendimientos...</p>;
  if (status !== "authenticated") return <p>No autorizado</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Mis Emprendimientos</h1>
      <div className="flex gap-4">
        <ul className="w-1/3 bg-white p-4 rounded shadow">
          {emprendimientos.map((e) => (
            <li
              key={e.id}
              className="py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSelect(e)}
            >
              {e.denominacion}
            </li>
          ))}
          <li
            className="mt-4 py-2 text-center bg-primary-600 text-white rounded cursor-pointer"
            onClick={() => setForm({ denominacion: "", etapa: "IDEA", ubicacion: null })}
          >
            + Nuevo Emprendimiento
          </li>
        </ul>

        {form && (
          <form className="w-2/3 bg-white p-6 rounded shadow grid grid-cols-1 gap-4" onSubmit={handleSave}>
            {[
              ["denominacion", "Denominación"],
              ["etapa", "Etapa"],
            ].map(([name, label]) => (
              <div key={name}>
                <label className="block text-sm font-medium mb-1">{label}</label>
                <input
                  name={name}
                  value={form[name] || ""}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            ))}
            <UbicacionField ubicacion={form.ubicacion} setUbicacion={(u) => setForm((f) => ({ ...f, ubicacion: u }))} />
            <button type="submit" className="mt-4 bg-primary-600 text-white py-2 px-4 rounded">
              Guardar
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function UbicacionField({ ubicacion, setUbicacion }) {
  const [position, setPosition] = useState(ubicacion || null);

  useEffect(() => {
    if (!position && typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          const pos = { lat: coords.latitude, lng: coords.longitude };
          setPosition(pos);
          setUbicacion(pos);
        }
      );
    }
  }, [position, setUbicacion]);

  const DraggableMarker = () => {
    const map = useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition({ lat, lng });
        setUbicacion({ lat, lng });
      },
    });
    return position ? (
      <Marker
        position={position}
        draggable
        eventHandlers={{
          dragend: (e) => {
            const { lat, lng } = e.target.getLatLng();
            setPosition({ lat, lng });
            setUbicacion({ lat, lng });
          },
        }}
      />
    ) : null;
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-1">Ubicación</label>
      <input
        value={position ? `${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}` : ""}
        readOnly
        className="w-full mb-2 p-2 border rounded"
      />
      {position && (
        <div className="h-64 rounded overflow-hidden">
          <MapContainer center={position} zoom={13} style={{ height: "100%", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <DraggableMarker />
          </MapContainer>
        </div>
      )}
    </div>
  );
}

// 'use client';
// import React, { useEffect, useState } from 'react';
// import dynamic from 'next/dynamic';
// import 'leaflet/dist/leaflet.css';
// import StatCard from '../../../components/dashboard/StatCard';
// import RecentBusinessCard from '../../../components/dashboard/RecentBusinessCard';
// import {
//   businessTypeColors,
//   calculateMapCenter,
// } from '../../../data/mockData';
// import { useEmprendedores } from '../../../context/EmprendedoresContext';
// import Link from 'next/link';
// import {
//   Building2,
//   Map,
//   ArrowRight,
//   MapPin,
//   Phone,
//   Activity,
// } from 'lucide-react';

// const Page = () => {
//   const { emprendedores } = useEmprendedores();
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedTypes, setSelectedTypes] = useState([]);
//   const mapCenter = calculateMapCenter();

//   // Carga dinámica de react-leaflet (memoizada para evitar recreación)
//   const MapContainer = React.useMemo(() => dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false }), []);
//   const TileLayer = React.useMemo(() => dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false }), []);
//   const Marker = React.useMemo(() => dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false }), []);
//   const Popup = React.useMemo(() => dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false }), []);

//   // Carga dinámica de leaflet para evitar problemas de SSR
//   const [L, setL] = useState(null);
//   useEffect(() => {
//     const loadLeaflet = async () => {
//       const leaflet = await import('leaflet');
//       setL(leaflet);
//     };
//     loadLeaflet();
//   }, []);

//   // Filtro de negocios (usar solo emprendedores del contexto)
//   const filteredBusinesses = emprendedores.filter((business) => {
//     const matchesSearch =
//       business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       business.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       business.address.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesType =
//       selectedTypes.length === 0 || selectedTypes.includes(business.type);
//     return matchesSearch && matchesType;
//   });

//   // Crear iconos personalizados para los negocios
//   const createBusinessIcon = (type) => {
//     if (!L) return null;
//     const color = businessTypeColors[type];
//     const svgIcon = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='24' height='24'><circle cx='16' cy='16' r='10' fill='${color}' stroke='white' stroke-width='2'/></svg>`;
//     const iconUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svgIcon)}`;
//     return new L.Icon({
//       iconUrl,
//       iconSize: [28, 28],
//       iconAnchor: [16, 16],
//       popupAnchor: [0, -16],
//     });
//   };

//   // Badge de estado
//   const getStatusBadgeClass = (status) => {
//     switch (status) {
//       case 'active':
//         return 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-500';
//       case 'inactive':
//         return 'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-500';
//       case 'pending':
//         return 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-500';
//       default:
//         return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
//           <p className="text-gray-600 dark:text-gray-400">
//             Bienvenido al Sistema de Emprendedores
//           </p>
//         </div>
//         <div className="flex gap-2">
//           <Link href="/BusinessesPage" className="btn-outline">
//             <Building2 size={18} className="mr-1" />
//             Emprendedores
//           </Link>
//           <Link href="/MapPage" className="btn-primary">
//             <Map size={18} className="mr-1" />
//             Explorar Mapa
//           </Link>
//         </div>
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
//         <StatCard cantidad={emprendedores.length} empre={undefined} />
//         {emprendedores.map((empre) => (
//           <StatCard key={empre.id} empre={empre} cantidad={undefined} />
//         ))}
//       </div>
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2 card">
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center">
//               <Map size={20} className="text-primary-600 dark:text-primary-400 mr-2" />
//               <h2 className="text-xl font-semibold">Mapa Negocios</h2>
//             </div>
//             <Link href="/map" className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center">
//               Vista Mapa <ArrowRight size={16} className="ml-1" />
//             </Link>
//           </div>
//           <div className="h-80 lg:h-[500px] rounded-lg overflow-hidden">
//             {L && (
//               <MapContainer
//                 center={mapCenter}
//                 zoom={12}
//                 style={{ height: '100%', width: '100%' }}
//                 zoomControl={false}
//               >
//                 <TileLayer
//                   attribution=""
//                   url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                 />
//                 {filteredBusinesses.map((business) => (
//                   <Marker
//                     key={business.id}
//                     position={[business.location.lat, business.location.lng]}
//                     icon={createBusinessIcon(business.type)}
//                   >
//                     <Popup>
//                       <div className="w-64">
//                         <div className="flex items-start gap-3 mb-3">
//                           {business.imageUrl ? (
//                             <img
//                               src={business.imageUrl}
//                               alt={business.name}
//                               className="w-16 h-16 rounded-lg object-cover"
//                             />
//                           ) : (
//                             <div className="w-16 h-16 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 text-xl font-bold">
//                               {business.name.charAt(0)}
//                             </div>
//                           )}
//                           <div className="flex-1 min-w-0">
//                             <h3 className="font-medium text-base mb-1">
//                               {business.name}
//                             </h3>
//                             <div className="flex flex-wrap gap-2">
//                               <span className="badge badge-secondary text-xs capitalize">
//                                 {business.type}
//                               </span>
//                               <span
//                                 className={`badge ${getStatusBadgeClass(business.status)} flex items-center text-xs`}
//                               >
//                                 <Activity size={12} className="mr-1" />
//                                 {business.status.charAt(0).toUpperCase() + business.status.slice(1)}
//                               </span>
//                             </div>
//                           </div>
//                         </div>
//                         <div className="space-y-2 text-sm">
//                           <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
//                             {business.description}
//                           </p>
//                           <div className="flex items-center text-gray-600 dark:text-gray-400">
//                             <MapPin size={14} className="mr-1 flex-shrink-0" />
//                             <span className="truncate">{business.address}</span>
//                           </div>
//                           <div className="flex items-center text-gray-600 dark:text-gray-400">
//                             <Phone size={14} className="mr-1 flex-shrink-0" />
//                             <span>{business.contact.phone}</span>
//                           </div>
//                         </div>
//                         <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
//                           <Link href={`/businesses/${business.id}`} className="btn-primary w-full justify-center text-sm py-1.5" style={{ color: '#fff' }}>
//                             Ver Detalles
//                           </Link>
//                         </div>
//                       </div>
//                     </Popup>
//                   </Marker>
//                 ))}
//               </MapContainer>
//             )}
//           </div>
//           <div className="mt-3 flex flex-wrap gap-2">
//             {Object.entries(businessTypeColors).map(([type, color]) => (
//               <div key={type} className="flex items-center">
//                 <div className="h-3 w-3 rounded-full mr-1" style={{ backgroundColor: color }}></div>
//                 <span className="text-xs capitalize">{type}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//         <div className="space-y-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <Building2 size={20} className="text-primary-600 dark:text-primary-400 mr-2" />
//               <h2 className="text-xl font-semibold">Negocios Recientes</h2>
//             </div>
//             <Link href="/businesses" className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center">
//               Ver Todo<ArrowRight size={16} className="ml-1" />
//             </Link>
//           </div>
//           {emprendedores.slice(-3).map((business) => (
//             <RecentBusinessCard key={business.id} business={business} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Page;
// // 'use client';
// // import React, { useEffect, useState } from 'react';
// // import dynamic from 'next/dynamic';
// // import 'leaflet/dist/leaflet.css';
// // import StatCard from '../components/dashboard/StatCard';
// // import RecentBusinessCard from '../components/dashboard/RecentBusinessCard';
// // import {
// //   businessTypeColors,
// //   calculateMapCenter,
// // } from '../data/mockData';
// // import { useEmprendedores } from '../context/EmprendedoresContext';
// // import Link from 'next/link';
// // import {
// //   BarChart3,
// //   Building2,
// //   Map,
// //   ArrowRight,
// //   MapPin,
// //   Phone,
// //   Activity,
// // } from 'lucide-react';

// // const Page: React.FC = () => {
// //   const { emprendedores } = useEmprendedores();
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [selectedTypes, setSelectedTypes] = useState([]);
// //   const mapCenter = calculateMapCenter();

// //   // Carga dinámica de react-leaflet
// //   const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
// //   const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
// //   const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
// //   const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

// //   // Carga dinámica de leaflet para evitar problemas de SSR
// //   const [L, setL] = useState<any>(null);
// //   useEffect(() => {
// //     const loadLeaflet = async () => {
// //       const leaflet = await import('leaflet');
// //       setL(leaflet);
// //     };
// //     loadLeaflet();
// //   }, []);

// //   // Filtro de negocios (usar solo emprendedores del contexto)
// //   const filteredBusinesses = emprendedores.filter((business: any) => {
// //     const matchesSearch =
// //       business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       business.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       business.address.toLowerCase().includes(searchTerm.toLowerCase());
// //     const matchesType =
// //       selectedTypes.length === 0 || selectedTypes.includes(business.type);
// //     return matchesSearch && matchesType;
// //   });

// //   // Crear iconos personalizados para los negocios
// //   const createBusinessIcon = (type: string) => {
// //     if (!L) return null;
// //     const color = businessTypeColors[type];
// //     const svgIcon = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='24' height='24'><circle cx='16' cy='16' r='10' fill='${color}' stroke='white' stroke-width='2'/></svg>`;
// //     const iconUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svgIcon)}`;
// //     return new L.Icon({
// //       iconUrl,
// //       iconSize: [28, 28],
// //       iconAnchor: [16, 16],
// //       popupAnchor: [0, -16],
// //     });
// //   };

// //   // Badge de estado
// //   const getStatusBadgeClass = (status: 'active' | 'inactive' | 'pending') => {
// //     switch (status) {
// //       case 'active':
// //         return 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-500';
// //       case 'inactive':
// //         return 'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-500';
// //       case 'pending':
// //         return 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-500';
// //       default:
// //         return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
// //     }
// //   };

// //   return (
// //     <div className="space-y-6">
// //       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
// //         <div>
// //           <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
// //           <p className="text-gray-600 dark:text-gray-400">
// //             Bienvenido al Sistema de Emprendedores
// //           </p>
// //         </div>
// //         <div className="flex gap-2">
// //           <Link href="/businesses" className="btn-outline">
// //             <Building2 size={18} className="mr-1" />
// //             Emprendedores
// //           </Link>
// //           <Link href="/map" className="btn-primary">
// //             <Map size={18} className="mr-1" />
// //             Explorar Mapa
// //           </Link>
// //         </div>
// //       </div>
// //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
// //         <StatCard cantidad={emprendedores.length} empre={undefined} />
// //         {emprendedores.map((empre: any) => (
// //           <StatCard key={empre.id} empre={empre} cantidad={undefined} />
// //         ))}
// //       </div>
// //       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
// //         <div className="lg:col-span-2 card">
// //           <div className="flex items-center justify-between mb-4">
// //             <div className="flex items-center">
// //               <Map size={20} className="text-primary-600 dark:text-primary-400 mr-2" />
// //               <h2 className="text-xl font-semibold">Mapa Negocios</h2>
// //             </div>
// //             <Link href="/map" className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center">
// //               Vista Mapa <ArrowRight size={16} className="ml-1" />
// //             </Link>
// //           </div>
// //           <div className="h-80 lg:h-[500px] rounded-lg overflow-hidden">
// //             {L && (
// //               <MapContainer
// //                 center={mapCenter}
// //                 zoom={12}
// //                 style={{ height: '100%', width: '100%' }}
// //                 zoomControl={false}
// //               >
// //                 <TileLayer
// //                   attribution=""
// //                   url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
// //                 />
// //                 {filteredBusinesses.map((business: any) => (
// //                   <Marker
// //                     key={business.id}
// //                     position={[business.location.lat, business.location.lng]}
// //                     icon={createBusinessIcon(business.type)}
// //                   >
// //                     <Popup>
// //                       <div className="w-64">
// //                         <div className="flex items-start gap-3 mb-3">
// //                           {business.imageUrl ? (
// //                             <img
// //                               src={business.imageUrl}
// //                               alt={business.name}
// //                               className="w-16 h-16 rounded-lg object-cover"
// //                             />
// //                           ) : (
// //                             <div className="w-16 h-16 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 text-xl font-bold">
// //                               {business.name.charAt(0)}
// //                             </div>
// //                           )}
// //                           <div className="flex-1 min-w-0">
// //                             <h3 className="font-medium text-base mb-1">
// //                               {business.name}
// //                             </h3>
// //                             <div className="flex flex-wrap gap-2">
// //                               <span className="badge badge-secondary text-xs capitalize">
// //                                 {business.type}
// //                               </span>
// //                               <span
// //                                 className={`badge ${getStatusBadgeClass(business.status)} flex items-center text-xs`}
// //                               >
// //                                 <Activity size={12} className="mr-1" />
// //                                 {business.status.charAt(0).toUpperCase() + business.status.slice(1)}
// //                               </span>
// //                             </div>
// //                           </div>
// //                         </div>
// //                         <div className="space-y-2 text-sm">
// //                           <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
// //                             {business.description}
// //                           </p>
// //                           <div className="flex items-center text-gray-600 dark:text-gray-400">
// //                             <MapPin size={14} className="mr-1 flex-shrink-0" />
// //                             <span className="truncate">{business.address}</span>
// //                           </div>
// //                           <div className="flex items-center text-gray-600 dark:text-gray-400">
// //                             <Phone size={14} className="mr-1 flex-shrink-0" />
// //                             <span>{business.contact.phone}</span>
// //                           </div>
// //                         </div>
// //                         <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
// //                           <Link href={`/businesses/${business.id}`} className="btn-primary w-full justify-center text-sm py-1.5" style={{ color: '#fff' }}>
// //                             Ver Detalles
// //                           </Link>
// //                         </div>
// //                       </div>
// //                     </Popup>
// //                   </Marker>
// //                 ))}
// //               </MapContainer>
// //             )}
// //           </div>
// //           <div className="mt-3 flex flex-wrap gap-2">
// //             {Object.entries(businessTypeColors).map(([type, color]) => (
// //               <div key={type} className="flex items-center">
// //                 <div className="h-3 w-3 rounded-full mr-1" style={{ backgroundColor: color as string }}></div>
// //                 <span className="text-xs capitalize">{type}</span>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //         <div className="space-y-4">
// //           <div className="flex items-center justify-between">
// //             <div className="flex items-center">
// //               <Building2 size={20} className="text-primary-600 dark:text-primary-400 mr-2" />
// //               <h2 className="text-xl font-semibold">Negocios Recientes</h2>
// //             </div>
// //             <Link href="/businesses" className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center">
// //               Ver Todo<ArrowRight size={16} className="ml-1" />
// //             </Link>
// //           </div>
// //           {emprendedores.slice(-3).map((business: any) => (
// //             <RecentBusinessCard key={business.id} business={business} />
// //           ))}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Page;