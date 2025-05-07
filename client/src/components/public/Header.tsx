import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Header() {
  const [_, setLocation] = useLocation();

  return (
    <header className="bg-white/5 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
            <i className="fas fa-ticket-alt text-white text-xl"></i>
          </div>
          <h1 className="text-white text-xl font-bold">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
              RifasOnline
            </span>
          </h1>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <nav className="flex items-center space-x-6">
            <a href="#" className="text-white/80 hover:text-white transition-colors text-sm font-medium">Inicio</a>
            <a href="#" className="text-white/80 hover:text-white transition-colors text-sm font-medium">Rifas Activas</a>
            <a href="#" className="text-white/80 hover:text-white transition-colors text-sm font-medium">Ganadores</a>
            <a href="#" className="text-white/80 hover:text-white transition-colors text-sm font-medium">Contacto</a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Button 
              className="bg-white/10 hover:bg-white/20 text-white transition-all rounded-full px-5 py-2 text-sm font-medium"
              variant="ghost"
              onClick={() => setLocation('/admin-aut')}
            >
              Administrador
            </Button>
            
            <Button 
              className="bg-white text-primary-600 hover:bg-gray-100 transition-all rounded-full px-5 py-2 text-sm font-medium shadow-md"
              onClick={() => {/* función para iniciar sesión */}}
            >
              Iniciar Sesión
            </Button>
          </div>
        </div>
        
        {/* Menú móvil */}
        <button className="md:hidden text-white bg-white/10 p-2 rounded-lg hover:bg-white/20 transition-colors">
          <i className="fas fa-bars"></i>
        </button>
      </div>
    </header>
  );
}
