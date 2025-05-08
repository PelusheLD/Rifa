import { pgTable, text, serial, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enum para los estados de la rifa
export const statusEnum = pgEnum('status', ['activa', 'proxima', 'finalizada']);

// Enum para estados de pago
export const paymentStatusEnum = pgEnum('payment_status', ['pendiente', 'pagado', 'cancelado']);

// Tabla de administradores
export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Tabla de rifas (Actualizada según los nuevos requisitos)
export const raffles = pgTable("raffles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(), // Producto
  description: text("description").notNull(), // Descripción
  price: integer("price").notNull(), // Precio del número
  totalTickets: integer("total_tickets").notNull(), // Cantidad total de números
  soldTickets: integer("sold_tickets").default(0), // Números vendidos (se actualizará automáticamente)
  imageUrl: text("image_url").notNull(), // Foto
  prizeId: text("prize_id"), // ID o código único del premio
  endDate: timestamp("end_date").notNull(), // Fecha de sorteo
  status: statusEnum("status").notNull().default('activa'),
  createdAt: timestamp("created_at").defaultNow(), // Fecha de creación
});

// Tabla de números (boletos) - Nueva estructura según requisitos
export const tickets = pgTable("tickets", {
  id: serial("id").primaryKey(),
  raffleId: integer("raffle_id").notNull(), // ID de la rifa
  number: integer("number").notNull(), // Número de boleto
  cedula: text("cedula").notNull(), // Cédula del comprador
  name: text("name").notNull(), // Nombre del comprador
  email: text("email").notNull(), // Correo del comprador
  phone: text("phone").notNull(), // Teléfono del comprador
  reservationDate: timestamp("reservation_date").defaultNow(), // Fecha de apartado
  paymentDate: timestamp("payment_date"), // Fecha de pago (null si no ha pagado)
  paymentStatus: paymentStatusEnum("payment_status").notNull().default('pendiente'), // Estado: pendiente, pagado, cancelado
});

// Tabla de ganadores
export const winners = pgTable("winners", {
  id: serial("id").primaryKey(),
  raffleId: integer("raffle_id").notNull(),
  winnerName: text("winner_name").notNull(),
  ticketNumber: integer("ticket_number").notNull(),
  prize: text("prize").notNull(),
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
  status: true,
}).extend({
  prizeId: z.string().optional(),
  endDate: z.string().transform(str => new Date(str)),
});

export type InsertRaffle = z.infer<typeof insertRaffleSchema>;
export type Raffle = typeof raffles.$inferSelect;

// Esquemas de inserción y tipos para boletos (actualizado)
export const insertTicketSchema = createInsertSchema(tickets).pick({
  raffleId: true,
  number: true,
  cedula: true,
  name: true,
  email: true,
  phone: true,
  paymentStatus: true,
});

export type InsertTicket = z.infer<typeof insertTicketSchema>;
export type Ticket = typeof tickets.$inferSelect;

// Esquemas de inserción y tipos para ganadores
export const insertWinnerSchema = createInsertSchema(winners).pick({
  raffleId: true,
  winnerName: true,
  ticketNumber: true,
  prize: true,
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
