import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";

// Definir tipos para las rifas
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

export default function RifasActivasPage() {
  const [_, setLocation] = useLocation();
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('activa'); // 'activa', 'proxima', 'finalizada', o 'todas'
  const limit = 6;

  // Obtener las rifas
  const { data: rafflesData, isLoading } = useQuery<RafflesResponse>({
    queryKey: [`/api/raffles?filter=${filter}&page=${page}&limit=${limit}`],
    staleTime: 60000, // 1 minuto
  });

  const raffles = rafflesData?.data || [];
  const totalPages = rafflesData?.pagination?.totalPages || 1;

  const formatCurrency = (amount: number) => {
    return `${amount} $ / boleto`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `Finaliza: ${date.toLocaleDateString('es-ES')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'activa':
        return "bg-green-100 text-green-800 border border-green-200";
      case 'proxima':
        return "bg-blue-100 text-blue-800 border border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    setPage(1);
  };

  const handleComprarBoleto = (raffleId: number) => {
    setLocation(`/comprar-boleto/${raffleId}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="bg-gradient-to-r from-blue-700 to-blue-900">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold text-white mb-6">Rifas Disponibles</h1>
          <p className="text-white/90 max-w-2xl mx-auto mb-8">
            Explora todas nuestras rifas y encuentra las mejores oportunidades para ganar grandes premios.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <Button 
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === 'todas' ? 'bg-white text-blue-900' : 'bg-white/10 text-white hover:bg-white/20'}`}
              onClick={() => handleFilterChange('todas')}
            >
              Todas
            </Button>
            <Button 
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === 'activa' ? 'bg-white text-blue-900' : 'bg-white/10 text-white hover:bg-white/20'}`}
              onClick={() => handleFilterChange('activa')}
            >
              Activas
            </Button>
            <Button 
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === 'proxima' ? 'bg-white text-blue-900' : 'bg-white/10 text-white hover:bg-white/20'}`}
              onClick={() => handleFilterChange('proxima')}
            >
              Próximas
            </Button>
            <Button 
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === 'finalizada' ? 'bg-white text-blue-900' : 'bg-white/10 text-white hover:bg-white/20'}`}
              onClick={() => handleFilterChange('finalizada')}
            >
              Finalizadas
            </Button>
          </div>
        </div>
      </div>

      <div className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {isLoading ? (
              // Estado de carga con skeletons
              Array(6).fill(0).map((_, idx) => (
                <Card key={idx} className="overflow-hidden hover:shadow-xl transition border border-gray-200">
                  <Skeleton className="w-full h-48" />
                  <CardContent className="p-6">
                    <Skeleton className="h-5 w-24 rounded-full mb-3" />
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-5 w-28" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-10 w-full mt-4" />
                  </CardContent>
                </Card>
              ))
            ) : raffles.length > 0 ? (
              // Mostrar las rifas si hay datos
              raffles.map((raffle) => (
                <Card key={raffle.id} className="overflow-hidden hover:shadow-xl transition border border-gray-200">
                  <div className="relative">
                    <img 
                      src={raffle.imageUrl || "https://images.unsplash.com/photo-1594077449791-15714a33e895?auto=format&fit=crop&w=600&h=350"} 
                      alt={`Premio: ${raffle.title}`} 
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1594077449791-15714a33e895?auto=format&fit=crop&w=600&h=350";
                      }}
                    />
                    <Badge className={`absolute top-3 right-3 ${getStatusColor(raffle.status)}`}>
                      {raffle.status === 'activa' ? 'Activa' : 
                       raffle.status === 'proxima' ? 'Próxima' : 'Finalizada'}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{raffle.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{raffle.description}</p>
                    <div className="flex flex-col space-y-2">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-blue-700 h-2.5 rounded-full" 
                          style={{ width: `${Math.min(100, (raffle.soldTickets / raffle.totalTickets) * 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>{raffle.soldTickets} boletos vendidos</span>
                        <span>de {raffle.totalTickets}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-blue-700 font-bold">{formatCurrency(raffle.price)}</span>
                      <span className="text-gray-500 text-sm">{formatDate(raffle.endDate)}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="p-6 pt-0">
                    <Button 
                      className={`w-full ${raffle.status === 'activa' 
                        ? 'bg-blue-700 hover:bg-blue-600 text-white' 
                        : 'bg-gray-300 hover:bg-gray-200 text-gray-700 cursor-not-allowed'} 
                        font-medium py-2 rounded-lg transition-all border ${raffle.status === 'activa' ? 'border-blue-600' : 'border-gray-300'}`}
                      onClick={() => raffle.status === 'activa' && handleComprarBoleto(raffle.id)}
                      disabled={raffle.status !== 'activa'}
                    >
                      {raffle.status === 'activa' ? 'Comprar boleto' : 
                        raffle.status === 'proxima' ? 'Próximamente' : 'Finalizada'}
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              // Mostrar placeholders si no hay rifas
              <div className="col-span-3 text-center py-16 bg-white rounded-lg border border-gray-200">
                <div className="mb-4 text-gray-400">
                  <i className="fas fa-ticket-alt text-6xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay rifas disponibles</h3>
                <p className="text-gray-500 mb-6">No se encontraron rifas para los criterios seleccionados.</p>
                <Button 
                  className="bg-blue-700 text-white hover:bg-blue-600 px-4 py-2 rounded-lg"
                  onClick={() => handleFilterChange('todas')}
                >
                  Ver todas las rifas
                </Button>
              </div>
            )}
          </div>

          {!isLoading && raffles.length > 0 && totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => page > 1 && handlePageChange(page - 1)}
                    className={page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} 
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <PaginationItem key={idx}>
                    <PaginationLink 
                      isActive={page === idx + 1} 
                      onClick={() => handlePageChange(idx + 1)}
                      className="cursor-pointer"
                    >
                      {idx + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => page < totalPages && handlePageChange(page + 1)}
                    className={page >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"} 
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}