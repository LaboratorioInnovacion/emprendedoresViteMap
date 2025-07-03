import React, { useState } from "react";
import { Business, BusinessType, FilterOptions } from "../../types";
import { Search, Filter, Plus, Activity, MapPin } from "lucide-react";
import { useEmprendedores } from "../../context/EmprendedoresContext";

interface BusinessListProps {
  businesses: Business[];
  onViewDetail: (id: string) => void;
  onAddBusiness: () => void;
}

const BusinessList: React.FC<BusinessListProps> = ({
  businesses,
  onViewDetail,
  onAddBusiness,
}) => {
  const [filters, setFilters] = useState<FilterOptions>({
    businessTypes: [],
    status: [],
    searchTerm: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const { emprendedores } = useEmprendedores();
  // ...resto de la lógica...
  return <div>BusinessList adaptado a Next.js</div>;
};

export default BusinessList;
