var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { createServer } from "http";
import { storage } from "./storage";
import session from "express-session";
import MemoryStore from "memorystore";
import jwt from "jsonwebtoken";
import { adminLoginSchema, insertRaffleSchema } from "../shared/schema.js";
import { z } from "zod";
// JWT Secret
var JWT_SECRET = process.env.JWT_SECRET || "rifas_online_secret_jwt";
// Middleware para verificar autenticación
var authenticateJWT = function (req, res, next) {
    var authHeader = req.headers.authorization;
    if (authHeader) {
        var token = authHeader.split(' ')[1];
        jwt.verify(token, JWT_SECRET, function (err, decoded) {
            if (err) {
                return res.status(401).json({ message: "Token inválido o expirado" });
            }
            req.user = decoded;
            next();
        });
    }
    else {
        res.status(401).json({ message: "No hay token proporcionado" });
    }
};
export function registerRoutes(app) {
    return __awaiter(this, void 0, void 0, function () {
        var MemorySessionStore, httpServer;
        var _this = this;
        return __generator(this, function (_a) {
            MemorySessionStore = MemoryStore(session);
            app.use(session({
                secret: process.env.SESSION_SECRET || "rifas_online_secret_session",
                resave: false,
                saveUninitialized: false,
                cookie: { secure: process.env.NODE_ENV === "production", maxAge: 24 * 60 * 60 * 1000 }, // 1 day
                store: new MemorySessionStore({
                    checkPeriod: 86400000 // 24 hours
                })
            }));
            // Ruta de autenticación de administrador
            app.post("/api/admin/login", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var validatedData, admin, isPasswordValid, token, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            validatedData = adminLoginSchema.parse(req.body);
                            return [4 /*yield*/, storage.getAdminByUsername(validatedData.username)];
                        case 1:
                            admin = _a.sent();
                            if (!admin) {
                                return [2 /*return*/, res.status(401).json({ message: "Credenciales incorrectas" })];
                            }
                            return [4 /*yield*/, storage.validatePassword(validatedData.password, admin.password)];
                        case 2:
                            isPasswordValid = _a.sent();
                            if (!isPasswordValid) {
                                return [2 /*return*/, res.status(401).json({ message: "Credenciales incorrectas" })];
                            }
                            token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '24h' });
                            res.json({
                                message: "Autenticación exitosa",
                                user: {
                                    id: admin.id,
                                    username: admin.username,
                                    name: admin.name
                                },
                                token: token
                            });
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _a.sent();
                            if (error_1 instanceof z.ZodError) {
                                return [2 /*return*/, res.status(400).json({
                                        message: "Datos de entrada inválidos",
                                        errors: error_1.errors
                                    })];
                            }
                            res.status(500).json({ message: "Error en el servidor" });
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
            // Verificar token
            app.get("/api/admin/verify", authenticateJWT, function (req, res) {
                res.json({ valid: true, user: req.user });
            });
            // Rutas para rifas - CRUD
            app.get("/api/raffles", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var page, limit, filter, raffles, total, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            page = parseInt(req.query.page) || 1;
                            limit = parseInt(req.query.limit) || 10;
                            filter = req.query.filter;
                            console.log("Intentando obtener rifas con:", { page: page, limit: limit, filter: filter });
                            return [4 /*yield*/, storage.getRaffles(page, limit, filter)];
                        case 1:
                            raffles = _a.sent();
                            return [4 /*yield*/, storage.getTotalRaffles(filter)];
                        case 2:
                            total = _a.sent();
                            console.log("Rifas obtenidas:", { count: raffles.length, total: total });
                            res.json({
                                data: raffles,
                                pagination: {
                                    total: total,
                                    page: page,
                                    limit: limit,
                                    totalPages: Math.ceil(total / limit)
                                }
                            });
                            return [3 /*break*/, 4];
                        case 3:
                            error_2 = _a.sent();
                            console.error("Error al obtener rifas:", error_2);
                            res.status(500).json({ message: "Error al obtener las rifas" });
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
            app.get("/api/raffles/:id", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var id, raffle, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            id = parseInt(req.params.id);
                            return [4 /*yield*/, storage.getRaffle(id)];
                        case 1:
                            raffle = _a.sent();
                            if (!raffle) {
                                return [2 /*return*/, res.status(404).json({ message: "Rifa no encontrada" })];
                            }
                            res.json(raffle);
                            return [3 /*break*/, 3];
                        case 2:
                            error_3 = _a.sent();
                            res.status(500).json({ message: "Error al obtener la rifa" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            app.post("/api/raffles", authenticateJWT, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var validatedData, raffle, error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            validatedData = insertRaffleSchema.parse(req.body);
                            return [4 /*yield*/, storage.createRaffle(validatedData)];
                        case 1:
                            raffle = _a.sent();
                            res.status(201).json(raffle);
                            return [3 /*break*/, 3];
                        case 2:
                            error_4 = _a.sent();
                            if (error_4 instanceof z.ZodError) {
                                return [2 /*return*/, res.status(400).json({
                                        message: "Datos de entrada inválidos",
                                        errors: error_4.errors
                                    })];
                            }
                            res.status(500).json({ message: "Error al crear la rifa" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            app.put("/api/raffles/:id", authenticateJWT, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var id, validatedData, raffle, error_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            id = parseInt(req.params.id);
                            validatedData = insertRaffleSchema.partial().parse(req.body);
                            return [4 /*yield*/, storage.updateRaffle(id, validatedData)];
                        case 1:
                            raffle = _a.sent();
                            if (!raffle) {
                                return [2 /*return*/, res.status(404).json({ message: "Rifa no encontrada" })];
                            }
                            res.json(raffle);
                            return [3 /*break*/, 3];
                        case 2:
                            error_5 = _a.sent();
                            if (error_5 instanceof z.ZodError) {
                                return [2 /*return*/, res.status(400).json({
                                        message: "Datos de entrada inválidos",
                                        errors: error_5.errors
                                    })];
                            }
                            res.status(500).json({ message: "Error al actualizar la rifa" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            app.delete("/api/raffles/:id", authenticateJWT, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var id, deleted, error_6;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            id = parseInt(req.params.id);
                            return [4 /*yield*/, storage.deleteRaffle(id)];
                        case 1:
                            deleted = _a.sent();
                            if (!deleted) {
                                return [2 /*return*/, res.status(404).json({ message: "Rifa no encontrada" })];
                            }
                            res.json({ message: "Rifa eliminada correctamente" });
                            return [3 /*break*/, 3];
                        case 2:
                            error_6 = _a.sent();
                            res.status(500).json({ message: "Error al eliminar la rifa" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Crear administrador (solo para setup inicial)
            app.post("/api/admin/setup", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var existingAdmins, admin, error_7;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, storage.getRaffles(1, 1)];
                        case 1:
                            existingAdmins = _a.sent();
                            if (existingAdmins.length > 0) {
                                return [2 /*return*/, res.status(400).json({ message: "Ya existe un administrador configurado" })];
                            }
                            return [4 /*yield*/, storage.createAdmin({
                                    username: "admin",
                                    password: "admin123",
                                    name: "Administrador"
                                })];
                        case 2:
                            admin = _a.sent();
                            res.status(201).json({
                                message: "Administrador creado correctamente",
                                admin: {
                                    id: admin.id,
                                    username: admin.username,
                                    name: admin.name
                                }
                            });
                            return [3 /*break*/, 4];
                        case 3:
                            error_7 = _a.sent();
                            res.status(500).json({ message: "Error al configurar el administrador" });
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
            // API TICKETS
            // Obtener todos los tickets
            app.get('/api/tickets', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var allTickets, error_8;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, storage.getAllTickets()];
                        case 1:
                            allTickets = _a.sent();
                            res.json(allTickets);
                            return [3 /*break*/, 3];
                        case 2:
                            error_8 = _a.sent();
                            console.error('Error al obtener todos los tickets:', error_8);
                            res.status(500).json({ message: 'Error al obtener tickets' });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Liberar (eliminar) un ticket
            app.delete('/api/tickets/:id', authenticateJWT, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var id, success, error_9;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            id = parseInt(req.params.id);
                            return [4 /*yield*/, storage.deleteTicket(id)];
                        case 1:
                            success = _a.sent();
                            if (!success) {
                                return [2 /*return*/, res.status(404).json({ message: 'Ticket no encontrado' })];
                            }
                            res.json({ message: 'Ticket liberado correctamente' });
                            return [3 /*break*/, 3];
                        case 2:
                            error_9 = _a.sent();
                            console.error('Error al liberar ticket:', error_9);
                            res.status(500).json({ message: 'Error al liberar ticket' });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Actualizar estado de pago de un ticket
            app.patch('/api/tickets/:id/payment-status', authenticateJWT, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var id, paymentStatus, dbPaymentStatus, ticketExists, updatedTicket, error_10;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            console.log("Recibida solicitud PATCH para actualizar estado de pago");
                            id = parseInt(req.params.id);
                            console.log("ID del ticket:", id);
                            console.log("Cuerpo de la solicitud:", req.body);
                            paymentStatus = req.body.paymentStatus;
                            dbPaymentStatus = paymentStatus === 'apartado' ? 'pendiente' : paymentStatus;
                            if (!dbPaymentStatus || !['pendiente', 'pagado', 'cancelado'].includes(dbPaymentStatus)) {
                                console.log("Estado de pago inválido:", dbPaymentStatus);
                                return [2 /*return*/, res.status(400).json({ message: 'Estado de pago inválido' })];
                            }
                            return [4 /*yield*/, storage.getTicket(id)];
                        case 1:
                            ticketExists = _a.sent();
                            if (!ticketExists) {
                                console.log("Ticket con ID ".concat(id, " no existe en la base de datos"));
                                return [2 /*return*/, res.status(404).json({ message: 'Ticket no encontrado' })];
                            }
                            console.log("Actualizando ticket ".concat(id, " a estado ").concat(dbPaymentStatus));
                            return [4 /*yield*/, storage.updateTicketPaymentStatus(id, dbPaymentStatus)];
                        case 2:
                            updatedTicket = _a.sent();
                            if (!updatedTicket) {
                                console.log("Error al actualizar ticket ".concat(id, ". No se pudo completar la operaci\u00F3n."));
                                return [2 /*return*/, res.status(404).json({ message: 'Ticket no encontrado' })];
                            }
                            console.log("Ticket actualizado correctamente:", updatedTicket);
                            res.json(updatedTicket);
                            return [3 /*break*/, 4];
                        case 3:
                            error_10 = _a.sent();
                            console.error('Error al actualizar estado de pago:', error_10);
                            res.status(500).json({ message: 'Error al actualizar estado de pago' });
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
            // Obtener un ticket específico
            app.get('/api/tickets/:id', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var id, ticket, error_11;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            id = parseInt(req.params.id);
                            return [4 /*yield*/, storage.getTicket(id)];
                        case 1:
                            ticket = _a.sent();
                            if (!ticket) {
                                return [2 /*return*/, res.status(404).json({ message: 'Ticket no encontrado' })];
                            }
                            res.json(ticket);
                            return [3 /*break*/, 3];
                        case 2:
                            error_11 = _a.sent();
                            console.error('Error al obtener ticket:', error_11);
                            res.status(500).json({ message: 'Error al obtener ticket' });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Crear un nuevo ticket (reserva)
            app.post('/api/tickets', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var _a, raffleId, number, cedula, name_1, email, phone, paymentStatus, raffle, existingTickets, dbPaymentStatus, newTicket, error_12;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 4, , 5]);
                            _a = req.body, raffleId = _a.raffleId, number = _a.number, cedula = _a.cedula, name_1 = _a.name, email = _a.email, phone = _a.phone, paymentStatus = _a.paymentStatus;
                            // Validación básica
                            if (!raffleId || !number || !cedula || !name_1 || !email || !phone) {
                                return [2 /*return*/, res.status(400).json({ message: 'Faltan campos requeridos' })];
                            }
                            return [4 /*yield*/, storage.getRaffle(raffleId)];
                        case 1:
                            raffle = _b.sent();
                            if (!raffle) {
                                return [2 /*return*/, res.status(404).json({ message: 'Rifa no encontrada' })];
                            }
                            return [4 /*yield*/, storage.getTicketsByNumber(raffleId, [number])];
                        case 2:
                            existingTickets = _b.sent();
                            if (existingTickets.length > 0) {
                                return [2 /*return*/, res.status(409).json({ message: 'Este número ya ha sido reservado por otra persona' })];
                            }
                            dbPaymentStatus = paymentStatus === 'apartado' ? 'pendiente' :
                                paymentStatus || 'pendiente';
                            // Validar que el estado sea válido para el enum
                            if (!['pendiente', 'pagado', 'cancelado'].includes(dbPaymentStatus)) {
                                return [2 /*return*/, res.status(400).json({ message: 'Estado de pago inválido' })];
                            }
                            return [4 /*yield*/, storage.createTicket({
                                    raffleId: raffleId,
                                    number: number,
                                    cedula: cedula,
                                    name: name_1,
                                    email: email,
                                    phone: phone,
                                    paymentStatus: dbPaymentStatus // Forzar el tipo para evitar errores
                                })];
                        case 3:
                            newTicket = _b.sent();
                            res.status(201).json(newTicket);
                            return [3 /*break*/, 5];
                        case 4:
                            error_12 = _b.sent();
                            console.error('Error al crear ticket:', error_12);
                            res.status(500).json({ message: 'Error al crear ticket' });
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            }); });
            // Obtener todos los tickets de una rifa
            app.get('/api/raffles/:raffleId/tickets', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var raffleId, raffle, tickets, error_13;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            raffleId = parseInt(req.params.raffleId);
                            return [4 /*yield*/, storage.getRaffle(raffleId)];
                        case 1:
                            raffle = _a.sent();
                            if (!raffle) {
                                return [2 /*return*/, res.status(404).json({ message: 'Rifa no encontrada' })];
                            }
                            return [4 /*yield*/, storage.getTicketsForRaffle(raffleId)];
                        case 2:
                            tickets = _a.sent();
                            res.json(tickets);
                            return [3 /*break*/, 4];
                        case 3:
                            error_13 = _a.sent();
                            console.error('Error al obtener tickets de la rifa:', error_13);
                            res.status(500).json({ message: 'Error al obtener tickets' });
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
            // Obtener números disponibles de una rifa
            app.get('/api/raffles/:raffleId/available-numbers', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var raffleId, raffle, availableNumbers, error_14;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            raffleId = parseInt(req.params.raffleId);
                            return [4 /*yield*/, storage.getRaffle(raffleId)];
                        case 1:
                            raffle = _a.sent();
                            if (!raffle) {
                                return [2 /*return*/, res.status(404).json({ message: 'Rifa no encontrada' })];
                            }
                            return [4 /*yield*/, storage.getAvailableTickets(raffleId)];
                        case 2:
                            availableNumbers = _a.sent();
                            res.json({ availableNumbers: availableNumbers });
                            return [3 /*break*/, 4];
                        case 3:
                            error_14 = _a.sent();
                            console.error('Error al obtener números disponibles:', error_14);
                            res.status(500).json({ message: 'Error al obtener números disponibles' });
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
            // Obtener todos los ganadores
            app.get('/api/winners', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var winners, error_15;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, storage.getWinners()];
                        case 1:
                            winners = _a.sent();
                            res.json(winners);
                            return [3 /*break*/, 3];
                        case 2:
                            error_15 = _a.sent();
                            console.error('Error al obtener ganadores:', error_15);
                            res.status(500).json({ message: 'Error al obtener ganadores' });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Registrar un nuevo ganador
            app.post('/api/winners', authenticateJWT, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var _a, raffleId, winnerName, ticketNumber, prize, raffle, newWinner, error_16;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 3, , 4]);
                            console.log('Body recibido en /api/winners:', req.body);
                            _a = req.body, raffleId = _a.raffleId, winnerName = _a.winnerName, ticketNumber = _a.ticketNumber, prize = _a.prize;
                            if (!raffleId || !winnerName || !ticketNumber || !prize) {
                                return [2 /*return*/, res.status(400).json({ message: 'Todos los campos son requeridos' })];
                            }
                            return [4 /*yield*/, storage.getRaffle(raffleId)];
                        case 1:
                            raffle = _b.sent();
                            if (!raffle) {
                                return [2 /*return*/, res.status(404).json({ message: 'Rifa no encontrada' })];
                            }
                            return [4 /*yield*/, storage.createWinner({
                                    raffleId: raffleId,
                                    winnerName: winnerName,
                                    ticketNumber: ticketNumber,
                                    prize: prize,
                                    announcedDate: new Date(),
                                    claimed: false
                                })];
                        case 2:
                            newWinner = _b.sent();
                            res.status(201).json(newWinner);
                            return [3 /*break*/, 4];
                        case 3:
                            error_16 = _b.sent();
                            console.error('Error al registrar ganador:', error_16);
                            res.status(500).json({ message: 'Error al registrar ganador' });
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
            // Marcar ganador como reclamado
            app.patch('/api/winners/:id/claim', authenticateJWT, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var id, updatedWinner, error_17;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            id = parseInt(req.params.id);
                            return [4 /*yield*/, storage.updateWinner(id, true)];
                        case 1:
                            updatedWinner = _a.sent();
                            if (!updatedWinner) {
                                return [2 /*return*/, res.status(404).json({ message: 'Ganador no encontrado' })];
                            }
                            res.json(updatedWinner);
                            return [3 /*break*/, 3];
                        case 2:
                            error_17 = _a.sent();
                            console.error('Error al marcar como reclamado:', error_17);
                            res.status(500).json({ message: 'Error al marcar como reclamado' });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            httpServer = createServer(app);
            return [2 /*return*/, httpServer];
        });
    });
}
