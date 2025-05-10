import { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;

  try {
    if (req.method === 'GET') {
      // Obtener rifa por ID
      const [rifa] = await sql`SELECT * FROM raffles WHERE id = ${id}`;
      if (!rifa) return res.status(404).json({ message: 'Rifa no encontrada' });
      res.status(200).json(rifa);
    } else if (req.method === 'PUT') {
      // Actualizar rifa
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
      const [actualizada] = await sql`
        UPDATE raffles SET
          title = ${title},
          description = ${description},
          price = ${price},
          total_tickets = ${totalTickets},
          image_url = ${imageUrl},
          status = ${status},
          prize_id = ${prizeId},
          end_date = ${endDate}
        WHERE id = ${id}
        RETURNING *
      `;
      res.status(200).json(actualizada);
    } else if (req.method === 'DELETE') {
      // Eliminar rifa
      await sql`DELETE FROM raffles WHERE id = ${id}`;
      res.status(200).json({ message: 'Rifa eliminada' });
    } else {
      res.status(405).json({ error: 'Método no permitido' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Error desconocido' });
  }
} 