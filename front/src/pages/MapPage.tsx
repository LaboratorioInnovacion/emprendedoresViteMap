import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import BusinessMap from "../components/map/BusinessMap";
import { calculateMapCenter } from "../data/mockData";
import { useEmprendedores } from "../context/EmprendedoresContext.jsx";
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

// Ajustar tipos explícitos para los parámetros y propiedades
interface EmprendedoresPieChartProps {
  emprendedores: Array<{ type: string }>;

}

const EmprendedoresPieChart: React.FC<EmprendedoresPieChartProps> = ({ emprendedores }) => {
  const businessTypeColors = {
    Gastronomía: '#FF6384',
    Servicios: '#36A2EB',
    Indumentaria: '#FFCE56',
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
      <PieChart width={300} height={300}>
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
        <Legend />
      </PieChart>
    </div>
  );
};

const MapPage: React.FC = () => {
  const { isMobileSidebarOpen, isMobile } = useOutletContext() as {
    isMobileSidebarOpen: boolean;
    isMobile: boolean;
  };

  const navigate = useNavigate();
  const mapCenter = calculateMapCenter();
  const { emprendedores } = useEmprendedores();
  console.log("Emprendedores:", emprendedores);

  // Handle business selection
  const handleBusinessSelect = (id: string) => {
    navigate(`/businesses/${id}`);
  };

  return (
    <>
      <div className="h-[calc(100vh-180px)]">
        {!(isMobile && isMobileSidebarOpen) && (
          <BusinessMap
            emprendedores={emprendedores}
            defaultViewport={{
              center: mapCenter,
              zoom: 5,
            }}
            //handle id
            onBusinessSelect={handleBusinessSelect}
          />
        )}
        <div>
          {/* Add the pie chart below the map */}
          <EmprendedoresPieChart emprendedores={emprendedores} />
        </div>
      </div>
    </>
  );
};

export default MapPage;
