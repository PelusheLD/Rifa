import { useEffect, useState } from "react";
import { useLocation, useRoute, useRouter } from "wouter";
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
  
  // Comprobar si el usuario está autenticado
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      toast({
        title: "Acceso denegado",
        description: "Debes iniciar sesión para acceder al panel de administración.",
        variant: "destructive"
      });
      setLocation('/admin-aut');
    }
  }, [isAuthenticated, loading, setLocation, toast]);

  // Establecer la vista activa según la URL
  useEffect(() => {
    if (params?.view) {
      setActiveView(params.view.split('/')[0]);
    }
  }, [params]);

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

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar activeView={activeView} />
      
      <MobileHeader 
        isOpen={isMobileMenuOpen} 
        onOpenMenu={() => setIsMobileMenuOpen(true)}
        onCloseMenu={() => setIsMobileMenuOpen(false)}
        activeView={activeView}
      />
      
      <ContentContainer activeView={activeView} />
    </div>
  );
}
