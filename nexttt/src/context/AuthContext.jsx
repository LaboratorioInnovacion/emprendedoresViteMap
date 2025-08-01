'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const decoded = jwt_decode(token);
      setUser(decoded);
    } catch {
      localStorage.removeItem('token');
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  const refreshUser = () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const decoded = jwtDecode(token);
      setUser(decoded);
    } catch {
      logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isAdmin: user?.rol === 'ADMIN',
        isSuper: user?.rol === 'SUPERUSUARIO',
        isEmprendedor: user?.rol === 'EMPRENDEDOR',
        logout,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

// export function useAuth() {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token) return;
//     try {
//       const decoded = jwt_decode(token);
//       setUser(decoded);
//     } catch {
//       localStorage.removeItem('token');
//     }
//   }, []);

//   return {
//     user,
//     isLoggedIn: !!user,
//     isEmprendedor: user?.rol === 'EMPRENDEDOR',
//     isAdmin: user?.rol === 'ADMIN',
//     isSuper: user?.rol === 'SUPERUSUARIO',
//     logout: () => {
//       localStorage.removeItem('token');
//       setUser(null);
//       window.location.href = '/login';
//     }
//   };
// }
