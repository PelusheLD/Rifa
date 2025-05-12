import { storage } from '../../../server/storage';

export default async function handler(req, res) {
  const raffleId = parseInt(req.query.raffleId as string);
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  try {
    const raffle = await storage.getRaffle(raffleId);
    if (!raffle) return res.status(404).json({ message: 'Rifa no encontrada' });
    const tickets = await storage.getTicketsForRaffle(raffleId);
    res.json(tickets);
  } catch {
    res.status(500).json({ message: 'Error al obtener tickets de la rifa' });
  }
} 