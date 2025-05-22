// import React, { useState, useEffect } from 'react';
// import { Outlet } from 'react-router-dom';
// import Header from './Header';
// import Sidebar from './Sidebar';

// const AppLayout: React.FC = () => {
//   const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

//   const toggleMobileSidebar = () => {
//     setIsMobileSidebarOpen(!isMobileSidebarOpen);
//   };

//   // Handle window resize to detect mobile vs desktop
//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 768);
//       if (window.innerWidth >= 768) {
//         setIsMobileSidebarOpen(false);
//       }
//     };

//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   return (
//     <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
//       {/* Sidebar for desktop */}
//       {!isMobile && <Sidebar isMobile={false} toggleMobileSidebar={toggleMobileSidebar} />}
      
//       {/* Mobile sidebar (overlay) */}
//       {isMobile && isMobileSidebarOpen && (
//         <Sidebar isMobile={true} toggleMobileSidebar={toggleMobileSidebar} />
//       )}
      
//       {/* Main content area */}
//       <div className="flex-1 flex flex-col ml-0 md:ml-64 transition-all duration-300">
//         <Header toggleMobileSidebar={toggleMobileSidebar} />
//         <main className="flex-1 p-4 md:p-6 overflow-y-auto">
//           <Outlet />
//         </main>
//         <footer className="py-4 px-6 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
//           &copy; {new Date().getFullYear()} VentureMap Dashboard. All rights reserved.
//         </footer>
//       </div>
//     </div>
//   );
// };

// export default AppLayout;