import { storage } from '../../server/storage';
import { insertRaffleSchema } from '../../shared/schema';
import jwt from 'jsonwebtoken';
import { NowRequest, NowResponse } from '@vercel/node';

const JWT_SECRET = process.env.JWT_SECRET || "rifas_online_secret_jwt";

function authenticateJWT(req: NowRequest, res: NowResponse) {
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
  if (req.method === 'GET') {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filter = req.query.filter as string;
      const raffles = await storage.getRaffles(page, limit, filter);
      const total = await storage.getTotalRaffles(filter);
      res.json({
        data: raffles,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Error al obtener las rifas" });
    }
  } else if (req.method === 'POST') {
    if (!authenticateJWT(req, res)) return res.status(401).json({ message: "Token inválido o expirado" });
    try {
      const validatedData = insertRaffleSchema.parse(req.body);
      const raffle = await storage.createRaffle(validatedData);
      res.status(201).json(raffle);
    } catch (error) {
      res.status(500).json({ message: "Error al crear la rifa" });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 