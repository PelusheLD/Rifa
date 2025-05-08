import { apiRequest } from "./queryClient";

// Tipos de respuesta de API
export interface RafflesResponse {
  data: RaffleData[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface RaffleData {
  id: number;
  title: string;
  description: string;
  price: number;
  totalTickets: number;
  soldTickets: number;
  imageUrl: string;
  prizeId: string;
  endDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// Función para obtener las rifas con paginación y filtros
export async function getRaffles(page = 1, limit = 10, filter?: string) {
  let url = `/api/raffles?page=${page}&limit=${limit}`;
  
  if (filter) {
    url += `&filter=${filter}`;
  }
  
  return apiRequest<RafflesResponse>(url);
}

// Función para obtener una rifa específica
export async function getRaffle(id: number) {
  return apiRequest<RaffleData>(`/api/raffles/${id}`);
}

// Función para crear una nueva rifa
export async function createRaffle(raffleData: any) {
  return apiRequest<RaffleData>("/api/raffles", {
    method: "POST",
    body: JSON.stringify(raffleData)
  });
}

// Función para actualizar una rifa existente
export async function updateRaffle(id: number, raffleData: any) {
  return apiRequest<RaffleData>(`/api/raffles/${id}`, {
    method: "PUT",
    body: JSON.stringify(raffleData)
  });
}

// Función para eliminar una rifa
export async function deleteRaffle(id: number) {
  return apiRequest<{success: boolean}>(`/api/raffles/${id}`, {
    method: "DELETE"
  });
}

// Función para iniciar sesión de administrador
export async function loginAdmin(credentials: { username: string; password: string }) {
  return apiRequest<{token: string; user: any}>("/api/admin/login", {
    method: "POST",
    body: JSON.stringify(credentials)
  });
}

// Función para verificar el token del administrador
export async function verifyAdminToken(token: string) {
  return apiRequest<{valid: boolean, user: any}>("/api/admin/verify", {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
}
