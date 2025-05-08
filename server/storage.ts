import { 
  admins, raffles, tickets, winners,
  type Admin, type InsertAdmin,
  type Raffle, type InsertRaffle,
  type Ticket, type InsertTicket,
  type Winner, type InsertWinner
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc, like, inArray } from "drizzle-orm";
import bcrypt from "bcryptjs";

export interface IStorage {
  // Admin methods
  getAdmin(id: number): Promise<Admin | undefined>;
  getAdminByUsername(username: string): Promise<Admin | undefined>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;
  validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean>;
  
  // Raffle methods
  getRaffle(id: number): Promise<Raffle | undefined>;
  getRaffles(page?: number, limit?: number, filter?: string): Promise<Raffle[]>;
  getTotalRaffles(filter?: string): Promise<number>;
  createRaffle(raffle: InsertRaffle): Promise<Raffle>;
  updateRaffle(id: number, raffle: Partial<InsertRaffle>): Promise<Raffle | undefined>;
  deleteRaffle(id: number): Promise<boolean>;
  
  // Ticket methods
  getTicket(id: number): Promise<Ticket | undefined>;
  getAllTickets(): Promise<Ticket[]>;
  getTicketsForRaffle(raffleId: number): Promise<Ticket[]>;
  createTicket(ticket: InsertTicket): Promise<Ticket>;
  getTicketsByNumber(raffleId: number, numbers: number[]): Promise<Ticket[]>;
  getAvailableTickets(raffleId: number): Promise<number[]>;
  deleteTicket(id: number): Promise<boolean>; // Para liberar un ticket
  updateTicketPaymentStatus(id: number, paymentStatus: string): Promise<Ticket | undefined>; // Para actualizar estado de pago
  
  // Winner methods
  getWinner(id: number): Promise<Winner | undefined>;
  getWinners(): Promise<Winner[]>;
  getWinnersForRaffle(raffleId: number): Promise<Winner[]>;
  createWinner(winner: InsertWinner): Promise<Winner>;
  updateWinner(id: number, claimed: boolean): Promise<Winner | undefined>;
}

export class DatabaseStorage implements IStorage {
  // Admin methods
  async getAdmin(id: number): Promise<Admin | undefined> {
    const [admin] = await db.select().from(admins).where(eq(admins.id, id));
    return admin;
  }

  async getAdminByUsername(username: string): Promise<Admin | undefined> {
    const [admin] = await db.select().from(admins).where(eq(admins.username, username));
    return admin;
  }

  async createAdmin(admin: InsertAdmin): Promise<Admin> {
    const hashedPassword = await bcrypt.hash(admin.password, 10);
    const [newAdmin] = await db
      .insert(admins)
      .values({
        ...admin,
        password: hashedPassword
      })
      .returning();
    return newAdmin;
  }

  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  // Raffle methods
  async getRaffle(id: number): Promise<Raffle | undefined> {
    const [raffle] = await db.select().from(raffles).where(eq(raffles.id, id));
    return raffle;
  }

  async getRaffles(page = 1, limit = 10, filter?: string): Promise<Raffle[]> {
    try {
      const offset = (page - 1) * limit;
      
      // Base query
      let baseQuery = db.select().from(raffles);
      
      // Aplicar filtro si existe
      if (filter) {
        if (filter === 'activa' || filter === 'proxima' || filter === 'finalizada') {
          baseQuery = db.select().from(raffles).where(eq(raffles.status, filter));
        } else {
          baseQuery = db.select().from(raffles).where(like(raffles.title, `%${filter}%`));
        }
      }
      
      // Ejecutar con orden, límite y offset
      console.log("Ejecutando query de rifas");
      const result = await baseQuery
        .orderBy(desc(raffles.createdAt))
        .limit(limit)
        .offset(offset);
      console.log("Query ejecutado exitosamente");
      
      return result;
    } catch (error) {
      console.error("Error en getRaffles:", error);
      throw error;
    }
  }

  async getTotalRaffles(filter?: string): Promise<number> {
    try {
      // Base query para contar
      let baseQuery = db.select().from(raffles);
      
      // Aplicar filtro si existe
      if (filter) {
        if (filter === 'activa' || filter === 'proxima' || filter === 'finalizada') {
          baseQuery = db.select().from(raffles).where(eq(raffles.status, filter));
        } else {
          baseQuery = db.select().from(raffles).where(like(raffles.title, `%${filter}%`));
        }
      }
      
      console.log("Ejecutando query de conteo");
      const results = await baseQuery;
      console.log("Query de conteo ejecutado exitosamente, total:", results.length);
      
      return results.length;
    } catch (error) {
      console.error("Error en getTotalRaffles:", error);
      throw error;
    }
  }

  async createRaffle(raffle: InsertRaffle): Promise<Raffle> {
    const [newRaffle] = await db
      .insert(raffles)
      .values(raffle)
      .returning();
    return newRaffle;
  }

  async updateRaffle(id: number, raffle: Partial<InsertRaffle>): Promise<Raffle | undefined> {
    const [updatedRaffle] = await db
      .update(raffles)
      .set(raffle)
      .where(eq(raffles.id, id))
      .returning();
    return updatedRaffle;
  }

  async deleteRaffle(id: number): Promise<boolean> {
    const [deleted] = await db
      .delete(raffles)
      .where(eq(raffles.id, id))
      .returning();
    return !!deleted;
  }

  // Ticket methods
  async getTicket(id: number): Promise<Ticket | undefined> {
    const [ticket] = await db.select().from(tickets).where(eq(tickets.id, id));
    return ticket;
  }
  
