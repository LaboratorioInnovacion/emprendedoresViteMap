'use client';

import { 
  BarChart3, 
  Users, 
  MapPin, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  BadgeDollarSign, 
  Activity 
} from 'lucide-react';
import { use, useEffect } from 'react';


function StatCard({ cantidad, empre }) {
  // Log para depuración cuando cambia 'empre'
  // useEffect(() => {
  //   console.log(empre);
  // }, [empre]);

  // Si recibimos la prop cantidad, mostramos la cantidad total
  if (typeof cantidad === 'number') {
    return (
      <div className="card hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-400">Total de Emprendimientos</p>
            <p className="text-2xl text-gray-900 dark:text-gray-100 font-bold">{cantidad}</p>
          </div>
          <div className="rounded-full p-2 bg-primary-50 dark:bg-primary-900/30">
            <Users size={24} className="text-primary-600 dark:text-primary-400" />
          </div>
        </div>
      </div>
    );
  }

  // Si recibimos la prop empre, mostramos los datos del emprendedor
  // if (empre) {
  //   return (
  //     <div className="card hover:shadow-lg transition-shadow">
  //       <div className="flex justify-between items-start">
  //         <div className="space-y-2">
  //           <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{empre.name}</p>
  //           <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">{empre.type}</p>
  //           <p className="text-base font-bold">{empre.address}</p>
  //         </div>
  //         <div className="rounded-full p-2 bg-primary-50 dark:bg-primary-900/30">
  //           <Users size={24} className="text-primary-600 dark:text-primary-400" />
  //         </div>
  //       </div>
  //       <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
  //         {empre.description}
  //       </div>
  //       <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
  //         Estado: <span className="font-semibold">{empre.status}</span>
  //       </div>
  //     </div>
  //   );
  // }

  // Si no hay datos, no renderiza nada
  return null;
}

export default StatCard;