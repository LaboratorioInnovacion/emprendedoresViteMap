export async function fetchBusinessData() {
  // const sheetId = "1kfvYYJuZpwsy8oFvBWy4GL4QbwV6J00cLaE-XYY_8F4"; // excel
  // const apiKeySheets = "AlzaSyDv-DGehKKs1SrdpzrGFUpv1jAdSQMY7TQ"; //excel
  const sheetId = "16Isxw0BG0sU_zqxBV7Tfq1XC2sp_ttwGb7AfWt7j5V0"; //prueba
  const apiKeySheets = "AIzaSyAyitOMgYMCoRiUU8KltHqaY3tzECyOYTQ"; //prueba

  const range = "A2:W"; // Ampliado para cubrir todas las columnas
  const openCageKey = "94054c296cab467981eb945db56677b5";
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKeySheets}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Error al obtener datos del sheet");
    const data = await res.json();
    const rows = data.values || [];

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
            const encodedAddress = encodeURIComponent(`${direccionEmprendimiento}, Catamarca, Argentina`);
            const geoRes = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodedAddress}&key=${openCageKey}&language=es&countrycode=ar`);
            const geoData = await geoRes.json();
            const geo = geoData.results?.[0]?.geometry;
            if (geo) location = geo;
          } catch (e) {
            console.warn("No se pudo geocodificar:", direccionEmprendimiento);
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
  } catch (error) {
    console.error("Error al obtener negocios:", error);
    return [];
  }
}

// export async function fetchBusinessData() {
//   const sheetId = "16Isxw0BG0sU_zqxBV7Tfq1XC2sp_ttwGb7AfWt7j5V0";
//   const range = "A2:I";
//   const apiKeySheets = "AIzaSyAyitOMgYMCoRiUU8KltHqaY3tzECyOYTQ";
//   const openCageKey = "94054c296cab467981eb945db56677b5";

//   const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKeySheets}`;

//   try {
//     const res = await fetch(url);
//     if (!res.ok) throw new Error("Error al obtener datos del sheet");
//     const data = await res.json();
//     const rows = data.values || [];

//     const businesses = await Promise.all(
//       rows.map(async (row, index) => {
//         const [
//           marcaTemporal,
//           nombreApellido,
//           dni,
//           email,
//           direccionParticular,
//           nombreEmprendimiento,
//           direccionEmprendimiento,
//           rubro,
//           descripcion,
//         ] = row;

//         let location = { lat: -27.0, lng: -65.0 }; // Coordenadas por defecto
//         if (direccionEmprendimiento) {
//           try {
//             const encodedAddress = encodeURIComponent(`${direccionEmprendimiento}, Catamarca, Argentina`);
//             const geoRes = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodedAddress}&key=${openCageKey}&language=es&countrycode=ar`);
//             const geoData = await geoRes.json();
//             const geo = geoData.results?.[0]?.geometry;
//             if (geo) location = geo;
//           } catch (e) {
//             console.warn("No se pudo geocodificar:", direccionEmprendimiento);
//           }
//         }

//         return {
//           id: (index + 1).toString(),
//           name: nombreEmprendimiento || "",
//           description: descripcion || "",
//           type: rubro || "other",
//           address: direccionEmprendimiento || "",
//           location: {
//             lat: location.lat,
//             lng: location.lng,
//           },
//           contact: {
//             phone: "", // Puedes completarlo si agregás esa columna
//             email: email || "",
//             website: "", // Puedes completarlo si agregás esa columna
//           },
//           status: "active", // Podrías ponerlo como "pending" si lo preferís
//           imageUrl: "", // Podés mapear imágenes si están en la planilla
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

// export async function fetchBusinessData() {
//   const sheetId = "16Isxw0BG0sU_zqxBV7Tfq1XC2sp_ttwGb7AfWt7j5V0";
//   const apiKeySheets = "AIzaSyAyitOMgYMCoRiUU8KltHqaY3tzECyOYTQ";
//   const openCageKey = "94054c296cab467981eb945db56677b5";
//   const range = "A2:I10";

//   const sheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKeySheets}`;

//   try {
//     const res = await fetch(sheetUrl);
//     if (!res.ok) throw new Error("Error al obtener los datos de Google Sheets");

//     const sheetData = await res.json();
//     const rows = sheetData.values || [];

//     const businesses = [];

//     for (const [index, row] of rows.entries()) {
//       const [
//         marcaTemporal,
//         nombreApellido,
//         dni,
//         email,
//         direccionCalleNumero,
//         nombreEmprendimiento,
//         direccionEmprendimiento,
//         rubro,
//         descripcion,
//       ] = row;

