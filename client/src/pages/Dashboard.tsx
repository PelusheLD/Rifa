import { useEffect, useState, useRef } from "react";
import { useLocation, useRoute } from "wouter";
import Sidebar from "@/components/admin/Sidebar";
import ContentContainer from "@/components/admin/ContentContainer";
import MobileHeader from "@/components/admin/MobileHeader";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { isAuthenticated, loading } = useAuth();
  const [location, setLocation] = useLocation();
  const [_, params] = useRoute('/admin/:view*');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const { toast } = useToast();
  
  // Usamos useRef para rastrear si ya hemos realizado la redirección
  const hasRedirected = useRef(false);
  
  // Comprobar si el usuario está autenticado (evitando múltiples redirecciones)
  useEffect(() => {
    if (!loading && !isAuthenticated && !hasRedirected.current) {
      hasRedirected.current = true;
      toast({
        title: "Acceso denegado",
        description: "Debes iniciar sesión para acceder al panel de administración.",
        variant: "destructive"
      });
      setLocation('/admin-aut');
    }
  }, [isAuthenticated, loading, setLocation, toast]);

  // Establecer la vista activa según la URL (solo cuando params cambia)
  useEffect(() => {
    if (params && params['view*']) {
      const newView = params['view*'].split('/')[0];
      if (newView !== activeView) {
        setActiveView(newView);
      }
    }
  }, [params, activeView]);

  // Si está cargando, mostrar indicador de carga
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <i className="fas fa-circle-notch fa-spin text-primary-500 text-4xl mb-4"></i>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, no renderizar nada (la redirección se maneja en el useEffect)
  if (!isAuthenticated) {
    return null;
  }

  // Funciones para manejar el menú móvil
  const handleOpenMenu = () => setIsMobileMenuOpen(true);
  const handleCloseMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar activeView={activeView} />
      
      <MobileHeader 
        isOpen={isMobileMenuOpen} 
        onOpenMenu={handleOpenMenu}
        onCloseMenu={handleCloseMenu}
        activeView={activeView}
      />
      
      <ContentContainer activeView={activeView} />
    </div>
  );
}
