import { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

function toCamelCaseRaffle(rifa: any) {
  return {
    id: rifa.id,
    title: rifa.title,
    description: rifa.description,
    price: rifa.price,
    totalTickets: rifa.total_tickets,
    soldTickets: rifa.sold_tickets,
    imageUrl: rifa.image_url,
    prizeId: rifa.prize_id,
    endDate: rifa.end_date,
    status: rifa.status,
    createdAt: rifa.created_at,
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET') {
      const page = parseInt((req.query.page as string) || '1', 10);
      const limit = parseInt((req.query.limit as string) || '10', 10);
      const offset = (page - 1) * limit;

      const rifas = await sql`
        SELECT * FROM raffles
        ORDER BY id DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      const [{ count }] = await sql`SELECT COUNT(*)::int FROM raffles`;

      res.status(200).json({
        data: rifas.map(toCamelCaseRaffle),
        pagination: {
          total: count,
          page,
          limit,
          totalPages: Math.ceil(count / limit)
        }
      });
    } else if (req.method === 'POST') {
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
      res.status(201).json(toCamelCaseRaffle(nuevaRifa));
    } else {
      res.status(405).json({ error: 'Método no permitido' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Error desconocido' });
  }
} 