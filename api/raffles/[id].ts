import { storage } from '../../server/storage.js';
import { insertRaffleSchema } from '../../shared/schema.js';
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
      const raffle = await storage.getRaffle(id);
      if (!raffle) return res.status(404).json({ message: "Rifa no encontrada" });
      res.json(raffle);
    } catch {
      res.status(500).json({ message: "Error al obtener la rifa" });
    }
  } else if (req.method === 'PUT') {
    if (!authenticateJWT(req)) return res.status(401).json({ message: "Token inválido o expirado" });
    try {
      const validatedData = insertRaffleSchema.partial().parse(req.body);
      const raffle = await storage.updateRaffle(id, validatedData);
      if (!raffle) return res.status(404).json({ message: "Rifa no encontrada" });
      res.json(raffle);
    } catch {
      res.status(500).json({ message: "Error al actualizar la rifa" });
    }
  } else if (req.method === 'DELETE') {
    if (!authenticateJWT(req)) return res.status(401).json({ message: "Token inválido o expirado" });
    try {
      const deleted = await storage.deleteRaffle(id);
      if (!deleted) return res.status(404).json({ message: "Rifa no encontrada" });
      res.json({ message: "Rifa eliminada correctamente" });
    } catch {
      res.status(500).json({ message: "Error al eliminar la rifa" });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 