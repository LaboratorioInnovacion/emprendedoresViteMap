// API de prueba para Next.js App Router (handler para GET y POST)

export async function GET(request) {
  return new Response(JSON.stringify({ message: '¡Hola desde la API de Next.js!' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(request) {
  const data = await request.json();
  return new Response(JSON.stringify({ received: data, message: 'POST recibido correctamente' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
