import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    // Lógica para obtener rifas
    res.status(200).json({ message: 'Lista de rifas' });
  } else if (req.method === 'POST') {
    // Lógica para crear una rifa
    res.status(201).json({ message: 'Rifa creada' });
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
} 