import { storage } from '../../server/storage.js';
import { adminLoginSchema } from '../../shared/schema';
import jwt from 'jsonwebtoken';
import { NowRequest, NowResponse } from '@vercel/node';

const JWT_SECRET = process.env.JWT_SECRET || "rifas_online_secret_jwt";

export default async function handler(req: NowRequest, res: NowResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  try {
    const validatedData = adminLoginSchema.parse(req.body);
    const admin = await storage.getAdminByUsername(validatedData.username);
    if (!admin) return res.status(401).json({ message: "Credenciales incorrectas" });

    const isPasswordValid = await storage.validatePassword(validatedData.password, admin.password);
    if (!isPasswordValid) return res.status(401).json({ message: "Credenciales incorrectas" });

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.json({
      message: "Autenticación exitosa",
      user: { id: admin.id, username: admin.username, name: admin.name },
      token
    });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
} 