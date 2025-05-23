// app/api/business-data/route.js
/**
 * Obtiene los datos de los emprendimientos desde Google Sheets y geocodifica la dirección.
 * Devuelve un array de objetos con los datos listos para usar en el frontend.
 */
export async function fetchBusinessData() {
  const sheetId = "16Isxw0BG0sU_zqxBV7Tfq1XC2sp_ttwGb7AfWt7j5V0";
  const apiKeySheets = "AIzaSyAyitOMgYMCoRiUU8KltHqaY3tzECyOYTQ";
  const openCageKey = "94054c296cab467981eb945db56677b5";
  //   const range = "Form_Responses1!A2:I"; // A2 para evitar encabezados
  const range = "A1:D10";

  //   const sheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKeySheets}`;
  const sheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKeySheets}`;

  try {
    const res = await fetch(sheetUrl);
    console.log("sheetUrl", sheetUrl);
    console.log("res", res);
    if (!res.ok) throw new Error("Error al obtener los datos de Google Sheets");

    const sheetData = await res.json();
    const rows = sheetData.values || [];

    const result = [];

    for (const row of rows) {
      const [
        marcaTemporal,
        nombreApellido,
        dni,
        email,
        direccionCalleNumero,
        nombreEmprendimiento,
        direccionEmprendimiento,
        rubro,
        descripcion,
      ] = row;

      // Geocodificar dirección del emprendimiento
      let coords = { lat: null, lng: null };
      if (direccionEmprendimiento) {
        try {
          const geoRes = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
              direccionEmprendimiento
            )}&key=${openCageKey}&language=es&countrycode=ar`
          );
          const geoData = await geoRes.json();
          coords = geoData.results?.[0]?.geometry || coords;
        } catch (geoError) {
          // Si falla la geocodificación, deja coords en null
        }
      }

      result.push({
        nombreApellido: nombreApellido || "",
        dni: dni || "",
        email: email || "",
        direccionCalleNumero: direccionCalleNumero || "",
        nombreEmprendimiento: nombreEmprendimiento || "",
        direccionEmprendimiento: direccionEmprendimiento || "",
        rubro: rubro || "",
        descripcion: descripcion || "",
        coordenadas: [coords.lat, coords.lng],
      });
    }

    return result;
  } catch (error) {
    console.error("Error en fetchBusinessData:", error);
    throw error;
  }
}

// // app/api/business-data/route.js
// export async function GET() {
//   const sheetId = "16Isxw0BG0sU_zqxBV7Tfq1XC2sp_ttwGb7AfWt7j5V0";
//   const apiKeySheets = "AIzaSyAyitOMgYMCoRiUU8KltHqaY3tzECyOYTQ";
//   const openCageKey = "94054c296cab467981eb945db56677b5";
//   const range = "Form_Responses1!A2:I"; // A2 para evitar encabezados

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
//         descripcion
//       ] = row;

//       // Geocodificar dirección del emprendimiento
//       const geoRes = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(direccionEmprendimiento)}&key=${openCageKey}&language=es&countrycode=ar`);
//       const geoData = await geoRes.json();

//       const coords = geoData.results?.[0]?.geometry || { lat: null, lng: null };

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

//     return new Response(JSON.stringify(result), {
//       status: 200,
//       headers: { "Content-Type": "application/json" },
//     });

//   } catch (error) {
//     console.error("Error en API:", error);
//     return new Response(JSON.stringify({ error: error.message }), {
//       status: 500,
//     });
//   }
// }
