'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function PerfilPage() {
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    cuil: '',
    telefono: '',
    direccion: '',
    genero: 'PrefieroNoDecir',
  });

  useEffect(() => {
    if (!isLoggedIn) router.push('/login');
    if (user?.emprendedorId) router.push('/dashboard'); // ya tiene perfil
  }, [isLoggedIn]);

  async function handleSubmit(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const res = await fetch('/api/emprendedores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    });

    if (res.ok) {
      router.push('/dashboard');
    } else {
      alert('Error al guardar perfil');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4 p-4">
      <h2 className="text-xl font-bold">Completar perfil de emprendedor</h2>

      <input
        type="text"
        placeholder="Nombre"
        className="w-full p-2 border rounded"
        value={form.nombre}
        onChange={(e) => setForm({ ...form, nombre: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Apellido"
        className="w-full p-2 border rounded"
        value={form.apellido}
        onChange={(e) => setForm({ ...form, apellido: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="DNI"
        className="w-full p-2 border rounded"
        value={form.dni}
        onChange={(e) => setForm({ ...form, dni: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="CUIL"
        className="w-full p-2 border rounded"
        value={form.cuil}
        onChange={(e) => setForm({ ...form, cuil: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Teléfono"
        className="w-full p-2 border rounded"
        value={form.telefono}
        onChange={(e) => setForm({ ...form, telefono: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Dirección"
        className="w-full p-2 border rounded"
        value={form.direccion}
        onChange={(e) => setForm({ ...form, direccion: e.target.value })}
        required
      />

      <select
        className="w-full p-2 border rounded"
        value={form.genero}
        onChange={(e) => setForm({ ...form, genero: e.target.value })}
      >
        <option value="Masculino">Masculino</option>
        <option value="Femenino">Femenino</option>
        <option value="PrefieroNoDecir">Prefiero no decir</option>
      </select>

      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        Guardar perfil
      </button>
    </form>
  );
}
