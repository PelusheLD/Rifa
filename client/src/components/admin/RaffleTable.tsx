import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

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

interface RaffleTableProps {
  raffles: RaffleData[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  isLoading: boolean;
  onEdit: (raffle: RaffleData) => void;
  onPageChange: (page: number) => void;
}

export default function RaffleTable({ 
  raffles, 
  pagination, 
  isLoading,
  onEdit,
  onPageChange
}: RaffleTableProps) {
  const { toast } = useToast();

  const handleDelete = async (id: number) => {
    try {
      // Mostrar mensaje de carga
      toast({
        title: "Procesando",
        description: "Eliminando la rifa...",
      });
      
      await apiRequest(`/api/raffles/${id}`, {
        method: "DELETE"
      });
      
      // Invalidar la caché para recargar los datos
      await queryClient.invalidateQueries({ queryKey: ['/api/raffles'] });
      
      // Esperar un momento para que se complete la actualización
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: "Rifa eliminada",
        description: "La rifa ha sido eliminada correctamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la rifa. Intente de nuevo.",
        variant: "destructive"
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return `$${amount} MXN`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'activa':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Activa</Badge>;
      case 'proxima':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Próxima</Badge>;
      case 'finalizada':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Finalizada</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Boletos</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Sorteo</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array(5).fill(0).map((_, idx) => (
              <tr key={idx}>
                <td className="px-4 py-3 whitespace-nowrap"><Skeleton className="h-4 w-10" /></td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <Skeleton className="h-10 w-10 rounded-lg" />
                    </div>
                    <div className="ml-4">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-24 mt-1" />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap"><Skeleton className="h-4 w-16" /></td>
                <td className="px-4 py-3 whitespace-nowrap"><Skeleton className="h-4 w-16" /></td>
                <td className="px-4 py-3 whitespace-nowrap"><Skeleton className="h-4 w-24" /></td>
                <td className="px-4 py-3 whitespace-nowrap"><Skeleton className="h-5 w-16 rounded-full" /></td>
                <td className="px-4 py-3 whitespace-nowrap"><Skeleton className="h-4 w-24" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Boletos</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Sorteo</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {raffles.length > 0 ? (
              raffles.map((raffle) => (
                <tr key={raffle.id}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">#{raffle.id}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img 
                          className="h-10 w-10 rounded-lg object-cover" 
                          src={raffle.imageUrl || "https://via.placeholder.com/150"} 
                          alt={raffle.title}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://via.placeholder.com/150";
                          }}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{raffle.title}</div>
                        <div className="text-sm text-gray-500">ID: {raffle.prizeId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(raffle.price)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {raffle.soldTickets} / {raffle.totalTickets}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(raffle.endDate)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {getStatusBadge(raffle.status)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-primary-600 hover:text-primary-800"
                        onClick={() => onEdit(raffle)}
                      >
                        <i className="fas fa-edit"></i>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-gray-600 hover:text-gray-800"
                      >
                        <i className="fas fa-eye"></i>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-red-600 hover:text-red-800"
                          >
                            <i className="fas fa-trash"></i>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción eliminará permanentemente la rifa "{raffle.title}". 
                              Esta acción no se puede deshacer.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-600 text-white hover:bg-red-700"
                              onClick={() => handleDelete(raffle.id)}
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                  No hay rifas para mostrar
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {pagination.total > 0 && (
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
          <div className="flex flex-1 justify-between sm:hidden">
            <Button
              variant="outline"
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
            >
              Siguiente
            </Button>
          </div>
          
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Mostrando <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> a <span className="font-medium">
                  {Math.min(pagination.page * pagination.limit, pagination.total)}
                </span> de <span className="font-medium">{pagination.total}</span> resultados
              </p>
            </div>
            
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <Button
                  variant="outline"
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  onClick={() => onPageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                >
                  <span className="sr-only">Anterior</span>
                  <i className="fas fa-chevron-left"></i>
                </Button>
                
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter(page => 
                    page === 1 || 
                    page === pagination.totalPages || 
                    (page >= pagination.page - 1 && page <= pagination.page + 1)
                  )
                  .map((page, idx, array) => {
                    // Agregar puntos suspensivos si hay saltos en la paginación
                    if (idx > 0 && page - array[idx - 1] > 1) {
                      return [
                        <span 
                          key={`ellipsis-${page}`}
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                        >
                          ...
                        </span>,
                        <Button
                          key={page}
                          variant={pagination.page === page ? "default" : "outline"}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            pagination.page === page 
                              ? "z-10 bg-primary-50 border-primary-500 text-primary-600" 
                              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                          }`}
                          onClick={() => onPageChange(page)}
                        >
                          {page}
                        </Button>
                      ];
                    }
                    
                    return (
                      <Button
                        key={page}
                        variant={pagination.page === page ? "default" : "outline"}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          pagination.page === page 
                            ? "z-10 bg-primary-50 border-primary-500 text-primary-600" 
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                        onClick={() => onPageChange(page)}
                      >
                        {page}
                      </Button>
                    );
                  })}
                
                <Button
                  variant="outline"
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  onClick={() => onPageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                >
                  <span className="sr-only">Siguiente</span>
                  <i className="fas fa-chevron-right"></i>
                </Button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
