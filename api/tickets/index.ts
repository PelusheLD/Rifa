import { storage } from '../../server/storage';
import { NowRequest, NowResponse } from '@vercel/node';

export default async function handler(req: NowRequest, res: NowResponse) {
  if (req.method === 'GET') {
    try {
      const allTickets = await storage.getAllTickets();
      res.json(allTickets);
    } catch {
      res.status(500).json({ message: 'Error al obtener tickets' });
    }
  } else if (req.method === 'POST') {
    try {
      const ticket = await storage.createTicket(req.body);
      res.status(201).json(ticket);
    } catch {
      res.status(500).json({ message: 'Error al crear ticket' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 