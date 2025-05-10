import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    // Lógica para obtener una rifa por ID
    res.status(200).json({ message: `Rifa con ID: ${id}` });
  } else if (req.method === 'PUT') {
    // Lógica para actualizar una rifa por ID
    res.status(200).json({ message: `Rifa con ID: ${id} actualizada` });
  } else if (req.method === 'DELETE') {
    // Lógica para eliminar una rifa por ID
    res.status(200).json({ message: `Rifa con ID: ${id} eliminada` });
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
} 