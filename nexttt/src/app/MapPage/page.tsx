'use client';
import React from "react";
import { useRouter } from "next/navigation";
import BusinessMap from "../../components/map/BusinessMap";
import { calculateMapCenter } from "../../data/mockData";
import { useEmprendedores } from "../../context/EmprendedoresContext.jsx";
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

// Ajustar tipos explícitos para los parámetros y propiedades
interface EmprendedoresPieChartProps {
  emprendedores: Array<{ type: string }>;

}

const EmprendedoresPieChart: React.FC<EmprendedoresPieChartProps> = ({ emprendedores }) => {
  const businessTypeColors = {
    Gastronomía: "#E11D48", // Rojo vibrante
    Servicios: "#2563EB", // Azul profundo
    Indumentaria: "#D97706", // Ámbar intenso
    Tecnología: "#059669", // Verde fresco
    Educación: "#4F46E5", // Índigo saturado
    Artesanía: "#4338CA", // Índigo oscuro
    Turismo: "#4F46E5", // Índigo profundo
    Salud: "#DB2777", // Rosa profundo
    Otro: "#4B5563", // Gris oscuro
  };

  const totalBusinesses = emprendedores.length;

  const data = Object.entries(businessTypeColors).map(([type, color]) => {
    const count = emprendedores.filter((business) => business.type === type).length;
    return {
      name: `${type} (${count} negocios)`,
      value: count,
      color,
    };
  });

  return (
    <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col items-center">
      <h3 className="text-sm font-medium mb-2">Distribución de Negocios</h3>
      <p className="text-lg font-semibold mb-4">Total de negocios: {totalBusinesses}</p>
      <div className="w-full flex justify-center">
        <PieChart width={250} height={250}>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color as string} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
      <div className="mt-4 w-full text-center">
        <Legend layout="horizontal" align="center" />
      </div>
    </div>
  );
};

const MapPage: React.FC = () => {
  const router = useRouter();
  const mapCenter = calculateMapCenter();
  const { emprendedores } = useEmprendedores();
  console.log("Emprendedores:", emprendedores);

  // Handle business selection
  const handleBusinessSelect = (id: string) => {
    router.push(`/businesses/${id}`);
  };

  return (
    <>
      <div className="h-[calc(100vh-180px)]">
        <BusinessMap
          emprendedores={emprendedores}
          defaultViewport={{
            center: mapCenter,
            zoom: 5,
          }}
          //handle id
          onBusinessSelect={handleBusinessSelect}
        />
        <div className="pb-5">
          {/* Add the pie chart below the map */}
          <EmprendedoresPieChart emprendedores={emprendedores} />
        </div>
      </div>
    </>
  );
};

export default MapPage;
