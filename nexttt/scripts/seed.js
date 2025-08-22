// Script para carga masiva de usuarios, emprendedores, emprendimientos y herramientas
// Ejecuta: node scripts/seed.js

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Cambia la URL base si tu API corre en otro puerto o dominio
const BASE_URL = 'http://localhost:3000/api';

async function crearUsuario(email, password) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ email, password })
  });
  return res.json();
}

async function crearEmprendedor(usuarioId) {
  const res = await fetch(`${BASE_URL}/emprendedores`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      nombre: 'Juan',
      apellido: 'Pérez',
      dni: '12345678',
      cuil: '20-12345678-9',
      fechaNacimiento: '1990-01-01',
      usuarioId
    })
  });
  return res.json();
}

async function crearEmprendimiento(emprendedorId) {
  const res = await fetch(`${BASE_URL}/emprendimientos`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      denominacion: 'Mi Emprendimiento',
      emprendedorId,
      fechaInicio: '2023-01-01'
    })
  });
  return res.json();
}

async function crearHerramienta() {
  const res = await fetch(`${BASE_URL}/herramienta`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      nombre: 'Herramienta X',
      descripcion: 'Descripción de la herramienta'
    })
  });
  return res.json();
}

async function main() {
  // Puedes poner un bucle aquí para crear varios usuarios/contenido
  const usuario = await crearUsuario('test1@mail.com', '123456');
  if (usuario.error) return console.error(usuario);

  const emprendedor = await crearEmprendedor(usuario.usuario?.id || usuario.usuarioId);
  if (emprendedor.error) return console.error(emprendedor);

  const emprendimiento = await crearEmprendimiento(emprendedor.id);
  if (emprendimiento.error) return console.error(emprendimiento);

  const herramienta = await crearHerramienta();
  if (herramienta.error) return console.error(herramienta);

  console.log('Carga masiva exitosa:', { usuario, emprendedor, emprendimiento, herramienta });
}

main();
