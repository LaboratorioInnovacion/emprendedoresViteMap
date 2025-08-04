"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error === "CredentialsSignin") {
      setError("Email o contraseña incorrectos");
    } else {
      router.push("/"); // redirigí a donde quieras
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: "2rem" }}>
      <h2>Iniciar sesión</h2>
      <div style={{ marginBottom: "1rem" }}>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ width: "100%", padding: "0.5rem" }}
        />
      </div>
      <div style={{ marginBottom: "1rem" }}>
        <label>Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ width: "100%", padding: "0.5rem" }}
        />
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button onClick={handleLogin} style={{ padding: "0.5rem 1rem" }}>
        Entrar
      </button>
    </div>
  );
}


// // componente login para Next.js con autenticación
// 'use client';
// import { useState } from 'react';
// import { redirect, useRouter } from 'next/navigation';
// import { signIn } from 'next-auth/react';


// export default function LoginForm() {
//   const [form, setForm] = useState({ email: '', password: '' });
//   const [error, setError] = useState('');
//   const router = useRouter();

//   async function handleSubmit(e) {



//     e.preventDefault();
//     setError('');

//         signIn('credentials', {
//       email: form.email,
//       password: form.password,
//       redirect: false,

//       })
//       if (error) {
//         setError('Credenciales incorrectas');
//         console.error('Error de autenticación:', error);
//         return;
//       }

//     // const res = await fetch('/api/auth/login', {
//     const res = await fetch('/api/auth/sigin', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(form),
//     });

//     const data = await res.json();

//     if (!res.ok) {
//       setError(data.error || 'Error desconocido');
//       return;
//     }

//     localStorage.setItem('token', data.token);
//     router.push('/'); // Redirigir al panel privado
//   }

//   return (
//     <form onSubmit={handleSubmit} className="max-w-sm mx-auto space-y-4 p-4 border rounded">
//       <h2 className="text-xl font-semibold">Iniciar sesión</h2>

//       <input
//         type="email"
//         placeholder="Email"
//         className="w-full p-2 border rounded"
//         value={form.email}
//         onChange={(e) => setForm({ ...form, email: e.target.value })}
//         required
//       />
//       <input
//         type="password"
//         placeholder="Contraseña"
//         className="w-full p-2 border rounded"
//         value={form.password}
//         onChange={(e) => setForm({ ...form, password: e.target.value })}
//         required
//       />

//       <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">
//         Ingresar
//       </button>

//       {error && <p className="text-red-600 text-sm">{error}</p>}
//     </form>
//   );

// }