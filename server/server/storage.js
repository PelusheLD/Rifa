var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
import { admins, raffles, tickets, winners } from "../shared/schema.js";
import { db } from "./db.js";
import { eq, and, desc, asc, like, inArray } from "drizzle-orm";
import bcrypt from "bcryptjs";
var DatabaseStorage = /** @class */ (function () {
    function DatabaseStorage() {
    }
    // Admin methods
    DatabaseStorage.prototype.getAdmin = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var admin;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.select().from(admins).where(eq(admins.id, id))];
                    case 1:
                        admin = (_a.sent())[0];
                        return [2 /*return*/, admin];
                }
            });
        });
    };
    DatabaseStorage.prototype.getAdminByUsername = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var admin;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.select().from(admins).where(eq(admins.username, username))];
                    case 1:
                        admin = (_a.sent())[0];
                        return [2 /*return*/, admin];
                }
            });
        });
    };
    DatabaseStorage.prototype.createAdmin = function (admin) {
        return __awaiter(this, void 0, void 0, function () {
            var hashedPassword, newAdmin;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, bcrypt.hash(admin.password, 10)];
                    case 1:
                        hashedPassword = _a.sent();
                        return [4 /*yield*/, db
                                .insert(admins)
                                .values(__assign(__assign({}, admin), { password: hashedPassword }))
                                .returning()];
                    case 2:
                        newAdmin = (_a.sent())[0];
                        return [2 /*return*/, newAdmin];
                }
            });
        });
    };
    DatabaseStorage.prototype.validatePassword = function (plainPassword, hashedPassword) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, bcrypt.compare(plainPassword, hashedPassword)];
            });
        });
    };
    // Raffle methods
    DatabaseStorage.prototype.getRaffle = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var raffle;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.select().from(raffles).where(eq(raffles.id, id))];
                    case 1:
                        raffle = (_a.sent())[0];
                        return [2 /*return*/, raffle];
                }
            });
        });
    };
    DatabaseStorage.prototype.getRaffles = function () {
        return __awaiter(this, arguments, void 0, function (page, limit, filter) {
            var offset, query, result, error_1;
            if (page === void 0) { page = 1; }
            if (limit === void 0) { limit = 10; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        offset = (page - 1) * limit;
                        query = void 0;
                        if (filter) {
                            if (filter === 'activa' || filter === 'proxima' || filter === 'finalizada') {
                                query = db.select().from(raffles).where(eq(raffles.status, filter));
                            }
                            else {
                                query = db.select().from(raffles).where(like(raffles.title, "%".concat(filter, "%")));
                            }
                        }
                        else {
                            query = db.select().from(raffles);
                        }
                        // Ejecutar con orden, límite y offset
                        console.log("Ejecutando query de rifas");
                        return [4 /*yield*/, query
                                .orderBy(desc(raffles.createdAt))
                                .limit(limit)
                                .offset(offset)];
                    case 1:
                        result = _a.sent();
                        console.log("Query ejecutado exitosamente");
                        return [2 /*return*/, result];
                    case 2:
                        error_1 = _a.sent();
                        console.error("Error en getRaffles:", error_1);
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    DatabaseStorage.prototype.getTotalRaffles = function (filter) {
        return __awaiter(this, void 0, void 0, function () {
            var query, results, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = void 0;
                        if (filter) {
                            if (filter === 'activa' || filter === 'proxima' || filter === 'finalizada') {
                                query = db.select().from(raffles).where(eq(raffles.status, filter));
                            }
                            else {
                                query = db.select().from(raffles).where(like(raffles.title, "%".concat(filter, "%")));
                            }
                        }
                        else {
                            query = db.select().from(raffles);
                        }
                        console.log("Ejecutando query de conteo");
                        return [4 /*yield*/, query];
                    case 1:
                        results = _a.sent();
                        console.log("Query de conteo ejecutado exitosamente, total:", results.length);
                        return [2 /*return*/, results.length];
                    case 2:
                        error_2 = _a.sent();
                        console.error("Error en getTotalRaffles:", error_2);
                        throw error_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    DatabaseStorage.prototype.createRaffle = function (raffle) {
        return __awaiter(this, void 0, void 0, function () {
            var newRaffle;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db
                            .insert(raffles)
                            .values(raffle)
                            .returning()];
                    case 1:
                        newRaffle = (_a.sent())[0];
                        return [2 /*return*/, newRaffle];
                }
            });
        });
    };
    DatabaseStorage.prototype.updateRaffle = function (id, raffle) {
        return __awaiter(this, void 0, void 0, function () {
            var updatedRaffle;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db
                            .update(raffles)
                            .set(raffle)
                            .where(eq(raffles.id, id))
                            .returning()];
                    case 1:
                        updatedRaffle = (_a.sent())[0];
                        return [2 /*return*/, updatedRaffle];
                }
            });
        });
    };
    DatabaseStorage.prototype.deleteRaffle = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var deleted;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db
                            .delete(raffles)
                            .where(eq(raffles.id, id))
                            .returning()];
                    case 1:
                        deleted = (_a.sent())[0];
                        return [2 /*return*/, !!deleted];
                }
            });
        });
    };
    // Ticket methods
    DatabaseStorage.prototype.getTicket = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var ticket;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.select().from(tickets).where(eq(tickets.id, id))];
                    case 1:
                        ticket = (_a.sent())[0];
                        return [2 /*return*/, ticket];
                }
            });
        });
    };
    DatabaseStorage.prototype.getAllTickets = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.select().from(tickets).orderBy(desc(tickets.reservationDate))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.getTicketsForRaffle = function (raffleId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db
                            .select()
                            .from(tickets)
                            .where(eq(tickets.raffleId, raffleId))
                            .orderBy(asc(tickets.number))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.getTicketsByNumber = function (raffleId, numbers) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db
                            .select()
                            .from(tickets)
                            .where(and(eq(tickets.raffleId, raffleId), 
                        // Filtrar por los números en la lista
                        inArray(tickets.number, numbers)))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.getAvailableTickets = function (raffleId) {
        return __awaiter(this, void 0, void 0, function () {
            var raffle, soldTickets, soldNumbersSet, availableNumbers, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getRaffle(raffleId)];
                    case 1:
                        raffle = _a.sent();
                        if (!raffle) {
                            return [2 /*return*/, []];
                        }
                        return [4 /*yield*/, db
                                .select({ number: tickets.number })
                                .from(tickets)
                                .where(eq(tickets.raffleId, raffleId))];
                    case 2:
                        soldTickets = _a.sent();
                        soldNumbersSet = new Set(soldTickets.map(function (t) { return t.number; }));
                        availableNumbers = [];
                        for (i = 1; i <= raffle.totalTickets; i++) {
                            if (!soldNumbersSet.has(i)) {
                                availableNumbers.push(i);
                            }
                        }
                        return [2 /*return*/, availableNumbers];
                }
            });
        });
    };
    DatabaseStorage.prototype.createTicket = function (ticket) {
        return __awaiter(this, void 0, void 0, function () {
            var newTicket, raffle;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, db
                            .insert(tickets)
                            .values(ticket)
                            .returning()];
                    case 1:
                        newTicket = (_b.sent())[0];
                        return [4 /*yield*/, this.getRaffle(ticket.raffleId)];
                    case 2:
                        raffle = _b.sent();
                        if (!raffle) return [3 /*break*/, 4];
                        return [4 /*yield*/, db
                                .update(raffles)
                                .set({
                                soldTickets: ((_a = raffle.soldTickets) !== null && _a !== void 0 ? _a : 0) + 1
                            })
                                .where(eq(raffles.id, ticket.raffleId))];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4: return [2 /*return*/, newTicket];
                }
            });
        });
    };
    DatabaseStorage.prototype.deleteTicket = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var ticket, deleted, raffle, error_3;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 7, , 8]);
                        return [4 /*yield*/, this.getTicket(id)];
                    case 1:
                        ticket = _c.sent();
                        if (!ticket) {
                            return [2 /*return*/, false];
                        }
                        return [4 /*yield*/, db
                                .delete(tickets)
                                .where(eq(tickets.id, id))
                                .returning()];
                    case 2:
                        deleted = (_c.sent())[0];
                        if (!deleted) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.getRaffle(ticket.raffleId)];
                    case 3:
                        raffle = _c.sent();
                        if (!(raffle && ((_a = raffle.soldTickets) !== null && _a !== void 0 ? _a : 0) > 0)) return [3 /*break*/, 5];
                        return [4 /*yield*/, db
                                .update(raffles)
                                .set({
                                soldTickets: Math.max(((_b = raffle.soldTickets) !== null && _b !== void 0 ? _b : 0) - 1, 0)
                            })
                                .where(eq(raffles.id, ticket.raffleId))];
                    case 4:
                        _c.sent();
                        _c.label = 5;
                    case 5: return [2 /*return*/, true];
                    case 6: return [2 /*return*/, false];
                    case 7:
                        error_3 = _c.sent();
                        console.error("Error al eliminar ticket:", error_3);
                        return [2 /*return*/, false];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    DatabaseStorage.prototype.updateTicketPaymentStatus = function (id, paymentStatus) {
        return __awaiter(this, void 0, void 0, function () {
            var ticket, paymentDate, updatedTicket, dbError_1, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, this.getTicket(id)];
                    case 1:
                        ticket = _a.sent();
                        if (!ticket) {
                            console.error("Ticket con ID ".concat(id, " no encontrado"));
                            return [2 /*return*/, undefined];
                        }
                        console.log("Actualizando estado de ticket ".concat(id, " a ").concat(paymentStatus));
                        // Validamos que el estado de pago sea uno de los valores permitidos en el enum
                        if (!['pendiente', 'pagado', 'cancelado'].includes(paymentStatus)) {
                            console.error("Estado de pago inv\u00E1lido: ".concat(paymentStatus));
                            return [2 /*return*/, undefined];
                        }
                        paymentDate = null;
                        if (paymentStatus === 'pagado') {
                            paymentDate = new Date(); // Usar objeto Date directamente en lugar de string
                        }
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, db
                                .update(tickets)
                                .set({
                                paymentStatus: paymentStatus, // Forzar el tipo para evitar errores de tipo en tiempo de compilación
                                paymentDate: paymentDate
                            })
                                .where(eq(tickets.id, id))
                                .returning()];
                    case 3:
                        updatedTicket = (_a.sent())[0];
                        console.log("Ticket actualizado con éxito:", updatedTicket);
                        return [2 /*return*/, updatedTicket];
                    case 4:
                        dbError_1 = _a.sent();
                        console.error("Error en la operación de base de datos:", dbError_1);
                        return [2 /*return*/, undefined];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_4 = _a.sent();
                        console.error("Error al actualizar estado de pago:", error_4);
                        return [2 /*return*/, undefined];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    // Winner methods
    DatabaseStorage.prototype.getWinner = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var winner;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.select().from(winners).where(eq(winners.id, id))];
                    case 1:
                        winner = (_a.sent())[0];
                        return [2 /*return*/, winner];
                }
            });
        });
    };
    DatabaseStorage.prototype.getWinners = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db
                            .select()
                            .from(winners)
                            .orderBy(desc(winners.announcedDate))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.getWinnersForRaffle = function (raffleId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db
                            .select()
                            .from(winners)
                            .where(eq(winners.raffleId, raffleId))
                            .orderBy(desc(winners.announcedDate))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.createWinner = function (winner) {
        return __awaiter(this, void 0, void 0, function () {
            var newWinner;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db
                            .insert(winners)
                            .values(winner)
                            .returning()];
                    case 1:
                        newWinner = (_a.sent())[0];
                        return [2 /*return*/, newWinner];
                }
            });
        });
    };
    DatabaseStorage.prototype.updateWinner = function (id, claimed) {
        return __awaiter(this, void 0, void 0, function () {
            var updatedWinner;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db
                            .update(winners)
                            .set({ claimed: claimed })
                            .where(eq(winners.id, id))
                            .returning()];
                    case 1:
                        updatedWinner = (_a.sent())[0];
                        return [2 /*return*/, updatedWinner];
                }
            });
        });
    };
    return DatabaseStorage;
}());
export { DatabaseStorage };
export var storage = new DatabaseStorage();