//       // Geocodificar dirección del emprendimiento
//       let location = { lat: null, lng: null };
//       if (direccionEmprendimiento) {
//         try {
//           const fullAddress = `${direccionEmprendimiento}, Catamarca, Argentina`;
//           const encodedAddress = encodeURIComponent(fullAddress);
//           const geoRes = await fetch(
//             `https://api.opencagedata.com/geocode/v1/json?q=${encodedAddress}&key=${openCageKey}&language=es&countrycode=ar`
//           );
//           const geoData = await geoRes.json();
//           location = geoData.results?.[0]?.geometry || location;
//         } catch (geoError) {
//           console.error("Error en la geocodificación:", geoError);
//         }
//       }

//       businesses.push({
//         id: (index + 1).toString(),
//         name: nombreEmprendimiento || "",
//         description: descripcion || "",
//         type: rubro || "other",
//         address: direccionEmprendimiento || "",
//         location: {
//           lat: location.lat,
//           lng: location.lng,
//         },
//         contact: {
//           phone: "", // Agrega el teléfono si está disponible en tus datos
//           email: email || "",
//           website: "", // Agrega el sitio web si está disponible en tus datos
//         },
//         status: "active", // Ajusta el estado según tus criterios
//         imageUrl: "", // Agrega la URL de la imagen si está disponible
//         createdAt: new Date().toISOString(), // O ajusta según tus datos
//         updatedAt: new Date().toISOString(), // O ajusta según tus datos
//       });
//     }

//     return businesses;
//   } catch (error) {
//     console.error("Error en fetchBusinessData:", error);
//     throw error;
//   }
// }

// // app/api/business-data/route.js
// /**
//  * Obtiene los datos de los emprendimientos desde Google Sheets y geocodifica la dirección.
//  * Devuelve un array de objetos con los datos listos para usar en el frontend.
//  */
// export async function fetchBusinessData() {
//     const sheetId = "16Isxw0BG0sU_zqxBV7Tfq1XC2sp_ttwGb7AfWt7j5V0";
// //   const sheetId = "1VceFvaX1G-ldwcr5f8Wa7_0IvnxALBTZDR-za0gN5PE";
//   const apiKeySheets = "AIzaSyAyitOMgYMCoRiUU8KltHqaY3tzECyOYTQ";
// //   const apiKeySheetsEmprenedeores = "AlzaSyAoxJ7TVA2PQTV1SaBW44-uMRxsf7zmqUA";
//   const openCageKey = "94054c296cab467981eb945db56677b5";
// //   const range = "Form_Responses1!A2:I"; // A2 para evitar encabezados
//     const range = "A2:I10";

//   //   const sheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKeySheets}`;
//   const sheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKeySheets}`;

//   try {
//     const res = await fetch(sheetUrl);
//     if (!res.ok) throw new Error("Error al obtener los datos de Google Sheets");

//     const sheetData = await res.json();
//     const rows = sheetData.values || [];

//     const result = [];

//     for (const row of rows) {
//       const [
//         marcaTemporal,
//         nombreApellido,
//         dni,
//         email,
//         direccionCalleNumero,
//         nombreEmprendimiento,
//         direccionEmprendimiento,
//         rubro,
//         descripcion,
//       ] = row;

//       // Geocodificar dirección del emprendimiento
//       let coords = { lat: null, lng: null };
//       if (direccionEmprendimiento) {
//         try {
//           // Agregar localidad y país a la dirección
//           const fullAddress = `${direccionEmprendimiento} Catamarca, Argentina`;
//           const encodedAddress = encodeURIComponent(fullAddress);
//           const geoRes = await fetch(
//             `https://api.opencagedata.com/geocode/v1/json?q=${encodedAddress}&key=${openCageKey}&language=es&countrycode=ar`
//           );
//           const geoData = await geoRes.json();
//           coords = geoData.results?.[0]?.geometry || coords;
//         } catch (geoError) {
//           // Si falla la geocodificación, deja coords en null
//         }
//       }

//       result.push({
//         nombreApellido: nombreApellido || "",
//         dni: dni || "",
//         email: email || "",
//         direccionCalleNumero: direccionCalleNumero || "",
//         nombreEmprendimiento: nombreEmprendimiento || "",
//         direccionEmprendimiento: direccionEmprendimiento || "",
//         rubro: rubro || "",
//         descripcion: descripcion || "",
//         coordenadas: [coords.lat, coords.lng],
//       });
//     }

//     return result;
//   } catch (error) {
//     console.error("Error en fetchBusinessData:", error);
//     throw error;
//   }
// }
