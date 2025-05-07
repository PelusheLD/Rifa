import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/HomePage";
import AdminLogin from "@/pages/AdminLogin";
import Dashboard from "@/pages/Dashboard";
import { AuthProvider } from "@/lib/auth";
import { useEffect } from "react";

function Router() {
  const [location, setLocation] = useLocation();

  // Redirigir al panel de control si ya está en /admin-aut y está autenticado
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (location === '/admin-aut' && token) {
      setLocation('/admin/dashboard');
    }
  }, [location, setLocation]);

  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/admin-aut" component={AdminLogin} />
      <Route path="/admin/:view*" component={Dashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
