'use client';

import { useState } from 'react';
import { 
  LayoutDashboard, 
  Map, 
  Building2, 
  PieChart, 
  Settings, 
  HelpCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function Sidebar({ isMobile, toggleMobileSidebar }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/MapPage', label: 'Mapa', icon: <Map size={20} /> },
    { path: '/businesses', label: 'Emprendedores', icon: <Building2 size={20} /> },
    { path: '/analytics', label: 'Analiticas', icon: <PieChart size={20} /> },
    { path: '/settings', label: 'Ajustes', icon: <Settings size={20} /> },
    { path: '/help', label: 'Soporte', icon: <HelpCircle size={20} /> },
  ];

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 flex bg-black bg-opacity-50" onClick={toggleMobileSidebar}>
        <div 
          className="w-64 max-w-[80%] bg-white dark:bg-gray-800 shadow-lg animate-fadeIn"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <Map className="text-primary-600" />
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">EmpreMap</h1>
            </div>
            <button onClick={toggleMobileSidebar} className="p-1">
              <ChevronLeft size={20} className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          <nav className="p-2">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link key={item.path} href={item.path} onClick={toggleMobileSidebar}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-md transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-600 dark:bg-primary-900 dark:text-primary-300'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 z-10 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className={`flex items-center ${collapsed ? 'justify-center w-full' : 'space-x-2'}`}>
            <Map className="text-primary-600" />
            {!collapsed && <h1 className="text-lg font-semibold text-gray-900 dark:text-white">EmpreMap</h1>}
          </div>
          <button 
            onClick={toggleCollapse} 
            className={`p-1 ${collapsed ? 'absolute right-3' : ''}`}
          >
            {collapsed ? <ChevronRight size={16} className="text-gray-500" /> : <ChevronLeft size={16} className="text-gray-500" />}
          </button>
        </div>
        <nav className="flex-1 p-2">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link key={item.path} href={item.path}
                className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-2'} px-4 py-3 rounded-md transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-600 dark:bg-primary-900 dark:text-primary-300'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
                title={collapsed ? item.label : undefined}
              >
                {item.icon}
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

export default Sidebar;