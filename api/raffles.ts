import { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET') {
      // Listar rifas
      const rifas = await sql`SELECT * FROM raffles ORDER BY id DESC`;
      res.status(200).json(rifas);
    } else if (req.method === 'POST') {
      // Crear rifa
      const {
        title,
        description,
        price,
        totalTickets,
        imageUrl,
        status,
        prizeId,
        endDate
      } = req.body;

      const [nuevaRifa] = await sql`
        INSERT INTO raffles (title, description, price, total_tickets, image_url, status, prize_id, end_date)
        VALUES (${title}, ${description}, ${price}, ${totalTickets}, ${imageUrl}, ${status}, ${prizeId}, ${endDate})
        RETURNING *
      `;
      res.status(201).json(nuevaRifa);
    } else {
      res.status(405).json({ error: 'Método no permitido' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Error desconocido' });
  }
} 