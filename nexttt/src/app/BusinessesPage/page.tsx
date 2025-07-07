"use client"
import React from "react";
import { useRouter } from "next/navigation";
import BusinessList from "../../components/businesses/BusinessList";
import { useEmprendedores } from "../../context/EmprendedoresContext.jsx";

const BusinessesPage: React.FC = () => {
  const router = useRouter();
  const { emprendedores } = useEmprendedores();

  // Navegar al detalle del negocio
  const handleViewDetail = (id: string) => {
    router.push(`/businesses/${id}`);
  };

  // Navegar a la página de agregar nuevo negocio
  const handleAddBusiness = () => {
    router.push("/businesses/new");
  };

  return (
    <div className="space-y-6">
      <BusinessList
        businesses={emprendedores}
        onViewDetail={handleViewDetail}
        onAddBusiness={handleAddBusiness}
      />
    </div>
  );
};

export default BusinessesPage;
