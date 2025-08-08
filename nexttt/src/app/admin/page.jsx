'use client';
import { Geist, Geist_Mono } from "next/font/google";
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const mockUsers = [
  {
    id: 1,
    name: "Juan Pérez",
    email: "juan@instituto.edu",
    role: "Personal",
    active: true,
    lastAccess: "2025-08-07 14:32",
    activity: ["Login", "Modificó datos", "Logout"],
  },
  {
    id: 2,
    name: "Ana Gómez",
    email: "ana@instituto.edu",
    role: "Administrador",
    active: false,
    lastAccess: "2025-08-06 09:15",
    activity: ["Login", "Restableció contraseña"],
  },
];

const roles = ["Personal", "Administrador"];

const Admin = () => {
  const { isAuthenticated, role, status, user } = useAuth();
  // Para cerrar sesión
  const handleLogout = async () => {
    if (typeof window !== "undefined") {
      const { signOut } = await import("next-auth/react");
      signOut({ callbackUrl: "/auth/login" });
    }
  };
  const [users, setUsers] = useState(mockUsers);
  const [showHistory, setShowHistory] = useState(null);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "Personal" });

  // Si está cargando la sesión
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-96">
        <span className="text-lg text-gray-500 dark:text-gray-300">Cargando...</span>
      </div>
    );
  }

  // Si no está autenticado o no es ADMIN
  if (!isAuthenticated || role !== "ADMIN") {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Acceso denegado</h2>
        <p className="text-gray-700 dark:text-gray-300">No tienes permisos para acceder a esta sección.</p>
      </div>
    );
  }

  // ...existing code...
  const handleCreateUser = (e) => {
    e.preventDefault();
    setUsers([
      ...users,
      {
        id: users.length + 1,
        ...newUser,
        active: true,
        lastAccess: "-",
        activity: [],
      },
    ]);
    setNewUser({ name: "", email: "", role: "Personal" });
  };

  const handleRoleChange = (id, role) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, role } : u)));
  };

  const handleToggleActive = (id) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, active: !u.active } : u)));
  };

  const handleResetPassword = (id) => {
    alert("Contraseña restablecida para el usuario ID " + id);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Administración de Personal</h1>
        <div className="flex items-center gap-4">
          {user && (
            <span className="text-base text-gray-700 dark:text-gray-200 font-medium">
              <span className="font-semibold">{user.name || user.email}</span>
              {user.rol && (
                <span className="ml-2 px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs">{user.rol}</span>
              )}
            </span>
          )}
          <button
            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Crear usuario */}
      <section className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Crear nuevo usuario</h2>
        <form className="flex flex-col md:flex-row gap-4" onSubmit={handleCreateUser}>
          <input
            type="text"
            placeholder="Nombre completo"
            className="border rounded px-3 py-2 flex-1"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Correo institucional"
            className="border rounded px-3 py-2 flex-1"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            required
          />
          <select
            className="border rounded px-3 py-2"
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          >
            {roles.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Crear</button>
        </form>
      </section>

      {/* Tabla de usuarios */}
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Usuarios registrados</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="p-2 text-left">Nombre</th>
                <th className="p-2 text-left">Correo</th>
                <th className="p-2 text-left">Rol</th>
                <th className="p-2 text-left">Activo</th>
                <th className="p-2 text-left">Último acceso</th>
                <th className="p-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="p-2">{user.name}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      {roles.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-2">
                    <button
                      className={`px-3 py-1 rounded ${user.active ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
                      onClick={() => handleToggleActive(user.id)}
                    >
                      {user.active ? "Activo" : "Inactivo"}
                    </button>
                  </td>
                  <td className="p-2">{user.lastAccess}</td>
                  <td className="p-2 flex gap-2">
                    <button
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                      onClick={() => handleResetPassword(user.id)}
                    >
                      Restablecer contraseña
                    </button>
                    <button
                      className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                      onClick={() => setShowHistory(user.id)}
                    >
                      Ver historial
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modal historial de actividad */}
      {showHistory !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Historial de actividad</h3>
            <ul className="mb-4">
              {users.find((u) => u.id === showHistory)?.activity.length ? (
                users
                  .find((u) => u.id === showHistory)
                  .activity.map((act, i) => (
                    <li key={i} className="border-b py-2">{act}</li>
                  ))
              ) : (
                <li className="text-gray-500">Sin actividad registrada</li>
              )}
            </ul>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
              onClick={() => setShowHistory(null)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;