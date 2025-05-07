import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import RaffleManager from "@/components/admin/RaffleManager";

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

// Tipo para la estructura de los tickets
type Ticket = {
  id: number;
  raffleId: number;
  number: number;
  cedula: string;
  name: string;
  email: string;
  phone: string;
  paymentStatus: string;
  reservationDate: string;
  paymentDate?: string;
};

// Tipo para la estructura de los ganadores
type Winner = {
  id: number;
  raffleId: number;
  winnerName: string;
  ticketNumber: number;
  prize: string;
  announcedDate: string;
  claimed: boolean;
};

// Componente para mostrar los tickets de una rifa específica
function TicketsListView({ raffleId, onBack }: { raffleId: number, onBack: () => void }) {
  const { data: tickets, isLoading } = useQuery<Ticket[]>({
    queryKey: [`/api/raffles/${raffleId}/tickets`],
    retry: 1,
    staleTime: 30000,
  });

  const { data: raffleData } = useQuery<Raffle>({
    queryKey: [`/api/raffles/${raffleId}`],
    retry: 1,
    staleTime: 30000,
  });
  
  return (
    <div>
      <div className="flex items-center mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="mr-2"
          onClick={onBack}
        >
          <i className="fas fa-arrow-left mr-2"></i>
          Volver
        </Button>
        <h2 className="text-xl font-bold">
          Participantes de: {raffleData?.title || `Rifa #${raffleId}`}
        </h2>
      </div>
      <Separator className="mb-4" />
      
      {isLoading ? (
        <div className="text-center py-8">
          <i className="fas fa-circle-notch fa-spin text-3xl text-gray-300 mb-2"></i>
          <p className="text-gray-500">Cargando participantes...</p>
        </div>
      ) : tickets && tickets.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cédula</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ticket.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.cedula}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.number}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      ticket.paymentStatus === 'pagado' 
                        ? 'bg-green-100 text-green-800' 
                        : ticket.paymentStatus === 'pendiente' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {ticket.paymentStatus === 'pagado' 
                        ? 'Pagado' 
                        : ticket.paymentStatus === 'pendiente' 
                          ? 'Pendiente' 
                          : 'Cancelado'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8">
          <i className="fas fa-users text-4xl text-gray-300 mb-2"></i>
          <p className="text-gray-500">No hay participantes para esta rifa</p>
        </div>
      )}
    </div>
  );
}

