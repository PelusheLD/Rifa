import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    // Simula autenticación exitosa
    const { username, password } = req.body;
    if (username === 'admin' && password === 'admin123') {
      res.status(200).json({
        message: 'Autenticación exitosa',
        user: { id: 1, username: 'admin', name: 'Administrador' },
        token: 'mock-token-admin'
      });
    } else {
      res.status(401).json({ message: 'Credenciales incorrectas' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
} 