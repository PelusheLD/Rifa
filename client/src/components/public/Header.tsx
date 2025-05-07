import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useState } from "react";

export default function Header() {
  const [_, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navigateTo = (path: string) => {
    setLocation(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-blue-900/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div 
            className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center cursor-pointer"
            onClick={() => navigateTo('/')}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-blue-900 w-5 h-5"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M3 10h18" />
              <path d="M7 15h.01" />
              <path d="M11 15h2" />
            </svg>
          </div>
          <h1 
            className="text-white text-xl font-bold cursor-pointer" 
            onClick={() => navigateTo('/')}
          >
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
                navigateTo('/');
              }}
            >
              Inicio
            </a>
            <a 
              href="/rifas-activas" 
              className="text-white hover:text-yellow-300 transition-colors text-sm font-medium"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('/rifas-activas');
              }}
            >
              Rifas Activas
            </a>
            <a 
              href="/ganadores" 
              className="text-white hover:text-yellow-300 transition-colors text-sm font-medium"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('/ganadores');
              }}
            >
              Ganadores
            </a>
            <a 
              href="/como-participar" 
              className="text-white hover:text-yellow-300 transition-colors text-sm font-medium"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('/como-participar');
              }}
            >
              Cómo Participar
            </a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Button 
              className="bg-blue-700 hover:bg-blue-600 text-white transition-all rounded-full px-5 py-2 text-sm font-medium border border-blue-600"
              onClick={() => navigateTo('/admin-aut')}
            >
              Administrador
            </Button>
          </div>
        </div>
        
        {/* Botón de menú móvil */}
        <button 
          className="md:hidden text-white bg-blue-800 p-2 rounded-lg hover:bg-blue-700 transition-colors"
          onClick={toggleMobileMenu}
          aria-label="Abrir menú"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="w-6 h-6"
          >
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>
      
      {/* Menú móvil desplegable */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-blue-800 border-t border-blue-700 shadow-lg">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex flex-col space-y-3">
              <a 
                href="/" 
                className="text-white hover:text-yellow-300 transition-colors py-2 px-3 rounded-lg hover:bg-blue-700 text-sm font-medium"
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo('/');
                }}
              >
                Inicio
              </a>
              <a 
                href="/rifas-activas" 
                className="text-white hover:text-yellow-300 transition-colors py-2 px-3 rounded-lg hover:bg-blue-700 text-sm font-medium"
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo('/rifas-activas');
                }}
              >
                Rifas Activas
              </a>
              <a 
                href="/ganadores" 
                className="text-white hover:text-yellow-300 transition-colors py-2 px-3 rounded-lg hover:bg-blue-700 text-sm font-medium"
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo('/ganadores');
                }}
              >
                Ganadores
              </a>
              <a 
                href="/como-participar" 
                className="text-white hover:text-yellow-300 transition-colors py-2 px-3 rounded-lg hover:bg-blue-700 text-sm font-medium"
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo('/como-participar');
                }}
              >
                Cómo Participar
              </a>
              <a 
                href="/admin-aut" 
                className="bg-yellow-400 text-blue-900 hover:bg-yellow-300 py-2 px-3 rounded-lg text-center text-sm font-medium"
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo('/admin-aut');
                }}
              >
                Administrador
              </a>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
