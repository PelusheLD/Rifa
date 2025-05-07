import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Header() {
  const [_, setLocation] = useLocation();

  return (
    <header className="bg-blue-900/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
            <i className="fas fa-ticket-alt text-blue-900 text-xl"></i>
          </div>
          <h1 className="text-white text-xl font-bold">
            <span className="text-yellow-400">
              RifasOnline
            </span>
          </h1>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <nav className="flex items-center space-x-6">
            <a 
              href="/" 
              className="text-white hover:text-yellow-300 transition-colors text-sm font-medium"
              onClick={(e) => {
                e.preventDefault();
                setLocation('/');
              }}
            >
              Inicio
            </a>
            <a 
              href="/rifas-activas" 
              className="text-white hover:text-yellow-300 transition-colors text-sm font-medium"
              onClick={(e) => {
                e.preventDefault();
                setLocation('/rifas-activas');
              }}
            >
              Rifas Activas
            </a>
            <a 
              href="/ganadores" 
              className="text-white hover:text-yellow-300 transition-colors text-sm font-medium"
              onClick={(e) => {
                e.preventDefault();
                setLocation('/ganadores');
              }}
            >
              Ganadores
            </a>
            <a 
              href="/como-participar" 
              className="text-white hover:text-yellow-300 transition-colors text-sm font-medium"
              onClick={(e) => {
                e.preventDefault();
                setLocation('/como-participar');
              }}
            >
              Cómo Participar
            </a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Button 
              className="bg-blue-700 hover:bg-blue-600 text-white transition-all rounded-full px-5 py-2 text-sm font-medium border border-blue-600"
              onClick={() => setLocation('/admin-aut')}
            >
              Administrador
            </Button>
            
            <Button 
              className="bg-yellow-400 text-blue-900 hover:bg-yellow-300 transition-all rounded-full px-5 py-2 text-sm font-medium shadow-md"
              onClick={() => {/* función para iniciar sesión */}}
            >
              Iniciar Sesión
            </Button>
          </div>
        </div>
        
        {/* Menú móvil */}
        <button className="md:hidden text-white bg-blue-800 p-2 rounded-lg hover:bg-blue-700 transition-colors">
          <i className="fas fa-bars"></i>
        </button>
      </div>
    </header>
  );
}
