import { pgTable, text, serial, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enum para los estados de la rifa
export const statusEnum = pgEnum('status', ['activa', 'proxima', 'finalizada']);

// Tabla de administradores
export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Tabla de rifas
export const raffles = pgTable("raffles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  totalTickets: integer("total_tickets").notNull(),
  soldTickets: integer("sold_tickets").default(0),
  imageUrl: text("image_url").notNull(),
  prizeId: text("prize_id").notNull(),
  endDate: timestamp("end_date").notNull(),
  status: statusEnum("status").notNull().default('activa'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Tabla de participantes
export const participants = pgTable("participants", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Tabla de ventas/boletos
export const tickets = pgTable("tickets", {
  id: serial("id").primaryKey(),
  raffleId: integer("raffle_id").notNull(),
  participantId: integer("participant_id").notNull(),
  ticketNumber: integer("ticket_number").notNull(),
  paymentStatus: text("payment_status").notNull(),
  purchaseDate: timestamp("purchase_date").defaultNow(),
});

// Tabla de ganadores
export const winners = pgTable("winners", {
  id: serial("id").primaryKey(),
  raffleId: integer("raffle_id").notNull(),
  participantId: integer("participant_id").notNull(),
  ticketId: integer("ticket_id").notNull(),
  announcedDate: timestamp("announced_date").defaultNow(),
  claimed: boolean("claimed").default(false),
});

// Esquemas de inserción y tipos para admin
export const insertAdminSchema = createInsertSchema(admins).pick({
  username: true,
  password: true,
  name: true,
});

export type InsertAdmin = z.infer<typeof insertAdminSchema>;
export type Admin = typeof admins.$inferSelect;

// Esquemas de inserción y tipos para rifas
export const insertRaffleSchema = createInsertSchema(raffles).pick({
  title: true,
  description: true,
  price: true,
  totalTickets: true,
  imageUrl: true,
  prizeId: true,
  endDate: true,
  status: true,
});

export type InsertRaffle = z.infer<typeof insertRaffleSchema>;
export type Raffle = typeof raffles.$inferSelect;

// Esquemas de inserción y tipos para participantes
export const insertParticipantSchema = createInsertSchema(participants).pick({
  name: true,
  email: true,
  phone: true,
});

export type InsertParticipant = z.infer<typeof insertParticipantSchema>;
export type Participant = typeof participants.$inferSelect;

// Esquemas de inserción y tipos para boletos
export const insertTicketSchema = createInsertSchema(tickets).pick({
  raffleId: true,
  participantId: true,
  ticketNumber: true,
  paymentStatus: true,
});

export type InsertTicket = z.infer<typeof insertTicketSchema>;
export type Ticket = typeof tickets.$inferSelect;

// Esquemas de inserción y tipos para ganadores
export const insertWinnerSchema = createInsertSchema(winners).pick({
  raffleId: true,
  participantId: true,
  ticketId: true,
  claimed: true,
});

export type InsertWinner = z.infer<typeof insertWinnerSchema>;
export type Winner = typeof winners.$inferSelect;

// Esquema de autenticación
export const adminLoginSchema = z.object({
  username: z.string().min(3, "Nombre de usuario debe tener al menos 3 caracteres"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export type AdminLogin = z.infer<typeof adminLoginSchema>;
