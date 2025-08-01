'use client';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user, isLoggedIn, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) return <p>Cargando...</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Bienvenido, {user.email}</h1>
      <p>Rol: <strong>{user.rol}</strong></p>
      <button onClick={logout} className="mt-4 px-4 py-2 bg-red-600 text-white rounded">
        Cerrar sesión
      </button>
    </div>
  );
}
