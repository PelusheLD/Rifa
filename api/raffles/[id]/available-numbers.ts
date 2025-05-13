import { storage } from '../../../server/storage.js';
import { NowRequest, NowResponse } from '@vercel/node';

export default async function handler(req: NowRequest, res: NowResponse) {
  const id = parseInt(req.query.id as string);
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  try {
    const raffle = await storage.getRaffle(id);
    if (!raffle) return res.status(404).json({ message: 'Rifa no encontrada' });
    const availableNumbers = await storage.getAvailableTickets(id);
    res.json({ availableNumbers });
  } catch {
    res.status(500).json({ message: 'Error al obtener números disponibles' });
  }
} 