// Componente para la sección de Participantes
function ParticipantesView() {
  const [selectedRaffleId, setSelectedRaffleId] = useState<number | null>(null);
  
  // Si hay una rifa seleccionada, mostrar sus tickets
  if (selectedRaffleId) {
    return (
      <TicketsListView 
        raffleId={selectedRaffleId}
        onBack={() => setSelectedRaffleId(null)}
      />
    );
  }
  
  // Si no hay rifa seleccionada, mostrar la lista de rifas disponibles
  const { data: raffles, isLoading } = useQuery<Raffle[]>({
    queryKey: ['/api/raffles'],
    retry: 1,
    staleTime: 30000,
    select: (data: any) => data.data || [],
  });
  
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Participantes por Rifa</h2>
      <Separator className="mb-4" />
      
      {isLoading ? (
        <div className="text-center py-8">
          <i className="fas fa-circle-notch fa-spin text-3xl text-gray-300 mb-2"></i>
          <p className="text-gray-500">Cargando rifas...</p>
        </div>
      ) : raffles && raffles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {raffles.map(raffle => (
            <Card key={raffle.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedRaffleId(raffle.id)}>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
                    <i className="fas fa-ticket-alt text-xl text-blue-500"></i>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-1 truncate">{raffle.title}</h3>
                    <div className="flex items-center text-sm">
                      <span className="text-gray-500 mr-2">
                        <i className="fas fa-users mr-1"></i>
                        {raffle.soldTickets || 0} participantes
                      </span>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        raffle.status === 'activa' 
                          ? 'bg-green-100 text-green-800' 
                          : raffle.status === 'proxima'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}>
                        {raffle.status === 'activa' 
                          ? 'Activa' 
                          : raffle.status === 'proxima'
                            ? 'Próxima'
                            : 'Finalizada'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <i className="fas fa-ticket-alt text-4xl text-gray-300 mb-2"></i>
          <p className="text-gray-500">No hay rifas disponibles</p>
        </div>
      )}
    </div>
  );
}

// Componente para la sección de Ganadores
function GanadoresView() {
  const { data: winners, isLoading } = useQuery<Winner[]>({
    queryKey: ['/api/winners'],
    retry: 1,
    staleTime: 30000,
  });
  
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Ganadores</h2>
      <Separator className="mb-4" />
      
      {isLoading ? (
        <div className="text-center py-8">
          <i className="fas fa-circle-notch fa-spin text-3xl text-gray-300 mb-2"></i>
          <p className="text-gray-500">Cargando ganadores...</p>
        </div>
      ) : winners && winners.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rifa</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ganador</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Premio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {winners.map((winner) => (
                <tr key={winner.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{winner.raffleId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{winner.winnerName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{winner.ticketNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(winner.announcedDate).toLocaleDateString('es-ES')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{winner.prize}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      winner.claimed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {winner.claimed ? 'Reclamado' : 'Pendiente'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8">
          <i className="fas fa-trophy text-4xl text-gray-300 mb-2"></i>
          <p className="text-gray-500">No hay ganadores para mostrar</p>
        </div>
      )}
    </div>
  );
}

// Componente para el contenido del Dashboard
function DashboardContent({ stats, raffles, isLoading, setLocation }: any) {
  return (
    <>
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
              {raffles.slice(0, 5).map((raffle: any) => (
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
    </>
  );
}

// Versión muy simplificada del dashboard para evitar bucles infinitos
export default function SimpleDashboard() {
  const { user, logout } = useAuth();
  const [_, setLocation] = useLocation();
  const [match, params] = useRoute('/admin/:view');
  const { toast } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState('dashboard');
  
  // Actualizar la vista activa basado en la URL
  useEffect(() => {
    if (match && params.view) {
      setActiveView(params.view);
    }
  }, [match, params]);

  // Query para obtener datos básicos
  const { data, isLoading } = useQuery<APIResponse>({
    queryKey: ['/api/raffles'],
    retry: 1,
    staleTime: 30000,
  });
  
  // Datos seguros para mostrar
  const raffles = data?.data || [];
  
  // Cálculo de datos reales para estadísticas
  const activeRaffles = raffles.filter(r => r.status === 'activa').length;
  const totalRaffles = raffles.length;
  const participants = useQuery({
    queryKey: ['/api/tickets'],
    retry: 1,
    staleTime: 30000,
    select: (data: any) => {
      // Obtenemos tickets únicos basados en la cédula
      const uniqueParticipants = new Set();
      data.forEach((ticket: any) => {
        if (ticket.cedula) {
          uniqueParticipants.add(ticket.cedula);
        }
      });
      return uniqueParticipants.size;
    }
  });
  
  // Cálculo de ingresos basado en tickets vendidos
  const income = raffles.reduce((acc, raffle) => {
    return acc + raffle.price * raffle.soldTickets;
  }, 0);

  // Estadísticas basadas en datos reales
  const stats = {
    activeRaffles,
    totalRaffles,
    participants: participants.data || 0,
    income: income.toFixed(2)
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
          <h1 className="text-2xl font-bold mb-6">
            {activeView === 'dashboard' && 'Panel de Administración'}
            {activeView === 'rifas' && 'Gestión de Rifas'}
            {activeView === 'participantes' && 'Gestión de Participantes'}
            {activeView === 'ganadores' && 'Gestión de Ganadores'}
          </h1>
          
          {/* Contenido según la vista seleccionada */}
          {activeView === 'dashboard' && (
            <>
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
            </>
          )}
          
          {/* Vista de Gestión de Rifas */}
          {activeView === 'rifas' && <RaffleManager />}
          
          {/* Vista de Participantes */}
          {activeView === 'participantes' && <ParticipantesView />}
          
          {/* Vista de Ganadores */}
          {activeView === 'ganadores' && <GanadoresView />}
        </main>
      </div>
    </div>
  );
}