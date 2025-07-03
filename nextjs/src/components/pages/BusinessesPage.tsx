// Adaptación para Next.js
'use client';
import React from 'react';
import BusinessList from '../businesses/BusinessList';
import { useEmprendedores } from "../../context/EmprendedoresContext";

const BusinessesPage: React.FC = () => {
  // Adaptar navegación a Next.js
  const handleViewDetail = (id: string) => {
    window.location.href = `/businesses/${id}`;
  };
  const handleAddBusiness = () => {
    window.location.href = '/businesses/new';
  };
  return (
    <div className="space-y-6">
      <BusinessList 
        businesses={useEmprendedores}
        onViewDetail={handleViewDetail}
        onAddBusiness={handleAddBusiness}
      />
    </div>
  );
};

export default BusinessesPage;
