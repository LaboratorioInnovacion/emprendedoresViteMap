'use client';

import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../nexttt/src/components/layout/Header';
import Sidebar from '../nexttt/src/components/layout/Sidebar';

function AppLayout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false); // No usar window.innerWidth aquí
  const [mounted, setMounted] = useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileSidebarOpen(false);
      }
    };
    handleResize(); // Ejecutar al montar
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!mounted) return null; // Evita el render hasta que esté montado en el cliente

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {!isMobile && <Sidebar isMobile={false} toggleMobileSidebar={toggleMobileSidebar} />}
      
      {isMobile && isMobileSidebarOpen && (
        <Sidebar isMobile={true} toggleMobileSidebar={toggleMobileSidebar} />
      )}
      
      <div className="flex-1 flex flex-col ml-0 md:ml-64 transition-all duration-300">
        <Header toggleMobileSidebar={toggleMobileSidebar} />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <Outlet context={{ isMobileSidebarOpen, isMobile }} />
        </main>
        <footer className="py-4 px-6 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
          &copy;{new Date().getFullYear()} Augusto Del Campo-Nodo Tecnologico Catamarca.
        </footer>
      </div>
    </div>
  );
}

export default AppLayout;