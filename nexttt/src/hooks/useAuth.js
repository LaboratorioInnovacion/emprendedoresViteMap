'use client';
import { useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';

export function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const decoded = jwt_decode(token);
      setUser(decoded);
    } catch (e) {
      console.error('Token inválido');
      localStorage.removeItem('token');
    }
  }, []);

  return {
    user,
    isLoggedIn: !!user,
    logout: () => {
      localStorage.removeItem('token');
      setUser(null);
      window.location.href = '/login';
    }
  };
}

// 'use client';
// import { useEffect, useState } from 'react';
// import jwt_decode from 'jwt-decode';

// export function useAuth() {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token) return;

//     try {
//       const decoded = jwt_decode(token);
//       setUser(decoded);
//     } catch (e) {
//       console.error('Token inválido');
//       localStorage.removeItem('token');
//     }
//   }, []);

//   return {
//     user,
//     isLoggedIn: !!user,
//     logout: () => {
//       localStorage.removeItem('token');
//       setUser(null);
//       window.location.href = '/login';
//     }
//   };
// }
