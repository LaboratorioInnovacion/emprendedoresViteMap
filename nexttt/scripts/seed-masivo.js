// Script para carga masiva de usuarios, emprendedores, emprendimientos y herramientas
// Ejecuta: node scripts/seed-masivo.js

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const BASE_URL = 'http://localhost:3000/api';

// Datos de ejemplo para carga masiva
// Generador de nombres y apellidos aleatorios
const nombres = ['Ana', 'Luis', 'Sofía', 'Carlos', 'Valeria', 'Pedro', 'Lucía', 'Marcos', 'Julieta', 'Mateo', 'Camila', 'Joaquín', 'Martina', 'Agustín', 'Paula', 'Tomás', 'Mía', 'Juan', 'Florencia', 'Emilia'];
const apellidos = ['García', 'Martínez', 'López', 'Pérez', 'Ruiz', 'Fernández', 'Gómez', 'Díaz', 'Sosa', 'Romero', 'Álvarez', 'Torres', 'Ramírez', 'Flores', 'Acosta', 'Benítez', 'Medina', 'Herrera', 'Aguirre', 'Castro'];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generarUsuarios(cantidad) {
  const usados = new Set();
  const lista = [];
  for (let i = 0; i < cantidad; i++) {
    let nombre, apellido, email;
    do {
      nombre = getRandomItem(nombres);
      apellido = getRandomItem(apellidos);
      email = `${nombre.toLowerCase()}.${apellido.toLowerCase()}${Math.floor(Math.random()*10000)}@mail.com`;
    } while (usados.has(email));
    usados.add(email);
    lista.push({
      email,
      password: '123456',
      nombre,
      apellido
    });
  }
  return lista;
}

const usuarios = generarUsuarios(20);

// Guardar usuarios generados en un archivo JSON para pruebas manuales
const fs = require('fs');
function guardarUsuariosParaPruebas(usuarios) {
  const simple = usuarios.map(u => ({ email: u.email, password: u.password, nombre: u.nombre, apellido: u.apellido }));
  fs.writeFileSync(__dirname + '/usuarios-seed.json', JSON.stringify(simple, null, 2), 'utf-8');
}

async function crearUsuario(email, password) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error HTTP ${res.status} (usuario): ${text}`);
  }
  return res.json();
}

async function crearEmprendedor(usuarioId, nombre, apellido) {
  // Esta función ya no se usará para crear, sino para actualizar el emprendedor existente
  // Se usará un PUT a /api/emprendedores/{id}
  // usuarioId aquí es el id del emprendedor
  // Datos dinámicos
  const generos = ['Masculino', 'Femenino', 'PrefieroNoDecir'];
  const estudios = ['SinEscolarizar','PrimarioIncompleto','PrimarioCompleto','SecundarioIncompleto','SecundarioCompleto','TerciarioUniversitarioIncompleto','TerciarioUniversitarioCompleto','Posgrado'];
  const motivaciones = ['Pasion','Independencia','Oportunidad','NecesidadEconomica','Otro'];
  const paises = ['Argentina','Chile','Uruguay','Paraguay','Bolivia'];
  const ciudades = ['Catamarca','Buenos Aires','Córdoba','Rosario','Mendoza','Salta','Tucumán','La Plata','Mar del Plata','San Juan'];
  const tiposSustento = ['Trabajo','Jubilación','Otro','Subsidio','Renta'];

  const res = await fetch(`${BASE_URL}/emprendedores/${usuarioId}`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      nombre,
      apellido,
      dni: Math.floor(Math.random()*90000000+10000000).toString(),
      cuil: '20-' + Math.floor(Math.random()*90000000+10000000) + '-9',
      fechaNacimiento: `19${Math.floor(Math.random()*30+70)}-${String(Math.floor(Math.random()*12+1)).padStart(2,'0')}-${String(Math.floor(Math.random()*28+1)).padStart(2,'0')}`,
      direccion: `Calle ${apellido} ${Math.floor(Math.random()*1000)}`,
      departamento: `Departamento ${Math.floor(Math.random()*20)}`,
      telefono: `+54 9 383 ${Math.floor(Math.random()*1000000)}`,
      genero: getRandomItem(generos),
      nivelEstudios: getRandomItem(estudios),
      motivacionEmprender: getRandomItem(motivaciones),
      tiposSustento: Array.from({length: Math.floor(Math.random()*3+1)},()=>getRandomItem(tiposSustento)),
      poseeOtrosSustentos: Math.random()>0.5,
      tieneDependientesEconomicos: Math.random()>0.5,
      // Ubicación aleatoria cerca de San Fernando del Valle de Catamarca (~2km radio)
      ubicacion: {
        lat: -28.4696 + (Math.random() - 0.5) * 0.02,
        lng: -65.7852 + (Math.random() - 0.5) * 0.02
      },
      cantidadEmprendimientos: Math.floor(Math.random()*5),
      fotoDni: '',
      paisOrigen: getRandomItem(paises),
      ciudadOrigen: getRandomItem(ciudades),
    })
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error HTTP ${res.status} (emprendedor): ${text}`);
  }
  return res.json();
}

