import { google } from 'googleapis';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function getDriveService() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/drive.file'],
  });
  return google.drive({ version: 'v3', auth });
}

export async function POST(req) {
  const form = new formidable.IncomingForm();
  return new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        resolve(new Response(JSON.stringify({ error: 'Error al procesar el archivo' }), { status: 500 }));
        return;
      }
      const file = files.file;
      if (!file) {
        resolve(new Response(JSON.stringify({ error: 'No se envió archivo' }), { status: 400 }));
        return;
      }
      try {
        const drive = await getDriveService();
        const fileMetadata = {
          name: file.originalFilename,
        };
        const media = {
          mimeType: file.mimetype,
          body: fs.createReadStream(file.filepath),
        };
        const response = await drive.files.create({
          resource: fileMetadata,
          media,
          fields: 'id,webViewLink',
        });
        resolve(new Response(JSON.stringify({ id: response.data.id, link: response.data.webViewLink }), { status: 200 }));
      } catch (e) {
        resolve(new Response(JSON.stringify({ error: 'Error al subir a Google Drive', details: e.message }), { status: 500 }));
      }
    });
  });
}



export async function GET() {
  try {
    const drive = await getDriveService();
    // Probar acceso listando los primeros archivos
    await drive.files.list({ pageSize: 1 });
    return new Response(JSON.stringify({ ok: true, message: 'Credenciales válidas para Google Drive.' }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: 'Credenciales inválidas o error de conexión.', details: e.message }), { status: 401 });
  }
}

// GOOGLE_SERVICE_ACCOUNT_EMAIL
// GOOGLE_PRIVATE_KEY
// La API recibe un archivo (campo file) por POST y lo sube a tu Google Drive.
