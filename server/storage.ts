import { 
  admins, raffles, participants, tickets, winners,
  type Admin, type InsertAdmin,
  type Raffle, type InsertRaffle,
  type Participant, type InsertParticipant,
  type Ticket, type InsertTicket,
  type Winner, type InsertWinner
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc, like } from "drizzle-orm";
import bcrypt from "bcryptjs";

export interface IStorage {
  // Admin methods
  getAdmin(id: number): Promise<Admin | undefined>;
  getAdminByEmail(email: string): Promise<Admin | undefined>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;
  validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean>;
  
  // Raffle methods
  getRaffle(id: number): Promise<Raffle | undefined>;
  getRaffles(page?: number, limit?: number, filter?: string): Promise<Raffle[]>;
  getTotalRaffles(filter?: string): Promise<number>;
  createRaffle(raffle: InsertRaffle): Promise<Raffle>;
  updateRaffle(id: number, raffle: Partial<InsertRaffle>): Promise<Raffle | undefined>;
  deleteRaffle(id: number): Promise<boolean>;
  
  // Participant methods
  getParticipant(id: number): Promise<Participant | undefined>;
  getParticipants(page?: number, limit?: number): Promise<Participant[]>;
  createParticipant(participant: InsertParticipant): Promise<Participant>;
  
  // Ticket methods
  getTicket(id: number): Promise<Ticket | undefined>;
  getTicketsForRaffle(raffleId: number): Promise<Ticket[]>;
  createTicket(ticket: InsertTicket): Promise<Ticket>;
  
  // Winner methods
  getWinner(id: number): Promise<Winner | undefined>;
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

  async getAdminByEmail(email: string): Promise<Admin | undefined> {
    const [admin] = await db.select().from(admins).where(eq(admins.email, email));
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
    const offset = (page - 1) * limit;
    
    let query = db.select().from(raffles)
      .orderBy(desc(raffles.createdAt))
      .limit(limit)
      .offset(offset);
    
    if (filter) {
      if (filter === 'activa' || filter === 'proxima' || filter === 'finalizada') {
        query = query.where(eq(raffles.status, filter));
      } else {
        query = query.where(like(raffles.title, `%${filter}%`));
      }
    }
    
    return await query;
  }

  async getTotalRaffles(filter?: string): Promise<number> {
    let query = db.select({ count: db.fn.count() }).from(raffles);
    
    if (filter) {
      if (filter === 'activa' || filter === 'proxima' || filter === 'finalizada') {
        query = query.where(eq(raffles.status, filter));
      } else {
        query = query.where(like(raffles.title, `%${filter}%`));
      }
    }
    
    const [result] = await query;
    return Number(result.count);
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

  // Participant methods
  async getParticipant(id: number): Promise<Participant | undefined> {
    const [participant] = await db.select().from(participants).where(eq(participants.id, id));
    return participant;
  }

  async getParticipants(page = 1, limit = 10): Promise<Participant[]> {
    const offset = (page - 1) * limit;
    return await db
      .select()
      .from(participants)
      .orderBy(desc(participants.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async createParticipant(participant: InsertParticipant): Promise<Participant> {
    const [newParticipant] = await db
      .insert(participants)
      .values(participant)
      .returning();
    return newParticipant;
  }

  // Ticket methods
  async getTicket(id: number): Promise<Ticket | undefined> {
    const [ticket] = await db.select().from(tickets).where(eq(tickets.id, id));
    return ticket;
  }

  async getTicketsForRaffle(raffleId: number): Promise<Ticket[]> {
    return await db
      .select()
      .from(tickets)
      .where(eq(tickets.raffleId, raffleId))
      .orderBy(asc(tickets.ticketNumber));
  }

  async createTicket(ticket: InsertTicket): Promise<Ticket> {
    const [newTicket] = await db
      .insert(tickets)
      .values(ticket)
      .returning();
    
    // Increment soldTickets count in the raffle
    await db
      .update(raffles)
      .set({
        soldTickets: db.raw('sold_tickets + 1')
      })
      .where(eq(raffles.id, ticket.raffleId));
    
    return newTicket;
  }

  // Winner methods
  async getWinner(id: number): Promise<Winner | undefined> {
    const [winner] = await db.select().from(winners).where(eq(winners.id, id));
    return winner;
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
