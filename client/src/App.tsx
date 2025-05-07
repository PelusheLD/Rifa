import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/HomePage";
import AdminLogin from "@/pages/AdminLogin";
// Importamos el Dashboard simplificado para evitar problemas de recursión
import SimpleDashboard from "@/pages/SimpleDashboard";
import { AuthProvider } from "@/lib/auth";
import React, { useEffect, useState } from "react";

function Router() {
  const [location, setLocation] = useLocation();
  const [redirected, setRedirected] = useState(false);

  // Redirigir al panel de control si ya está en /admin-aut y está autenticado
  // Utilizamos un estado para seguir si ya hemos redirigido para evitar bucles
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (location === '/admin-aut' && token && !redirected) {
      setRedirected(true); // Marcar como redirigido para evitar bucles
      setLocation('/admin/dashboard');
    } else if (location !== '/admin-aut') {
      setRedirected(false); // Resetear cuando cambiamos a otra ruta
    }
  }, [location, setLocation, redirected]);

  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/admin-aut" component={AdminLogin} />
      {/* Usar la versión simplificada del dashboard para todas las rutas admin */}
      <Route path="/admin/:view*" component={SimpleDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Envolver AuthProvider en un React.Fragment para evitar problemas de tipado
  return (
    <QueryClientProvider client={queryClient}>
      {/* No hay problemas con este componente ya que debe devolver un ReactNode */}
      <React.Fragment>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </React.Fragment>
    </QueryClientProvider>
  );
}

export default App;
