import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    // Devuelve una configuración de ejemplo
    res.status(200).json({
      logoUrl: "/logo.png",
      title: "RifasOnline",
      subtitle: "¡Participa y gana!",
      // ...otros campos que tu frontend espera
    });
  } else if (req.method === 'PUT') {
    // Aquí podrías guardar la configuración si tienes una base de datos
    res.status(200).json({ message: "Configuración actualizada (mock)" });
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
} 