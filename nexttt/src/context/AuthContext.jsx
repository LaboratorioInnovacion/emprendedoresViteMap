"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const AuthContext = createContext({
  isAuthenticated: false,
  role: null,
  user: null,
  status: "loading",
});

export function AuthProvider({ children }) {
  const { data: session, status } = useSession();
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (session?.user) {
      setRole(session.user.rol); // Asegurate que el rol esté en session.user
      console.log(session.user)
    }
  }, [session]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: status === "authenticated",
        role,
        user: session?.user || null,
        status,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

// 'use client';
// import { createContext, useContext } from 'react';
// import { useSession, signOut } from 'next-auth/react';


// const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const { data: session, status } = useSession();
//   const user = session?.user;

//     const isLoading = status === 'loading';

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         isLoggedIn: status === 'authenticated',
//         isAdmin: user?.rol === 'ADMIN',
//         isSuper: user?.rol === 'SUPERUSUARIO',
//         isEmprendedor: user?.rol === 'EMPRENDEDOR',
//         logout: () => signOut({ callbackUrl: '/auth/login' }),
//         isLoading,
//         refreshUser: () => {}, // (opcional, lo podemos implementar luego)
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   return useContext(AuthContext);
// }

// 'use client';
// import { createContext, useContext } from 'react';
// import { useSession, signOut } from 'next-auth/react';

// const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const { data: session, status } = useSession();
//   const user = session?.user;

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         isLoggedIn: status === 'authenticated',
//         isAdmin: user?.rol === 'ADMIN',
//         isSuper: user?.rol === 'SUPERUSUARIO',
//         isEmprendedor: user?.rol === 'EMPRENDEDOR',
//         logout: () => signOut({ callbackUrl: '/auth/login' }),
//         refreshUser: () => {}, // NextAuth actualiza automáticamente la sesión
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   return useContext(AuthContext);
// }
