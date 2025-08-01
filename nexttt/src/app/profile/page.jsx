'use client';
import { useEffect, useState } from 'react';
// import { useAuth } from '@/context/auth-context';
import { useAuth } from "../../context/AuthContext";
import { useRouter } from 'next/navigation';

export default function PerfilPage() {
  const { user, isLoggedIn, isEmprendedor, refreshUser } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    cuil: '',
    direccion: '',
    telefono: '',
    genero: 'PrefieroNoDecir',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) return router.push('/login');
    if (!isEmprendedor) return router.push('/403');
    if (user?.emprendedorId) return router.push('/dashboard');
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');

    try {
      const res = await fetch('/api/emprendedores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      if (!res.ok) throw new Error('Error al crear el perfil');

      // Opcional: actualizar el contexto si cambió el JWT
      refreshUser();
      router.push('/dashboard');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn || !isEmprendedor || user?.emprendedorId) return null;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Mi Perfil</h1>

      <p><strong>Email:</strong> {user?.email}</p>
      <p><strong>Rol:</strong> {user?.rol}</p>

      <hr className="my-6" />

      <h2 className="text-xl font-semibold mb-2">Completa tu perfil como emprendedor</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="apellido"
          placeholder="Apellido"
          value={form.apellido}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="dni"
          placeholder="DNI"
          value={form.dni}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="cuil"
          placeholder="CUIL"
          value={form.cuil}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="telefono"
          placeholder="Teléfono"
          value={form.telefono}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="direccion"
          placeholder="Dirección"
          value={form.direccion}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <select
          name="genero"
          value={form.genero}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="Masculino">Masculino</option>
          <option value="Femenino">Femenino</option>
          <option value="PrefieroNoDecir">Prefiero no decir</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Guardando...' : 'Guardar perfil'}
        </button>
      </form>
    </div>
  );
}

// 'use client';
// import { useEffect, useState } from 'react';
// import { useAuth } from '../../hooks/useAuth';
// import { useRouter } from 'next/navigation';

// export default function PerfilPage() {
//   const { user, isLoggedIn } = useAuth();
//   const router = useRouter();

//   const [form, setForm] = useState({
//     nombre: '',
//     apellido: '',
//     dni: '',
//     cuil: '',
//     telefono: '',
//     direccion: '',
//     genero: 'PrefieroNoDecir',
//   });

//   // 🔐 Verificar acceso
//   useEffect(() => {
//     if (!isLoggedIn) {
//       router.push('/login');
//     } else if (user.rol !== 'EMPRENDEDOR') {
//       router.push('/403');
//     } else if (user.emprendedorId) {
//       router.push('/dashboard');
//     }
//   }, [user]);

//   // ✍️ Solo para EMPRENDEDORES sin perfil
//   async function handleSubmit(e) {
//     e.preventDefault();
//     const token = localStorage.getItem('token');

//     const res = await fetch('/api/emprendedores', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`
//       },
//       body: JSON.stringify(form)
//     });

//     if (res.ok) {
//       router.push('/dashboard');
//     } else {
//       alert('Error al guardar perfil');
//     }
//   }

//   if (!isLoggedIn || user.rol !== 'EMPRENDEDOR') return null;

//   return (
//     <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4 p-4">
//       <h2 className="text-xl font-bold">Completa tu perfil como emprendedor</h2>

//       <input
//         type="text"
//         placeholder="Nombre"
//         className="w-full p-2 border rounded"
//         value={form.nombre}
//         onChange={(e) => setForm({ ...form, nombre: e.target.value })}
//         required
//       />
//       {/* ...otros campos */}
//       <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
//         Guardar
//       </button>
//     </form>
//   );
// }

// // 'use client';
// // import { useEffect, useState } from 'react';
// // import { useAuth } from '@/hooks/useAuth';
// // import { useRouter } from 'next/navigation';

// // export default function PerfilPage() {
// //   const { user, isLoggedIn } = useAuth();
// //   const router = useRouter();
// //   const [form, setForm] = useState({
// //     nombre: '',
// //     apellido: '',
// //     dni: '',
// //     cuil: '',
// //     telefono: '',
// //     direccion: '',
// //     genero: 'PrefieroNoDecir',
// //   });

// //   useEffect(() => {
// //     if (!isLoggedIn) router.push('/login');
// //     if (user?.emprendedorId) router.push('/dashboard'); // ya tiene perfil
// //   }, [isLoggedIn]);

// //   async function handleSubmit(e) {
// //     e.preventDefault();
// //     const token = localStorage.getItem('token');

// //     const res = await fetch('/api/emprendedores', {
// //       method: 'POST',
// //       headers: {
// //         'Content-Type': 'application/json',
// //         Authorization: `Bearer ${token}`
// //       },
// //       body: JSON.stringify(form)
// //     });

// //     if (res.ok) {
// //       router.push('/dashboard');
// //     } else {
// //       alert('Error al guardar perfil');
// //     }
// //   }

// //   return (
// //     <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4 p-4">
// //       <h2 className="text-xl font-bold">Completar perfil de emprendedor</h2>

// //       <input
// //         type="text"
// //         placeholder="Nombre"
// //         className="w-full p-2 border rounded"
// //         value={form.nombre}
// //         onChange={(e) => setForm({ ...form, nombre: e.target.value })}
// //         required
// //       />
// //       <input
// //         type="text"
// //         placeholder="Apellido"
// //         className="w-full p-2 border rounded"
// //         value={form.apellido}
// //         onChange={(e) => setForm({ ...form, apellido: e.target.value })}
// //         required
// //       />
// //       <input
// //         type="text"
// //         placeholder="DNI"
// //         className="w-full p-2 border rounded"
// //         value={form.dni}
// //         onChange={(e) => setForm({ ...form, dni: e.target.value })}
// //         required
// //       />
// //       <input
// //         type="text"
// //         placeholder="CUIL"
// //         className="w-full p-2 border rounded"
// //         value={form.cuil}
// //         onChange={(e) => setForm({ ...form, cuil: e.target.value })}
// //         required
// //       />
// //       <input
// //         type="text"
// //         placeholder="Teléfono"
// //         className="w-full p-2 border rounded"
// //         value={form.telefono}
// //         onChange={(e) => setForm({ ...form, telefono: e.target.value })}
// //         required
// //       />
// //       <input
// //         type="text"
// //         placeholder="Dirección"
// //         className="w-full p-2 border rounded"
// //         value={form.direccion}
// //         onChange={(e) => setForm({ ...form, direccion: e.target.value })}
// //         required
// //       />

// //       <select
// //         className="w-full p-2 border rounded"
// //         value={form.genero}
// //         onChange={(e) => setForm({ ...form, genero: e.target.value })}
// //       >
// //         <option value="Masculino">Masculino</option>
// //         <option value="Femenino">Femenino</option>
// //         <option value="PrefieroNoDecir">Prefiero no decir</option>
// //       </select>

// //       <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
// //         Guardar perfil
// //       </button>
// //     </form>
// //   );
// // }
