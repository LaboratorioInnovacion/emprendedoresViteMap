// Componente register
'use client';
import { useState } from 'react';

export default function RegisterForm() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Error desconocido');
    } else {
      setSuccess(true);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto space-y-4 p-4 border rounded">
      <h2 className="text-xl font-semibold">Registro</h2>

      <input
        type="email"
        placeholder="Email"
        className="w-full p-2 border rounded"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        className="w-full p-2 border rounded"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        required
      />

      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        Crear cuenta
      </button>

      {success && <p className="text-green-600 text-sm">Registro exitoso 🎉</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </form>
  );
}
