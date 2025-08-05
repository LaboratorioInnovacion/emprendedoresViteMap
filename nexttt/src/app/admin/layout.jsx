// app/admin/layout.jsx
'use client';

import { useSession } from 'next-auth/react';
import { redirect }   from 'next/navigation';

export default function AdminLayout({ children }) {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <p>Cargando...</p>;
  }

  // Si no está autenticado o no es ADMIN
  if (!session || session.user.rol !== 'ADMIN') {
    redirect('/403');
  }

  return (
    <div className="admin-layout">
      {/* Aquí tu sidebar, header, etc. */}
      {children}
    </div>
  );
}
