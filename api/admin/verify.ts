import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Simula verificación de token
  const auth = req.headers.authorization;
  if (auth === 'Bearer mock-token-admin') {
    res.status(200).json({ valid: true, user: { id: 1, username: 'admin', name: 'Administrador' } });
  } else {
    res.status(401).json({ valid: false, message: 'Token inválido o expirado' });
  }
} 