  async getAllTickets(): Promise<Ticket[]> {
    return await db.select().from(tickets).orderBy(desc(tickets.reservationDate));
  }

  async getTicketsForRaffle(raffleId: number): Promise<Ticket[]> {
    return await db
      .select()
      .from(tickets)
      .where(eq(tickets.raffleId, raffleId))
      .orderBy(asc(tickets.number));
  }

  async getTicketsByNumber(raffleId: number, numbers: number[]): Promise<Ticket[]> {
    return await db
      .select()
      .from(tickets)
      .where(
        and(
          eq(tickets.raffleId, raffleId),
          // Filtrar por los números en la lista
          inArray(tickets.number, numbers)
        )
      );
  }

  async getAvailableTickets(raffleId: number): Promise<number[]> {
    // Obtener la rifa para saber cuántos números tiene en total
    const raffle = await this.getRaffle(raffleId);
    if (!raffle) {
      return [];
    }

    // Obtener todos los números comprados de esta rifa
    const soldTickets = await db
      .select({ number: tickets.number })
      .from(tickets)
      .where(eq(tickets.raffleId, raffleId));
    
    // Crear un conjunto con los números vendidos para búsqueda rápida
    const soldNumbersSet = new Set(soldTickets.map(t => t.number));
    
    // Generar el array de números disponibles
    const availableNumbers: number[] = [];
    for (let i = 1; i <= raffle.totalTickets; i++) {
      if (!soldNumbersSet.has(i)) {
        availableNumbers.push(i);
      }
    }
    
    return availableNumbers;
  }

  async createTicket(ticket: InsertTicket): Promise<Ticket> {
    const [newTicket] = await db
      .insert(tickets)
      .values(ticket)
      .returning();
    
    // Increment soldTickets count in the raffle
    const raffle = await this.getRaffle(ticket.raffleId);
    if (raffle) {
      await db
        .update(raffles)
        .set({
          soldTickets: (raffle.soldTickets || 0) + 1
        })
        .where(eq(raffles.id, ticket.raffleId));
    }
    
    return newTicket;
  }
  
  async deleteTicket(id: number): Promise<boolean> {
    try {
      // Primero obtenemos el ticket para saber a qué rifa pertenece
      const ticket = await this.getTicket(id);
      if (!ticket) {
        return false;
      }
      
      // Eliminamos el ticket
      const [deleted] = await db
        .delete(tickets)
        .where(eq(tickets.id, id))
        .returning();
      
      if (deleted) {
        // Decrementamos el contador de boletos vendidos en la rifa
        const raffle = await this.getRaffle(ticket.raffleId);
        if (raffle && raffle.soldTickets > 0) {
          await db
            .update(raffles)
            .set({
              soldTickets: raffle.soldTickets - 1
            })
            .where(eq(raffles.id, ticket.raffleId));
        }
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error al eliminar ticket:", error);
      return false;
    }
  }
  
  async updateTicketPaymentStatus(id: number, paymentStatus: string): Promise<Ticket | undefined> {
    try {
      // Verificamos primero si el ticket existe
      const ticket = await this.getTicket(id);
      if (!ticket) {
        console.error(`Ticket con ID ${id} no encontrado`);
        return undefined;
      }
      
      console.log(`Actualizando estado de ticket ${id} a ${paymentStatus}`);
      
      // Validamos que el estado de pago sea uno de los valores permitidos en el enum
      if (!['pendiente', 'pagado', 'cancelado'].includes(paymentStatus)) {
        console.error(`Estado de pago inválido: ${paymentStatus}`);
        return undefined;
      }
      
      // Determinar la fecha de pago
      let paymentDate = null;
      if (paymentStatus === 'pagado') {
        paymentDate = new Date(); // Usar objeto Date directamente en lugar de string
      }
      
      try {
        // Actualizamos el estado de pago del ticket
        const [updatedTicket] = await db
          .update(tickets)
          .set({
            paymentStatus: paymentStatus as any, // Forzar el tipo para evitar errores de tipo en tiempo de compilación
            paymentDate: paymentDate
          })
          .where(eq(tickets.id, id))
          .returning();
      
        console.log("Ticket actualizado con éxito:", updatedTicket);
        return updatedTicket;
      } catch (dbError) {
        console.error("Error en la operación de base de datos:", dbError);
        return undefined;
      }
    } catch (error) {
      console.error("Error al actualizar estado de pago:", error);
      return undefined;
    }
  }

  // Winner methods
  async getWinner(id: number): Promise<Winner | undefined> {
    const [winner] = await db.select().from(winners).where(eq(winners.id, id));
    return winner;
  }

  async getWinners(): Promise<Winner[]> {
    return await db
      .select()
      .from(winners)
      .orderBy(desc(winners.announcedDate));
  }

  async getWinnersForRaffle(raffleId: number): Promise<Winner[]> {
    return await db
      .select()
      .from(winners)
      .where(eq(winners.raffleId, raffleId))
      .orderBy(desc(winners.announcedDate));
  }

  async createWinner(winner: InsertWinner): Promise<Winner> {
    const [newWinner] = await db
      .insert(winners)
      .values(winner)
      .returning();
    return newWinner;
  }

  async updateWinner(id: number, claimed: boolean): Promise<Winner | undefined> {
    const [updatedWinner] = await db
      .update(winners)
      .set({ claimed })
      .where(eq(winners.id, id))
      .returning();
    return updatedWinner;
  }
}

export const storage = new DatabaseStorage();
