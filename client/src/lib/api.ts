import { apiRequest } from "./queryClient";

// Función para obtener las rifas con paginación y filtros
export async function getRaffles(page = 1, limit = 10, filter?: string) {
  let url = `/api/raffles?page=${page}&limit=${limit}`;
  
  if (filter) {
    url += `&filter=${filter}`;
  }
  
  const response = await apiRequest("GET", url);
  return response.json();
}

// Función para obtener una rifa específica
export async function getRaffle(id: number) {
  const response = await apiRequest("GET", `/api/raffles/${id}`);
  return response.json();
}

// Función para crear una nueva rifa
export async function createRaffle(raffleData: any) {
  const response = await apiRequest("POST", "/api/raffles", raffleData);
  return response.json();
}

// Función para actualizar una rifa existente
export async function updateRaffle(id: number, raffleData: any) {
  const response = await apiRequest("PUT", `/api/raffles/${id}`, raffleData);
  return response.json();
}

// Función para eliminar una rifa
export async function deleteRaffle(id: number) {
  const response = await apiRequest("DELETE", `/api/raffles/${id}`);
  return response.json();
}

// Función para iniciar sesión de administrador
export async function loginAdmin(credentials: { email: string; password: string }) {
  const response = await apiRequest("POST", "/api/admin/login", credentials);
  return response.json();
}

// Función para verificar el token del administrador
export async function verifyAdminToken(token: string) {
  const response = await fetch("/api/admin/verify", {
    headers: {
      "Authorization": `Bearer ${token}`
    },
    credentials: "include"
  });
  
  if (!response.ok) {
    throw new Error("Token inválido");
  }
  
  return response.json();
}
