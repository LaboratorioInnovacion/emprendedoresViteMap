import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import BusinessMap from "../components/map/BusinessMap";
import { businesses, calculateMapCenter } from "../data/mockData";

const MapPage: React.FC = () => {
  const { isMobileSidebarOpen, isMobile } = useOutletContext() as {
    isMobileSidebarOpen: boolean;
    isMobile: boolean;
  };

  const navigate = useNavigate();
  const mapCenter = calculateMapCenter();

  // Handle business selection
  const handleBusinessSelect = (id: string) => {
    navigate(`/businesses/${id}`);
  };

  return (
    <div className="h-[calc(100vh-180px)]">
      {!(isMobile && isMobileSidebarOpen) && (
      <BusinessMap
        businesses={businesses}
        defaultViewport={{
          center: mapCenter,
          zoom: 5,
        }}
        //handle id
        onBusinessSelect={handleBusinessSelect}
      />)}
    </div>
  );
};

export default MapPage;
