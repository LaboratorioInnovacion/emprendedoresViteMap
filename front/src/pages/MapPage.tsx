import React from 'react';
import { useNavigate } from 'react-router-dom';
import BusinessMap from '../components/map/BusinessMap';
import { businesses, calculateMapCenter } from '../data/mockData';

const MapPage: React.FC = () => {
  const navigate = useNavigate();
  const mapCenter = calculateMapCenter();
  
  // Handle business selection
  const handleBusinessSelect = (id: string) => {
    navigate(`/businesses/${id}`);
  };
  
  return (
    <div className="h-[calc(100vh-180px)]">
      <BusinessMap 
        businesses={businesses}
        defaultViewport={{
          center: mapCenter,
          zoom: 5
        }}
        onBusinessSelect={handleBusinessSelect}
      />
    </div>
  );
};

export default MapPage;