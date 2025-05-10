import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    // Lógica para obtener participantes
    res.status(200).json({ message: 'Lista de participantes' });
  } else if (req.method === 'POST') {
    // Lógica para crear un participante
    res.status(201).json({ message: 'Participante creado' });
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
} 