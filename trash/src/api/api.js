import { createClient } from '@libsql/client';

// Configuración de Google Sheets
const sheetId = "16Isxw0BG0sU_zqxBV7Tfq1XC2sp_ttwGb7AfWt7j5V0";
const apiKeySheets = "AIzaSyAyitOMgYMCoRiUU8KltHqaY3tzECyOYTQ";
const range = "A2:W";

// Configurar cliente Turso
const tursoClient = createClient({
  url: "libsql://emprede-vercel-icfg-3bomaiqwfyx1akiq6p7hpzd3.aws-us-east-1.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NTEyOTU5NzcsImlkIjoiNmEyYzAzM2YtMmY4ZS00NWM1LWJkZWItYmFjNDc0ZjE0NWE2IiwicmlkIjoiMzQ4YTE4ZWItYTJiNS00NGYzLWI5MGMtNDRhMmY1MzI2MWYyIn0.mS4ciEL6btBCBycHFTxsXeeeQY5mxOg1cd6EDl7Jbroy4pPtgS9-b4BpOn415P30FliJGPSjsix811bcyvpIBw"
});

// Inicializar la tabla si no existe
(async () => {
  await tursoClient.execute(`CREATE TABLE IF NOT EXISTS locations (
    address TEXT PRIMARY KEY,
    lat REAL,
    lng REAL
  )`);
})();

// Inicializar tabla para cachear Google Sheets
(async () => {
  await tursoClient.execute(`CREATE TABLE IF NOT EXISTS sheets_cache (
    id INTEGER PRIMARY KEY,
    data TEXT,
    updated_at INTEGER
  )`);
})();

// Funciones para cache
const getCoordinatesFromDB = async (address) => {
  const result = await tursoClient.execute('SELECT lat, lng FROM locations WHERE address = ?', [address]);
  return result.rows[0] || null;
};

const saveCoordinatesToDB = async (address, lat, lng) => {
  await tursoClient.execute('INSERT OR REPLACE INTO locations (address, lat, lng) VALUES (?, ?, ?)', [address, lat, lng]);
};

// Funciones para cache de Sheets
const getSheetsCache = async () => {
  const result = await tursoClient.execute('SELECT data, updated_at FROM sheets_cache WHERE id = 1');
  if (result.rows.length > 0) {
    return {
      data: JSON.parse(result.rows[0].data),
      updated_at: result.rows[0].updated_at
    };
  }
  return null;
};

const saveSheetsCache = async (data) => {
  await tursoClient.execute(
    'INSERT OR REPLACE INTO sheets_cache (id, data, updated_at) VALUES (1, ?, ?)', [JSON.stringify(data), Date.now()]
  );
};

// Claves de OpenCage para fallback
const openCageKeys = [
  "94054c296cab467981eb945db56677b5",
  "5eb16af3ff1e4f4b98cebec9e882397b",
  "f23fc56e95044c16babf28abad06ca2c"
];

