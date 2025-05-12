import jwt from 'jsonwebtoken';
import { NowRequest, NowResponse } from '@vercel/node';

const JWT_SECRET = process.env.JWT_SECRET || "rifas_online_secret_jwt";

export default function handler(req: NowRequest, res: NowResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No hay token proporcionado" });
  const token = authHeader.split(' ')[1];
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Token inválido o expirado" });
    res.json({ valid: true, user: decoded });
  });
} 