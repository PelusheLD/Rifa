import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import RaffleManager from "./RaffleManager";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";

interface ContentContainerProps {
  activeView: string;
}

type RaffleData = {
  id: number;
  title: string;
  description: string;
  price: number;
  totalTickets: number;
  soldTickets: number;
  imageUrl: string;
  prizeId: string;
  endDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

interface RafflesResponse {
  data: RaffleData[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export default function ContentContainer({ activeView }: ContentContainerProps) {
  const { user } = useAuth();
  const [viewTitle, setViewTitle] = useState("Dashboard");

  // Obtener estadísticas para el dashboard
  const { data: rafflesData } = useQuery<RafflesResponse>({
    queryKey: ['/api/raffles'],
    enabled: activeView === 'dashboard',
  });

  // Establecer el título de la vista actual
  useEffect(() => {
    switch(activeView) {
      case 'dashboard':
        setViewTitle('Dashboard');
        break;
      case 'rifas':
        setViewTitle('Gestionar Rifas');
        break;
      case 'ganadores':
        setViewTitle('Ganadores');
        break;
      case 'participantes':
        setViewTitle('Participantes');
        break;
      case 'ventas':
        setViewTitle('Ventas');
        break;
      case 'perfil':
        setViewTitle('Perfil');
        break;
      case 'system':
        setViewTitle('Sistema');
        break;
      default:
        setViewTitle('Dashboard');
    }
  }, [activeView]);

  // Calcular estadísticas para el dashboard
  const stats = {
    activeRaffles: rafflesData?.data?.filter((r) => r.status === 'activa')?.length || 0,
    participants: 0, // En una implementación real, esto vendría de una consulta al API
    monthlyIncome: "0.00", // En una implementación real, esto vendría de una consulta al API
    deliveredPrizes: 0 // En una implementación real, esto vendría de una consulta al API
  };

  return (
    <div className="flex-1 md:ml-64 pt-16 md:pt-0 max-w-full">
      {/* Header */}
      <header className="bg-white shadow h-16 flex items-center justify-between px-6 hidden md:flex">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">{viewTitle}</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button className="text-gray-500 focus:outline-none">
              <i className="fas fa-bell"></i>
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-gray-700">{user?.name || 'Administrador'}</span>
          </div>
        </div>
      </header>
      
      {/* Content */}
      <main className="p-4 md:p-6 w-full overflow-x-hidden">
        {activeView === 'dashboard' && (
          <div className="animated fadeIn w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
              <Card>
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-center">
                    <div className="p-2 lg:p-3 rounded-full bg-primary-100 text-primary-600">
                      <i className="fas fa-ticket-alt text-lg lg:text-xl"></i>
                    </div>
                    <div className="ml-3 lg:ml-4">
                      <p className="text-xs lg:text-sm font-medium text-gray-500">Rifas Activas</p>
                      <p className="text-2xl lg:text-3xl font-semibold text-gray-900">{stats.activeRaffles}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-center">
                    <div className="p-2 lg:p-3 rounded-full bg-green-100 text-green-600">
                      <i className="fas fa-user-friends text-lg lg:text-xl"></i>
                    </div>
                    <div className="ml-3 lg:ml-4">
                      <p className="text-xs lg:text-sm font-medium text-gray-500">Participantes</p>
                      <p className="text-2xl lg:text-3xl font-semibold text-gray-900">{stats.participants}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-center">
                    <div className="p-2 lg:p-3 rounded-full bg-yellow-100 text-yellow-600">
                      <i className="fas fa-money-bill-wave text-lg lg:text-xl"></i>
                    </div>
                    <div className="ml-3 lg:ml-4">
                      <p className="text-xs lg:text-sm font-medium text-gray-500">Ingresos del Mes</p>
                      <p className="text-2xl lg:text-3xl font-semibold text-gray-900">${stats.monthlyIncome}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-center">
                    <div className="p-2 lg:p-3 rounded-full bg-purple-100 text-purple-600">
                      <i className="fas fa-trophy text-lg lg:text-xl"></i>
                    </div>
                    <div className="ml-3 lg:ml-4">
                      <p className="text-xs lg:text-sm font-medium text-gray-500">Premios Entregados</p>
                      <p className="text-2xl lg:text-3xl font-semibold text-gray-900">{stats.deliveredPrizes}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              <Card>
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-center justify-between mb-3 lg:mb-4">
                    <h3 className="text-base lg:text-lg font-semibold text-gray-900">Ventas Recientes</h3>
                    <button className="text-xs lg:text-sm font-medium text-primary-600 hover:text-primary-800 transition-colors">
                      Ver todas
                    </button>
                  </div>
                  
                  <div className="text-center py-8 lg:py-12 text-gray-500">
                    <i className="fas fa-ticket-alt text-3xl lg:text-4xl mb-3 lg:mb-4 opacity-30"></i>
                    <p>No hay ventas recientes para mostrar</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-center justify-between mb-3 lg:mb-4">
                    <h3 className="text-base lg:text-lg font-semibold text-gray-900">Próximas Rifas</h3>
                    <button className="text-xs lg:text-sm font-medium text-primary-600 hover:text-primary-800 transition-colors">
                      Ver todas
                    </button>
                  </div>
                  
                  {rafflesData?.data?.length > 0 ? (
                    <div className="space-y-3 lg:space-y-4">
                      {rafflesData.data.slice(0, 4).map((raffle: any) => (
                        <div key={raffle.id} className="flex items-center p-2 lg:p-3 bg-gray-50 rounded-lg">
                          <div className="flex-shrink-0">
                            <div className="bg-primary-500 text-white p-1.5 lg:p-2 rounded-lg">
                              <i className="fas fa-trophy"></i>
                            </div>
                          </div>
                          <div className="ml-2 lg:ml-3 flex-1">
                            <p className="text-xs lg:text-sm font-medium text-gray-900">{raffle.title}</p>
                            <p className="text-xs text-gray-500">
                              Finaliza el {new Date(raffle.endDate).toLocaleDateString('es-ES')}
                            </p>
                          </div>
                          <div className="text-xs lg:text-sm text-gray-500">
                            <span className="font-medium">{raffle.soldTickets}</span> boletos vendidos
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 lg:py-12 text-gray-500">
                      <i className="fas fa-calendar text-3xl lg:text-4xl mb-3 lg:mb-4 opacity-30"></i>
                      <p>No hay próximas rifas para mostrar</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
        
        {activeView === 'rifas' && (
          <RaffleManager />
        )}
        
        {(activeView === 'ganadores' || 
          activeView === 'participantes' || 
          activeView === 'ventas' || 
          activeView === 'perfil' || 
          activeView === 'system') && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{viewTitle}</h2>
              <Separator className="my-4" />
              <div className="text-center py-12">
                <i className="fas fa-tools text-4xl mb-4 text-gray-300"></i>
                <p className="text-gray-500">Esta sección está en desarrollo</p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