async function crearEmprendimiento(emprendedorId, nombre) {
  // Valores exactos de enums según schema.prisma
  const etapas = ['Idea','EnMarcha','Consolidado'];
  const sectores = ['ProduccionElaboracion','Comercio','Servicios'];
  // ActividadSectorial: solo algunos ejemplos válidos
  const actividades = [
    'Produccion_Alimentos_Artesanal','Produccion_Alimentos_Industrial','Produccion_Articulos_Hogar','Produccion_Indumentaria','Produccion_Quimicos_Hogar','Produccion_Belleza','Produccion_Grafica','Produccion_Vivero','Produccion_Otro',
    'Comercio_Indumentaria','Comercio_Alimentos','Comercio_Articulos_Hogar','Comercio_Libreria','Comercio_Informatica','Comercio_Belleza','Comercio_Mascotas','Comercio_Regional','Comercio_Construccion','Comercio_Vivero','Comercio_Otro',
    'Servicio_Profesionales','Servicio_Salud','Servicio_Educativos','Servicio_Turisticos','Servicio_Reparacion_Electro','Servicio_Reparacion_Vehiculos','Servicio_Construccion','Servicio_Gastronomicos','Servicio_Otro'
  ];
  const tiposEmp = ['Individual','Asociativo','Familiar','Cooperativo'];
  // PlaneaIncorporar y PercepcionPlanta enums
  const planeaIncorporar = ['Si','No','NoLoSabe'];
  const percepcionPlanta = ['Adecuada','Mayor','Menor','NoLoSabe'];

  // Otros campos libres
  const modosPersonal = ['Contratado','Familiar','Socio','Voluntario'];
  const tiposCap = ['Finanzas','Marketing','Producción','Legal','RRHH'];
  const tiposCons = ['Legal','Contable','Comercial','Tecnológica'];
  const tiposHerr = ['Software','Maquinaria','Herramientas','Infraestructura'];
  const tiposRedes = ['Facebook','Instagram','Twitter','LinkedIn','TikTok'];
  const canales = ['Online','Presencial','Mayorista','Minorista','Exportación'];

  const res = await fetch(`${BASE_URL}/emprendimientos`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      denominacion: `Emprendimiento de ${nombre} ${Math.floor(Math.random()*10000)}`,
      emprendedorId,
      fechaInicio: `20${Math.floor(Math.random()*25+0)}-${String(Math.floor(Math.random()*12+1)).padStart(2,'0')}-${String(Math.floor(Math.random()*28+1)).padStart(2,'0')}`,
      etapa: getRandomItem(etapas),
      inscripcionArca: Math.random() > 0.5,
      cuit: '30-' + Math.floor(Math.random()*90000000+10000000) + '-9',
      sector: getRandomItem(sectores),
      actividadPrincipal: getRandomItem(actividades),
      tipoEmprendimiento: getRandomItem(tiposEmp),
      direccion: `Calle Emprendimiento ${Math.floor(Math.random()*1000)}`,
    //   ubicacion: { lat: -28.6037 + Math.random()*2, lng: -65.3816 + Math.random()*2 },
      // Ubicación aleatoria cerca de San Fernando del Valle de Catamarca (~2km radio)
      ubicacion: {
        lat: -28.4696 + (Math.random() - 0.5) * 0.02,
        lng: -65.7852 + (Math.random() - 0.5) * 0.02
      },
      telefono: `+54 9 383 ${Math.floor(Math.random()*1000000)}`,
      email: `${nombre.toLowerCase()}${Math.floor(Math.random()*10000)}@emprende.com`,
      web: `https://emprende.com/${nombre.toLowerCase()}${Math.floor(Math.random()*10000)}`,
      redSocial1: `https://facebook.com/${nombre.toLowerCase()}${Math.floor(Math.random()*10000)}`,
      redSocial2: `https://instagram.com/${nombre.toLowerCase()}${Math.floor(Math.random()*10000)}`,
      tienePersonal: Math.random() > 0.5,
      cantidadPersonal: Math.floor(Math.random()*20),
      modoIncorporacionPersonal: Array.from({length: Math.floor(Math.random()*2+1)},()=>getRandomItem(modosPersonal)),
      planeaIncorporarPersonal: getRandomItem(planeaIncorporar),
      percepcionPlantaPersonal: getRandomItem(percepcionPlanta),
      requiereCapacitacion: Math.random() > 0.5,
      tiposCapacitacion: Array.from({length: Math.floor(Math.random()*2+1)},()=>getRandomItem(tiposCap)),
      otrosTiposCapacitacion: '',
      requiereConsultoria: Math.random() > 0.5,
      tiposConsultoria: Array.from({length: Math.floor(Math.random()*2+1)},()=>getRandomItem(tiposCons)),
      otrosTiposConsultoria: '',
      requiereHerramientasTecno: Math.random() > 0.5,
      tiposHerramientasTecno: Array.from({length: Math.floor(Math.random()*2+1)},()=>getRandomItem(tiposHerr)),
      otrasHerramientasTecno: '',
      usaRedesSociales: Math.random() > 0.5,
      tiposRedesSociales: Array.from({length: Math.floor(Math.random()*3+1)},()=>getRandomItem(tiposRedes)),
      usaMediosPagoElectronicos: Math.random() > 0.5,
      canalesComercializacion: Array.from({length: Math.floor(Math.random()*2+1)},()=>getRandomItem(canales)),
      otrosCanalesComercializacion: '',
      poseeSucursales: Math.random() > 0.5,
      cantidadSucursales: Math.floor(Math.random()*5),
      ubicacionSucursales: [],
      planeaAbrirSucursal: Math.random() > 0.5,
    })
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error HTTP ${res.status} (emprendimiento): ${text}`);
  }
  return res.json();
}

async function crearHerramienta(nombre) {

  // Enums y arrays válidos según schema.prisma
  const tipoBeneficiario = ['Emprendedor', 'Emprendimiento'];
  // Arrays de ejemplo (siempre al menos 1 valor)
  const tiposHerramienta = ['Financiera', 'Capacitación', 'Tecnológica', 'Infraestructura'];
  const origenes = ['Nacional', 'Provincial', 'Municipal', 'Privado'];

  // Helper para asegurar array no vacío
  function arrayNoVacio(arr) {
    const n = Math.floor(Math.random()*2)+1; // 1 o 2 elementos
    const res = [];
    while (res.length < n) {
      const val = getRandomItem(arr);
      if (!res.includes(val)) res.push(val);
    }
    return res;
  }

  const body = {
    nombre: `Herramienta para ${nombre}`,
    origenTipo: arrayNoVacio(origenes),
    origenOrganismo: 'Organismo ' + Math.floor(Math.random()*100),
    tipoBeneficiario: getRandomItem(tipoBeneficiario),
    tipoHerramientaEmprendimiento: arrayNoVacio(tiposHerramienta),
    tipoHerramientaEmprendedor: arrayNoVacio(tiposHerramienta),
    montoTotal: Math.floor(Math.random()*100000+10000),
    montoPorBeneficiario: Math.floor(Math.random()*10000+1000),
    poseeVencimiento: Math.random() > 0.5,
    fechaInicioVigencia: new Date().toISOString(),
    fechaFinVigencia: new Date(Date.now() + Math.floor(Math.random()*1000000000)).toISOString(),
    cupo: Math.floor(Math.random()*100+1),
    observaciones: 'Observaciones de ejemplo',
    descripcion: `Herramienta creada para ${nombre}`
  };

  const res = await fetch(`${BASE_URL}/herramienta`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error HTTP ${res.status} (herramienta): ${text}`);
  }
  return res.json();
}

async function main() {
  for (const u of usuarios) {
    try {
      console.log(`Creando usuario: ${u.email}`);
      const usuario = await crearUsuario(u.email, u.password);
      // Usar el emprendedorId devuelto por el endpoint de registro
      const emprendedorId = usuario.usuario?.emprendedorId;
      if (!emprendedorId) {
        console.error('No se obtuvo emprendedorId para', u.email, usuario);
        continue;
      }

      // Actualizar todos los campos del emprendedor (menos emprendedorId)
      const emprendedor = await crearEmprendedor(emprendedorId, u.nombre, u.apellido);

      // Crear emprendimiento con todos los campos
      const emprendimiento = await crearEmprendimiento(emprendedorId, u.nombre);

  // Ya no se crea herramienta
  console.log('✔️ Carga exitosa:', { usuario: u.email, emprendedorId, emprendimiento: emprendimiento.id });
    } catch (err) {
      console.error('❌ Error en usuario', u.email, err.message);
    }
  }
  // Guardar usuarios para pruebas manuales
  guardarUsuariosParaPruebas(usuarios);
}

main();
