'use client';
import { useSession } from "next-auth/react";

export default function Perfil() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Cargando...</p>;
  if (!session) return <p>No estás logueado</p>;

  return (
    <div>
      <h2>Perfil de usuario</h2>
      <p>Email: {session.user.email}</p>
      <p>ID: {session.user.id}</p>
      <p>Rol: {session.user.rol}</p> {/* Asegurate de tener esto */}
    </div>
  );
}



// 'use client';
// import { useAuth } from "../../context/AuthContext";
// export default function Dashboard() {
//   const { isAuthenticated, role, user, status } = useAuth();

//   if (status === "loading") return <p>Cargando...</p>;
//   if (!isAuthenticated) return <p>No estás logueado</p>;

//   return (
//     <div>
//       <h2>Hola {user.name}</h2>
//       <h2>{user.role}</h2>
//       {role === "ADMIN" && <p>Bienvenido al panel de administración</p>}
//       {role === "EMPRENDEDOR" && <p>Panel exclusivo para emprendedores</p>}
//       {role === "SUPERUSUARIO" && <p>Panel exclusivo para superusuario</p>}
//     </div>
//   );
// }
