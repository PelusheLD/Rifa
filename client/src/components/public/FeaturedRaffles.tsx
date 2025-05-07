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

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Rifas Destacadas</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // Estado de carga con skeletons
            Array(3).fill(0).map((_, idx) => (
              <Card key={idx} className="overflow-hidden hover:shadow-lg transition">
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
              <Card key={raffle.id} className="overflow-hidden hover:shadow-lg transition">
                <img 
                  src={raffle.imageUrl || "https://images.unsplash.com/photo-1594077449791-15714a33e895?auto=format&fit=crop&w=600&h=350"} 
                  alt={`Premio: ${raffle.title}`} 
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1594077449791-15714a33e895?auto=format&fit=crop&w=600&h=350";
                  }}
                />
                <CardContent className="p-6">
                  <Badge className="bg-green-100 text-green-800 mb-3">
                    {raffle.status === 'activa' ? 'Activa' : 
                     raffle.status === 'proxima' ? 'Próxima' : 'Finalizada'}
                  </Badge>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{raffle.title}</h3>
                  <p className="text-gray-600 mb-4">{raffle.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-primary-600 font-bold">{formatCurrency(raffle.price)}</span>
                    <span className="text-gray-500 text-sm">{formatDate(raffle.endDate)}</span>
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 rounded-lg transition">
                    Comprar boleto
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            // Mostrar placeholders si no hay rifas
            <div className="col-span-3 text-center py-8">
              <p className="text-gray-500 mb-4">No hay rifas activas en este momento.</p>
              <p className="text-gray-600">¡Vuelve pronto para ver nuevas oportunidades!</p>
            </div>
          )}
        </div>
        
        <div className="mt-12 text-center">
          <Button 
            className="px-6 py-3 bg-primary-100 text-primary-700 rounded-lg font-semibold hover:bg-primary-200 transition"
            variant="outline"
            size="lg"
          >
            Ver todas las rifas disponibles
          </Button>
        </div>
      </div>
    </div>
  );
}