// Delay helper
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Geocodificación con cache y fallback de keys
const geocodeAddress = async (address) => {
  // 1. Buscar en cache
  const cached = await getCoordinatesFromDB(address);
  if (cached && cached.lat && cached.lng) {
    return { lat: cached.lat, lng: cached.lng };
  }
  // 2. Si no existe, usar la API y guardar en cache
  const fullAddress = `${address}, Catamarca, Argentina`;
  const encodedAddress = encodeURIComponent(fullAddress);
  for (let i = 0; i < openCageKeys.length; i++) {
    const currentKey = openCageKeys[i];
    try {
      const geoRes = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodedAddress}&key=${currentKey}&language=es&countrycode=ar`
      );
      if (!geoRes.ok) {
        if (geoRes.status === 429) await delay(2000);
        throw new Error(`HTTP ${geoRes.status}: ${geoRes.statusText}`);
      }
      const geoData = await geoRes.json();
      if (geoData.results && geoData.results.length > 0) {
        const { lat, lng } = geoData.results[0].geometry;
        await saveCoordinatesToDB(address, lat, lng);
        return { lat, lng };
      } else {
        throw new Error('No se encontraron resultados de geocodificación');
      }
    } catch (error) {
      if (i < openCageKeys.length - 1) {
        await delay(1000);
        continue;
      } else {
        throw new Error(`No se pudo geocodificar después de ${openCageKeys.length} intentos`);
      }
    }
  }
};

// Fetch de datos de negocio
export async function fetchBusinessData() {
  // 1. Intentar obtener del cache
  const cache = await getSheetsCache();
  const CACHE_TTL = 1000 * 60 * 30; // 30 minutos
  let rows;
  if (cache && Date.now() - cache.updated_at < CACHE_TTL) {
    // Usar cache
    rows = cache.data;
    console.log('✅ Usando datos cacheados de Google Sheets');
  } else {
    // Consultar Google Sheets y actualizar cache
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKeySheets}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Error al obtener datos del sheet");
    const data = await res.json();
    rows = data.values || [];
    await saveSheetsCache(rows);
    console.log('🔄 Datos de Google Sheets actualizados y cacheados');
  }

  // Procesar los datos de rows y devolver negocios
  const businesses = await Promise.all(
    rows.map(async (row, index) => {
      const [
        marcaTemporal,               // A
        nombreApellido,              // B
        dni,                         // C
        telefonoPersonal,            // D
        email,                       // E
        direccionParticular,        // F
        nombreEmprendimiento,        // G
        telefonoEmprendimiento,      // H
        direccionEmprendimiento,     // I
        rubro,                       // J
        descripcion,                 // K
        tiempoInicio,                // L
        formaVenta,                  // M
        plataformasOnline,           // N
        redesSociales,               // O
        redesUtilizadas,            // P
        desafioPrincipal,           // Q
        tipoApoyo,                  // R
        personasEmprendimiento,     // S
        tieneLocal,                 // T
        estaRegistrado,             // U
        participoPrograma,          // V
        puntuacion                  // W (PUNTUACIÓN)
      ] = row;

      let location = { lat: -27.0, lng: -65.0 }; // Coordenadas por defecto
      if (direccionEmprendimiento) {
        try {
          const geocodedLocation = await geocodeAddress(direccionEmprendimiento);
          if (geocodedLocation) {
            location = geocodedLocation;
          }
        } catch (error) {
          console.warn(`⚠️ No se pudo geocodificar: ${direccionEmprendimiento}`, error.message);
        }
      }

      return {
        id: (index + 1).toString(),
        name: nombreEmprendimiento || "",
        description: descripcion || "",
        type: rubro || "otro",
        score: parseFloat(puntuacion) || "No Hay Puntuación",
        address: direccionEmprendimiento || "",
        location: {
          lat: location.lat,
          lng: location.lng,
        },
        contact: {
          phone: telefonoEmprendimiento || "",
          email: email || "",
          website: "", // Puedes incluir si agregas una columna
        },
        status: "active",
        imageUrl: "", // Puedes incluir si agregas una columna
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    })
  );

  return businesses;
}



//CODIGOANTEIORIOR SIN DB 
// API para obtener datos de Google Sheets y geolocalización

// export async function fetchBusinessData() {
//   // const sheetId = "1kfvYYJuZpwsy8oFvBWy4GL4QbwV6J00cLaE-XYY_8F4"; // excel
//   // const apiKeySheets = "AlzaSyDv-DGehKKs1SrdpzrGFUpv1jAdSQMY7TQ"; //excel
//   const sheetId = "16Isxw0BG0sU_zqxBV7Tfq1XC2sp_ttwGb7AfWt7j5V0"; //prueba
//   const apiKeySheets = "AIzaSyAyitOMgYMCoRiUU8KltHqaY3tzECyOYTQ"; //prueba

//   const range = "A2:W"; // Ampliado para cubrir todas las columnas
//       const openCageKey = "94054c296cab467981eb945db56677b5";
//       // const openCageKey = "5eb16af3ff1e4f4b98cebec9e882397b";
//   // const openCageKey = "f23fc56e95044c16babf28abad06ca2c";
//   const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKeySheets}`;
//   try {
//     const res = await fetch(url);
//     if (!res.ok) throw new Error("Error al obtener datos del sheet");
//     const data = await res.json();
//     const rows = data.values || [];

//     const businesses = await Promise.all(
//       rows.map(async (row, index) => {
//         const [
//           marcaTemporal,               // A
//           nombreApellido,              // B
//           dni,                         // C
//           telefonoPersonal,            // D
//           email,                       // E
//           direccionParticular,        // F
//           nombreEmprendimiento,        // G
//           telefonoEmprendimiento,      // H
//           direccionEmprendimiento,     // I
//           rubro,                       // J
//           descripcion,                 // K
//           tiempoInicio,                // L
//           formaVenta,                  // M
//           plataformasOnline,           // N
//           redesSociales,               // O
//           redesUtilizadas,            // P
//           desafioPrincipal,           // Q
//           tipoApoyo,                  // R
//           personasEmprendimiento,     // S
//           tieneLocal,                 // T
//           estaRegistrado,             // U
//           participoPrograma,          // V
//           puntuacion                  // W (PUNTUACIÓN)
//         ] = row;

//         let location = { lat: -27.0, lng: -65.0 }; // Coordenadas por defecto
//         if (direccionEmprendimiento) {
//           try {
//             const encodedAddress = encodeURIComponent(`${direccionEmprendimiento}, Catamarca, Argentina`);
//             const geoRes = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodedAddress}&key=${openCageKey}&language=es&countrycode=ar`);
//             const geoData = await geoRes.json();
//             const geo = geoData.results?.[0]?.geometry;
//             if (geo) {
//               location = geo;
//             }
//           } catch (e) {
//             console.warn("No se pudo geocodificar:", direccionEmprendimiento);
//           }
//         }

//         return {
//           id: (index + 1).toString(),
//           name: nombreEmprendimiento || "",
//           description: descripcion || "",
//           type: rubro || "otro",
//           score: parseFloat(puntuacion) || "No Hay Puntuación",
//           address: direccionEmprendimiento || "",
//           location: {
//             lat: location.lat,
//             lng: location.lng,
//           },
//           contact: {
//             phone: telefonoEmprendimiento || "",
//             email: email || "",
//             website: "", // Puedes incluir si agregas una columna
//           },
//           status: "active",
//           imageUrl: "", // Puedes incluir si agregas una columna
//           createdAt: new Date().toISOString(),
//           updatedAt: new Date().toISOString(),
//         };
//       })
//     );

//     return businesses;
//   } catch (error) {
//     console.error("Error al obtener negocios:", error);
//     return [];
//   }
// }