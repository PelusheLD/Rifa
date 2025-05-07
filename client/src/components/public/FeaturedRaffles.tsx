import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface FeaturedRafflesProps {
  raffles: any[];
  isLoading: boolean;
}

export default function FeaturedRaffles({ raffles, isLoading }: FeaturedRafflesProps) {
  const formatCurrency = (amount: number) => {
    return `$${amount} MXN / boleto`;
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

  return (
    <div className="bg-gray-100 py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-4 relative inline-block">
            Rifas Destacadas
            <span className="absolute bottom-0 left-0 w-full h-1 bg-primary-500 transform -translate-y-2"></span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Participa en nuestras mejores rifas activas y consigue increíbles premios
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            // Estado de carga con skeletons
            Array(3).fill(0).map((_, idx) => (
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
                        className="bg-primary-600 h-2.5 rounded-full" 
                        style={{ width: `${Math.min(100, (raffle.soldTickets / raffle.totalTickets) * 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{raffle.soldTickets} boletos vendidos</span>
                      <span>de {raffle.totalTickets}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-primary-600 font-bold">{formatCurrency(raffle.price)}</span>
                    <span className="text-gray-500 text-sm">{formatDate(raffle.endDate)}</span>
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Button 
                    className="w-full bg-blue-700 hover:bg-blue-600 text-white font-medium py-2 rounded-lg transition-all border border-blue-600"
                    onClick={() => window.location.href = `/comprar-boleto/${raffle.id}`}
                  >
                    Comprar boleto
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            // Mostrar placeholders si no hay rifas
            <div className="col-span-3 text-center py-12 bg-gray-50 rounded-lg">
              <div className="mb-4 text-gray-400">
                <i className="fas fa-ticket-alt text-6xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay rifas activas</h3>
              <p className="text-gray-500">¡Vuelve pronto para ver nuevas oportunidades!</p>
            </div>
          )}
        </div>
        
        <div className="mt-16 text-center">
          <Button 
            className="px-8 py-3 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all border border-blue-500 shadow-md"
            size="lg"
          >
            Ver todas las rifas disponibles
          </Button>
        </div>
      </div>
    </div>
  );
}
