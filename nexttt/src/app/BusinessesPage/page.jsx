// 'use client'
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import BusinessList from '../../../nexttt/src/components/businesses/BusinessList.js';
// import
// import { businesses } from '../data/mockData';
// import { useEmprendedores } from "../context/EmprendedoresContext.jsx";

// const BusinessesPage: React.FC = () => {
//   const navigate = useNavigate();
  
//   // Handle business details view
//   const handleViewDetail = (id: string) => {
//     navigate(`/businesses/${id}`);
//   };
  
//   // Handle add new business
//   const handleAddBusiness = () => {
//     navigate('/businesses/new');
//   };
  
//   return (
//     <div className="space-y-6">
//       <BusinessList 
//         businesses={useEmprendedores}
//         onViewDetail={handleViewDetail}
//         onAddBusiness={handleAddBusiness}
//       />
//     </div>
//   );
// };

// export default BusinessesPage;

import Image from "next/image";

export default function Home() {
  return (
    <h1>Holaa</h1>
  );
}
