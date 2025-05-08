import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import session from "express-session";
import MemoryStore from "memorystore";
import jwt from "jsonwebtoken";
import { adminLoginSchema, insertRaffleSchema } from "@shared/schema";
import { z } from "zod";

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || "rifas_online_secret_jwt";

// Middleware para verificar autenticación
const authenticateJWT = (req: Request, res: Response, next: Function) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Token inválido o expirado" });
      }

      (req as any).user = decoded;
      next();
    });
  } else {
    res.status(401).json({ message: "No hay token proporcionado" });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Configurar session store
  const MemorySessionStore = MemoryStore(session);
  
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "rifas_online_secret_session",
      resave: false,
      saveUninitialized: false,
      cookie: { secure: process.env.NODE_ENV === "production", maxAge: 24 * 60 * 60 * 1000 }, // 1 day
      store: new MemorySessionStore({
        checkPeriod: 86400000 // 24 hours
      })
    })
  );

  // Ruta de autenticación de administrador
  app.post("/api/admin/login", async (req, res) => {
    try {
      const validatedData = adminLoginSchema.parse(req.body);
      
      const admin = await storage.getAdminByUsername(validatedData.username);
      
      if (!admin) {
        return res.status(401).json({ message: "Credenciales incorrectas" });
      }
      
      const isPasswordValid = await storage.validatePassword(
        validatedData.password,
        admin.password
      );
      
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Credenciales incorrectas" });
      }
      
      // Generar token JWT
      const token = jwt.sign(
        { id: admin.id, username: admin.username },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      res.json({
        message: "Autenticación exitosa",
        user: {
          id: admin.id,
          username: admin.username,
          name: admin.name
        },
        token
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Datos de entrada inválidos", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Error en el servidor" });
    }
  });

  // Verificar token
  app.get("/api/admin/verify", authenticateJWT, (req, res) => {
    res.json({ valid: true, user: (req as any).user });
  });

  // Rutas para rifas - CRUD
  app.get("/api/raffles", async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filter = req.query.filter as string;
      
      console.log("Intentando obtener rifas con:", { page, limit, filter });
      
      const raffles = await storage.getRaffles(page, limit, filter);
      const total = await storage.getTotalRaffles(filter);
      
      console.log("Rifas obtenidas:", { count: raffles.length, total });
      
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
      console.error("Error al obtener rifas:", error);
      res.status(500).json({ message: "Error al obtener las rifas" });
    }
  });

  app.get("/api/raffles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const raffle = await storage.getRaffle(id);
      
      if (!raffle) {
        return res.status(404).json({ message: "Rifa no encontrada" });
      }
      
      res.json(raffle);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener la rifa" });
    }
  });

  app.post("/api/raffles", authenticateJWT, async (req, res) => {
    try {
      const validatedData = insertRaffleSchema.parse(req.body);
      const raffle = await storage.createRaffle(validatedData);
      
      res.status(201).json(raffle);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Datos de entrada inválidos", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Error al crear la rifa" });
    }
  });

  app.put("/api/raffles/:id", authenticateJWT, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertRaffleSchema.partial().parse(req.body);
      
      const raffle = await storage.updateRaffle(id, validatedData);
      
      if (!raffle) {
        return res.status(404).json({ message: "Rifa no encontrada" });
      }
      
      res.json(raffle);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Datos de entrada inválidos", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Error al actualizar la rifa" });
    }
  });

  app.delete("/api/raffles/:id", authenticateJWT, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteRaffle(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Rifa no encontrada" });
      }
      
      res.json({ message: "Rifa eliminada correctamente" });
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar la rifa" });
    }
  });

  // Crear administrador (solo para setup inicial)
  app.post("/api/admin/setup", async (req, res) => {
    try {
      // Verificar si ya existe un administrador
      const existingAdmins = await storage.getRaffles(1, 1);
      if (existingAdmins.length > 0) {
        return res.status(400).json({ message: "Ya existe un administrador configurado" });
      }
      
      const admin = await storage.createAdmin({
        username: "admin",
        password: "admin123",
        name: "Administrador"
      });
      
      res.status(201).json({
        message: "Administrador creado correctamente",
        admin: {
          id: admin.id,
          username: admin.username,
          name: admin.name
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Error al configurar el administrador" });
    }
  });

  // API TICKETS
  
  // Obtener todos los tickets
  app.get('/api/tickets', async (req: Request, res: Response) => {
    try {
      // Obtener todos los tickets desde el storage
      const allTickets = await storage.getAllTickets();
      res.json(allTickets);
    } catch (error) {
      console.error('Error al obtener todos los tickets:', error);
      res.status(500).json({ message: 'Error al obtener tickets' });
    }
  });
  
  // Liberar (eliminar) un ticket
  app.delete('/api/tickets/:id', authenticateJWT, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteTicket(id);
      
      if (!success) {
        return res.status(404).json({ message: 'Ticket no encontrado' });
      }
      
      res.json({ message: 'Ticket liberado correctamente' });
    } catch (error) {
      console.error('Error al liberar ticket:', error);
      res.status(500).json({ message: 'Error al liberar ticket' });
    }
  });
  
  // Actualizar estado de pago de un ticket
  app.patch('/api/tickets/:id/payment-status', authenticateJWT, async (req: Request, res: Response) => {
    try {
      console.log("Recibida solicitud PATCH para actualizar estado de pago");
      const id = parseInt(req.params.id);
      console.log("ID del ticket:", id);
      console.log("Cuerpo de la solicitud:", req.body);
      
      const { paymentStatus } = req.body;
      
      // Mapear 'apartado' a 'pendiente' para ser compatible con el enum en la base de datos
      const dbPaymentStatus = paymentStatus === 'apartado' ? 'pendiente' : paymentStatus;
      
      if (!dbPaymentStatus || !['pendiente', 'pagado', 'cancelado'].includes(dbPaymentStatus)) {
        console.log("Estado de pago inválido:", dbPaymentStatus);
        return res.status(400).json({ message: 'Estado de pago inválido' });
      }
      
      // Verificar si el ticket existe
      const ticketExists = await storage.getTicket(id);
      if (!ticketExists) {
        console.log(`Ticket con ID ${id} no existe en la base de datos`);
        return res.status(404).json({ message: 'Ticket no encontrado' });
      }
      
      console.log(`Actualizando ticket ${id} a estado ${dbPaymentStatus}`);
      const updatedTicket = await storage.updateTicketPaymentStatus(id, dbPaymentStatus);
      
      if (!updatedTicket) {
        console.log(`Error al actualizar ticket ${id}. No se pudo completar la operación.`);
        return res.status(404).json({ message: 'Ticket no encontrado' });
      }
      
      console.log("Ticket actualizado correctamente:", updatedTicket);
      res.json(updatedTicket);
    } catch (error) {
      console.error('Error al actualizar estado de pago:', error);
      res.status(500).json({ message: 'Error al actualizar estado de pago' });
    }
  });

  // Obtener un ticket específico
  app.get('/api/tickets/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const ticket = await storage.getTicket(id);
      
      if (!ticket) {
        return res.status(404).json({ message: 'Ticket no encontrado' });
      }
      
      res.json(ticket);
    } catch (error) {
      console.error('Error al obtener ticket:', error);
      res.status(500).json({ message: 'Error al obtener ticket' });
    }
  });
  
  // Crear un nuevo ticket (reserva)
  app.post('/api/tickets', async (req: Request, res: Response) => {
    try {
      const { raffleId, number, cedula, name, email, phone, paymentStatus } = req.body;
      
      // Validación básica
      if (!raffleId || !number || !cedula || !name || !email || !phone) {
        return res.status(400).json({ message: 'Faltan campos requeridos' });
      }
      
      // Verificar que la rifa existe
      const raffle = await storage.getRaffle(raffleId);
      if (!raffle) {
        return res.status(404).json({ message: 'Rifa no encontrada' });
      }
      
      // Verificar que el número está disponible (no ha sido reservado ya)
      const existingTickets = await storage.getTicketsByNumber(raffleId, [number]);
      if (existingTickets.length > 0) {
        return res.status(409).json({ message: 'Este número ya ha sido reservado por otra persona' });
      }
      
      // Mapear 'apartado' a 'pendiente' para el enum PostgreSQL
      const dbPaymentStatus = paymentStatus === 'apartado' ? 'pendiente' : 
                               paymentStatus || 'pendiente'; // Si no se proporciona, usar 'pendiente'
      
      // Validar que el estado sea válido para el enum
      if (!['pendiente', 'pagado', 'cancelado'].includes(dbPaymentStatus)) {
        return res.status(400).json({ message: 'Estado de pago inválido' });
      }
      
      // Crear el nuevo ticket
      const newTicket = await storage.createTicket({
        raffleId,
        number,
        cedula,
        name,
        email,
        phone,
        paymentStatus: dbPaymentStatus as any // Forzar el tipo para evitar errores
      });
      
      res.status(201).json(newTicket);
    } catch (error) {
      console.error('Error al crear ticket:', error);
      res.status(500).json({ message: 'Error al crear ticket' });
    }
  });
  
  // Obtener todos los tickets de una rifa
  app.get('/api/raffles/:raffleId/tickets', async (req: Request, res: Response) => {
    try {
      const raffleId = parseInt(req.params.raffleId);
      
      // Verificar que la rifa existe
      const raffle = await storage.getRaffle(raffleId);
      if (!raffle) {
        return res.status(404).json({ message: 'Rifa no encontrada' });
      }
      
      const tickets = await storage.getTicketsForRaffle(raffleId);
      res.json(tickets);
    } catch (error) {
      console.error('Error al obtener tickets de la rifa:', error);
      res.status(500).json({ message: 'Error al obtener tickets' });
    }
  });
  
  // Obtener números disponibles de una rifa
  app.get('/api/raffles/:raffleId/available-numbers', async (req: Request, res: Response) => {
    try {
      const raffleId = parseInt(req.params.raffleId);
      
      // Verificar que la rifa existe
      const raffle = await storage.getRaffle(raffleId);
      if (!raffle) {
        return res.status(404).json({ message: 'Rifa no encontrada' });
      }
      
      const availableNumbers = await storage.getAvailableTickets(raffleId);
      res.json({ availableNumbers });
    } catch (error) {
      console.error('Error al obtener números disponibles:', error);
      res.status(500).json({ message: 'Error al obtener números disponibles' });
    }
  });
  
  // Obtener todos los ganadores
  app.get('/api/winners', async (req: Request, res: Response) => {
    try {
      const winners = await storage.getWinners();
      res.json(winners);
    } catch (error) {
      console.error('Error al obtener ganadores:', error);
      res.status(500).json({ message: 'Error al obtener ganadores' });
    }
  });

  // Registrar un nuevo ganador
  app.post('/api/winners', authenticateJWT, async (req: Request, res: Response) => {
    try {
      console.log('Intentando crear un ganador con datos:', req.body);
      const { raffleId, winnerName, ticketNumber, prize } = req.body;
      
      if (!raffleId || !winnerName || !ticketNumber || !prize) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
      }
      
      // Verificar que la rifa existe
      const raffle = await storage.getRaffle(raffleId);
      if (!raffle) {
        return res.status(404).json({ message: 'Rifa no encontrada' });
      }
      
      const newWinner = await storage.createWinner({
        raffleId,
        winnerName,
        ticketNumber,
        prize,
        announcedDate: new Date().toISOString(), // la transformación a Date se hace en el schema
        claimed: false
      });
      
      res.status(201).json(newWinner);
    } catch (error) {
      console.error('Error al registrar ganador:', error);
      res.status(500).json({ message: 'Error al registrar ganador' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
