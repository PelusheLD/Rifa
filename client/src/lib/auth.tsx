import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Definir la interfaz para el usuario
interface User {
  id: number;
  username: string;
  name: string;
}

// Definir la interfaz para el contexto de autenticación
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

// Crear un valor predeterminado para el contexto
const defaultAuthContext: AuthContextType = {
  isAuthenticated: false,
  user: null,
  loading: true,
  login: () => {},
  logout: () => {}
};

// Crear el contexto
const AuthContext = createContext<AuthContextType>(defaultAuthContext);

// Definir las propiedades del proveedor
interface AuthProviderProps {
  children: ReactNode;
}

// Definimos el AuthProvider como una función normal sin usar React.FC
export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Verificar el token al montar el componente
  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        const res = await fetch("/api/admin/verify", {
          headers: {
            "Authorization": `Bearer ${token}`
          },
          credentials: "include"
        });
        
        if (res.ok) {
          const data = await res.json();
          setIsAuthenticated(true);
          setUser(data.user);
        } else {
          localStorage.removeItem("adminToken");
        }
      } catch (error) {
        console.error("Error al verificar el token:", error);
        localStorage.removeItem("adminToken");
      } finally {
        setLoading(false);
      }
    };
    
    checkToken();
  }, []);

  // Función para iniciar sesión
  const login = (token: string, user: User) => {
    localStorage.setItem("adminToken", token);
    setIsAuthenticated(true);
    setUser(user);
  };

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem("adminToken");
    setIsAuthenticated(false);
    setUser(null);
  };

  // Crear el valor del contexto
  const value: AuthContextType = {
    isAuthenticated,
    user,
    loading,
    login,
    logout
  };

  // Retornar el proveedor con el valor del contexto
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para utilizar el contexto de autenticación
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
}