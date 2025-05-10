import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    // Devuelve una lista de ganadores de ejemplo
    res.status(200).json([
      { id: 1, name: 'Juan Pérez', prize: 'TV 50"', claimed: false },
      { id: 2, name: 'Ana López', prize: 'iPhone 14', claimed: true }
    ]);
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
} 