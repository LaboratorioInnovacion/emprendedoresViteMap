import { Users } from 'lucide-react';
import { useEffect } from 'react';

function StatCard({ cantidad, empre }) {
  useEffect(() => {
    console.log(empre);
  }, [empre]);

  if (typeof cantidad === 'number') {
    return (
      <div className="card hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total de emprendedores</p>
            <p className="text-2xl font-bold">{cantidad}</p>
          </div>
          <div className="rounded-full p-2 bg-primary-50 dark:bg-primary-900/30">
            <Users size={24} className="text-primary-600 dark:text-primary-400" />
          </div>
        </div>
      </div>
    );
  }
  return null;
}

export default StatCard;
