import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

// Definición de tipos más simple
type Raffle = {
  id: number;
  title: string;
  description: string;
  price: number;
  totalTickets: number;
  soldTickets: number;
  imageUrl: string;
  endDate: string;
  status: string;
};

type APIResponse = {
  data: Raffle[];
  pagination: {
    total: number;
  };
};

// Versión muy simplificada del dashboard para evitar bucles infinitos
export default function SimpleDashboard() {
  const { user, logout } = useAuth();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Query para obtener datos básicos
  const { data, isLoading } = useQuery<APIResponse>({
    queryKey: ['/api/raffles'],
    retry: 1,
    staleTime: 30000,
  });
  
  // Datos seguros para mostrar
  const raffles = data?.data || [];
  
  // Estadísticas básicas
  const stats = {
    activeRaffles: raffles.filter(r => r.status === 'activa').length,
    totalRaffles: raffles.length,
    participants: 0,
    income: "0.00"
  };

  const handleLogout = () => {
    logout();
    setLocation('/admin-aut');
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente."
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside 
        className={`bg-gray-900 text-white ${isSidebarOpen ? 'w-64' : 'w-20'} min-h-screen fixed transition-all duration-300 z-10`}
      >
        <div className="p-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            {isSidebarOpen ? (
              <>
                <i className="fas fa-ticket-alt text-primary-400 text-xl"></i>
                <span className="text-xl font-bold">RifasOnline</span>
              </>
            ) : (
              <i className="fas fa-ticket-alt text-primary-400 text-xl mx-auto"></i>
            )}
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className="text-gray-400 hover:text-white"
          >
            <i className={`fas ${isSidebarOpen ? 'fa-chevron-left' : 'fa-chevron-right'}`}></i>
          </button>
        </div>
        
        <Separator className="bg-gray-700" />
        
        <div className="py-4">
          <div className="px-4 py-2 mb-2">
            {isSidebarOpen ? (
              <div className="text-sm text-gray-400">
                Bienvenido,<br />
                <span className="font-semibold text-white">{user?.name || 'Administrador'}</span>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center">
                  {user?.name?.charAt(0) || 'A'}
                </div>
              </div>
            )}
          </div>
          
          <Separator className="bg-gray-700 my-2" />
          
          <nav>
            <button 
              className="w-full px-4 py-3 flex items-center space-x-3 text-white hover:bg-gray-800 transition-colors"
              onClick={() => setLocation('/admin/dashboard')}
            >
              <i className="fas fa-home text-gray-400"></i>
              {isSidebarOpen && <span>Inicio</span>}
            </button>
            
            <button 
              className="w-full px-4 py-3 flex items-center space-x-3 text-white hover:bg-gray-800 transition-colors"
              onClick={() => setLocation('/admin/rifas')}
            >
              <i className="fas fa-ticket-alt text-gray-400"></i>
              {isSidebarOpen && <span>Gestionar Rifas</span>}
            </button>
            
            <button 
              className="w-full px-4 py-3 flex items-center space-x-3 text-white hover:bg-gray-800 transition-colors"
              onClick={() => setLocation('/admin/participantes')}
            >
              <i className="fas fa-users text-gray-400"></i>
              {isSidebarOpen && <span>Participantes</span>}
            </button>
            
            <button 
              className="w-full px-4 py-3 flex items-center space-x-3 text-white hover:bg-gray-800 transition-colors"
              onClick={() => setLocation('/admin/ganadores')}
            >
              <i className="fas fa-trophy text-gray-400"></i>
              {isSidebarOpen && <span>Ganadores</span>}
            </button>
          </nav>
        </div>
        
        <div className="absolute bottom-0 w-full">
          <Separator className="bg-gray-700" />
          <button 
            className="w-full px-4 py-3 flex items-center space-x-3 text-white hover:bg-red-700 transition-colors"
            onClick={handleLogout}
          >
            <i className="fas fa-sign-out-alt text-gray-400"></i>
            {isSidebarOpen && <span>Cerrar sesión</span>}
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <div className={`${isSidebarOpen ? 'ml-64' : 'ml-20'} flex-1 transition-all duration-300`}>
        {/* Header para móvil */}
        <header className="bg-white p-4 shadow-sm md:hidden">
          <div className="flex justify-between items-center">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-500">
              <i className="fas fa-bars"></i>
            </button>
            <h1 className="text-lg font-semibold">RifasOnline</h1>
            <button onClick={handleLogout} className="text-gray-500">
              <i className="fas fa-sign-out-alt"></i>
            </button>
          </div>
        </header>
        
        <main className="p-6">
          <h1 className="text-2xl font-bold mb-6">Panel de Administración</h1>
          
          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-primary-100 text-primary-600">
                    <i className="fas fa-ticket-alt text-xl"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Rifas Activas</p>
                    <p className="text-3xl font-semibold text-gray-900">{stats.activeRaffles}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                    <i className="fas fa-list text-xl"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Rifas Totales</p>
                    <p className="text-3xl font-semibold text-gray-900">{stats.totalRaffles}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 text-green-600">
                    <i className="fas fa-users text-xl"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Participantes</p>
                    <p className="text-3xl font-semibold text-gray-900">{stats.participants}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                    <i className="fas fa-money-bill-wave text-xl"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Ingresos</p>
                    <p className="text-3xl font-semibold text-gray-900">${stats.income}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Lista de rifas */}
          <Card className="shadow-sm mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Rifas Recientes</h2>
                <button 
                  className="text-sm text-primary-600 hover:text-primary-800"
                  onClick={() => setLocation('/admin/rifas')}
                >
                  Ver todas
                </button>
              </div>
              <Separator className="mb-4" />
              
              {isLoading ? (
                <div className="text-center py-8">
                  <i className="fas fa-circle-notch fa-spin text-3xl text-gray-300 mb-2"></i>
                  <p className="text-gray-500">Cargando rifas...</p>
                </div>
              ) : raffles.length > 0 ? (
                <div className="space-y-4">
                  {raffles.slice(0, 5).map((raffle) => (
                    <div key={raffle.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        <div className="bg-primary-500 text-white p-2 rounded-lg">
                          <i className="fas fa-trophy"></i>
                        </div>
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-900">{raffle.title}</p>
                        <p className="text-xs text-gray-500">
                          {raffle.status === 'activa' ? 'Activa' : raffle.status === 'proxima' ? 'Próxima' : 'Finalizada'} 
                          - Finaliza: {new Date(raffle.endDate).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                      <div className="text-sm text-gray-500">
                        <span className="font-medium">{raffle.soldTickets}</span> / {raffle.totalTickets} boletos
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <i className="fas fa-ticket-alt text-4xl text-gray-300 mb-2"></i>
                  <p className="text-gray-500">No hay rifas para mostrar</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Acciones rápidas */}
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Acciones Rápidas</h2>
              <Separator className="mb-4" />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  className="p-4 bg-primary-50 hover:bg-primary-100 rounded-lg border border-primary-200 text-left"
                  onClick={() => setLocation('/admin/rifas')}
                >
                  <i className="fas fa-ticket-alt text-primary-500 text-lg mb-2"></i>
                  <h3 className="font-medium text-gray-900">Gestionar Rifas</h3>
                  <p className="text-sm text-gray-500">Crear, editar y administrar rifas</p>
                </button>
                
                <button 
                  className="p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 text-left"
                  onClick={() => setLocation('/admin/participantes')}
                >
                  <i className="fas fa-users text-green-500 text-lg mb-2"></i>
                  <h3 className="font-medium text-gray-900">Participantes</h3>
                  <p className="text-sm text-gray-500">Ver y gestionar participantes</p>
                </button>
                
                <button 
                  className="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg border border-yellow-200 text-left"
                  onClick={() => setLocation('/admin/ganadores')}
                >
                  <i className="fas fa-trophy text-yellow-500 text-lg mb-2"></i>
                  <h3 className="font-medium text-gray-900">Ganadores</h3>
                  <p className="text-sm text-gray-500">Ver y gestionar ganadores</p>
                </button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}