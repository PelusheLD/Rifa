import { storage } from '../../../server/storage.js';
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
  if (req.method !== 'PATCH') {
    res.setHeader('Allow', ['PATCH']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  if (!authenticateJWT(req)) return res.status(401).json({ message: "Token inválido o expirado" });
  try {
    const updatedWinner = await storage.updateWinner(id, true);
    if (!updatedWinner) return res.status(404).json({ message: 'Ganador no encontrado' });
    res.json(updatedWinner);
  } catch {
    res.status(500).json({ message: 'Error al marcar como reclamado' });
  }
} 