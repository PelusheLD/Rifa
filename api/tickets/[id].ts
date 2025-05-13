import { storage } from '../../server/storage.js';
import jwt from 'jsonwebtoken';
import { NowRequest, NowResponse } from '@vercel/node';

const JWT_SECRET = process.env.JWT_SECRET || "rifas_online_secret_jwt";

function authenticateJWT(req: NowRequest) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return false;
  const token = authHeader.split(' ')[1];
  try {
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export default async function handler(req: NowRequest, res: NowResponse) {
  const id = parseInt(req.query.id as string);
  if (req.method === 'GET') {
    try {
      const ticket = await storage.getTicket(id);
      if (!ticket) return res.status(404).json({ message: 'Ticket no encontrado' });
      res.json(ticket);
    } catch {
      res.status(500).json({ message: 'Error al obtener ticket' });
    }
  } else if (req.method === 'DELETE') {
    if (!authenticateJWT(req)) return res.status(401).json({ message: "Token inválido o expirado" });
    try {
      const success = await storage.deleteTicket(id);
      if (!success) return res.status(404).json({ message: 'Ticket no encontrado' });
      res.json({ message: 'Ticket liberado correctamente' });
    } catch {
      res.status(500).json({ message: 'Error al liberar ticket' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 