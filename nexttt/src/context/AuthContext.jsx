'use client';
import { createContext, useContext } from 'react';
import { useSession, signOut } from 'next-auth/react';


const AuthContext = createContext();

export function AuthProvider({ children }) {
  const { data: session, status } = useSession();
  const user = session?.user;

    const isLoading = status === 'loading';

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: status === 'authenticated',
        isAdmin: user?.rol === 'ADMIN',
        isSuper: user?.rol === 'SUPERUSUARIO',
        isEmprendedor: user?.rol === 'EMPRENDEDOR',
        logout: () => signOut({ callbackUrl: '/auth/login' }),
        isLoading,
        refreshUser: () => {}, // (opcional, lo podemos implementar luego)
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
