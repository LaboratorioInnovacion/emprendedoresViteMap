import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BusinessList from '../components/businesses/BusinessList';
import { businesses } from '../data/mockData';
import { useEmprendedores } from "../context/EmprendedoresContext.jsx";

const BusinessesPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Handle business details view
  const handleViewDetail = (id: string) => {
    navigate(`/businesses/${id}`);
  };
  
  // Handle add new business
  const handleAddBusiness = () => {
    navigate('/businesses/new');
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