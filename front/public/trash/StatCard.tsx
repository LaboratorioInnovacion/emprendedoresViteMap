// import React from 'react';
// import { DashboardStat } from '../../types';
// import { TrendingUp, TrendingDown, Minus, BarChart3, Users, MapPin, BadgeDollarSign, Activity } from 'lucide-react';

// interface StatCardProps {
//   stat: DashboardStat;
// }

// const StatCard: React.FC<StatCardProps> = ({ stat }) => {
//   // Get icon component based on icon name
//   const getIcon = () => {
//     switch (stat.icon) {
//       case 'BarChart3':
//         return <BarChart3 size={24} className="text-primary-600 dark:text-primary-400" />;
//       case 'Users':
//         return <Users size={24} className="text-primary-600 dark:text-primary-400" />;
//       case 'MapPin':
//         return <MapPin size={24} className="text-primary-600 dark:text-primary-400" />;
//       case 'TrendingUp':
//         return <TrendingUp size={24} className="text-primary-600 dark:text-primary-400" />;
//       case 'BadgeDollarSign':
//         return <BadgeDollarSign size={24} className="text-primary-600 dark:text-primary-400" />;
//       case 'Activity':
//         return <Activity size={24} className="text-primary-600 dark:text-primary-400" />;
//       default:
//         return <BarChart3 size={24} className="text-primary-600 dark:text-primary-400" />;
//     }
//   };

//   return (
//     <div className="card hover:shadow-lg transition-shadow">
//       <div className="flex justify-between items-start">
//         <div className="space-y-2">
//           <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
//           <p className="text-2xl font-bold">{stat.value.toLocaleString()}</p>
//         </div>
//         <div className="rounded-full p-2 bg-primary-50 dark:bg-primary-900/30">
//           {getIcon()}
//         </div>
//       </div>
//       <div className="mt-4 flex items-center">
//         {stat.trend === 'up' && (
//           <TrendingUp size={16} className="text-success-500 mr-1" />
//         )}
//         {stat.trend === 'down' && (
//           <TrendingDown size={16} className="text-error-500 mr-1" />
//         )}
//         {stat.trend === 'neutral' && (
//           <Minus size={16} className="text-gray-500 mr-1" />
//         )}
//         <span 
//           className={`text-sm font-medium ${
//             stat.trend === 'up' 
//               ? 'text-success-500' 
//               : stat.trend === 'down' 
//                 ? 'text-error-500' 
//                 : 'text-gray-500'
//           }`}
//         >
//           {stat.change > 0 ? '+' : ''}{stat.change}% since last month
//         </span>
//       </div>
//     </div>
//   );
// };

// export default StatCard;