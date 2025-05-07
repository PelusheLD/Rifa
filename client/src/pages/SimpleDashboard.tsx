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
    setLocation('/');
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente."
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header fijo */}
      <header className="bg-gray-900 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <i className="fas fa-ticket-alt text-primary-400 text-xl"></i>
            <span className="text-xl font-bold">RifasOnline</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-1">
              <span>Hola, {user?.name || 'Administrador'}</span>
            </div>
            <button 
              className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Panel de Administración</h1>
        
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-md">
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
          
          <Card className="shadow-md">
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
          
          <Card className="shadow-md">
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
          
          <Card className="shadow-md">
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
        <Card className="shadow-md mb-8">
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
        
        {/* Enlaces rápidos */}
        <Card className="shadow-md">
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
  );
}