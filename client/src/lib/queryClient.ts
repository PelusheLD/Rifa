import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Obtener el token de autenticación
  const token = localStorage.getItem("adminToken");
  
  // Preparar los headers
  const headers = new Headers(options.headers || {});
  
  // Si hay token, incluirlo en los headers si no se especificó
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  
  // Si no se especifica Content-Type y es un método POST, PUT o PATCH, agregar application/json
  if (!headers.has("Content-Type") && 
      ["POST", "PUT", "PATCH"].includes(options.method || "GET")) {
    headers.set("Content-Type", "application/json");
  }
  
  const res = await fetch(endpoint, {
    ...options,
    headers,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  
  // Si la respuesta está vacía (204 No Content), devolver un objeto vacío
  if (res.status === 204) {
    return {} as T;
  }
  
  // Si es DELETE y no hay contenido, devolver un objeto con éxito
  if (options.method === "DELETE" && res.status === 200 && res.headers.get("content-length") === "0") {
    return { success: true } as T;
  }
  
  return await res.json();
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Obtener el token de autenticación
    const token = localStorage.getItem("adminToken");
    
    // Configurar las opciones de fetch
    const fetchOptions: RequestInit = {
      credentials: "include",
    };
    
    // Si hay token, incluirlo en los headers
    if (token) {
      fetchOptions.headers = {
        "Authorization": `Bearer ${token}`
      };
    }
    
    const res = await fetch(queryKey[0] as string, fetchOptions);

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
