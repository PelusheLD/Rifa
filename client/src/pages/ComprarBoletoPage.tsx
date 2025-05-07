import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious, PaginationLink } from "@/components/ui/pagination";

type RaffleData = {
  id: number;
  title: string;
  description: string;
  price: number;
  totalTickets: number;
  soldTickets: number;
  imageUrl: string;
  endDate: string;
  status: string;
  createdAt: string;
};

// Simulación de boletos ocupados/vendidos para demostración
const SOLD_TICKETS = [1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500];

export default function ComprarBoletoPage() {
  const params = useParams();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const raffleId = params.id ? parseInt(params.id) : 0;
  
  // Estado para la paginación de números
  const [currentPage, setCurrentPage] = useState(1);
  const numbersPerPage = 1000; // Mostrar 1000 números por página
  
  // Estado para los números seleccionados
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  
  // Estado para la información del comprador
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cedula: ''
  });

  // Obtener detalles de la rifa específica
  const { data: raffle, isLoading, isError } = useQuery<RaffleData>({
    queryKey: [`/api/raffles/${raffleId}`],
    staleTime: 60000, // 1 minuto
    enabled: !!raffleId,
  });

  // Calcular números totales y páginas
  const totalNumbers = raffle?.totalTickets || 0;
  const totalPages = Math.ceil(totalNumbers / numbersPerPage);
  
  // Calcular el rango de números para la página actual
  const startNumber = (currentPage - 1) * numbersPerPage + 1;
  const endNumber = Math.min(currentPage * numbersPerPage, totalNumbers);
  
  // Generar el rango de números para la página actual
  const getNumbersRange = () => {
    const numbers = [];
    for (let i = startNumber; i <= endNumber; i++) {
      numbers.push(i);
    }
    return numbers;
  };
  
  // Verificar si un número está vendido (simulación)
  const isNumberSold = (number: number) => {
    return SOLD_TICKETS.includes(number);
  };
  
  // Verificar si un número está seleccionado
  const isNumberSelected = (number: number) => {
    return selectedNumbers.includes(number);
  };
  
  // Manejar la selección de un número
  const toggleNumberSelection = (number: number) => {
    if (isNumberSold(number)) return; // No permitir seleccionar números ya vendidos
    
    if (isNumberSelected(number)) {
      // Deseleccionar el número
      setSelectedNumbers(prev => prev.filter(n => n !== number));
    } else {
      // Seleccionar el número
      setSelectedNumbers(prev => [...prev, number]);
    }
  };

  // Manejar cambio de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Manejar cambios en el formulario
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Calcular el precio total
  const calculateTotal = () => {
    if (!raffle) return 0;
    return raffle.price * selectedNumbers.length;
  };

  // Función para reservar boletos en la base de datos
  const reserveTickets = async () => {
    try {
      // Para cada número seleccionado, crear un registro en la base de datos
      const reservationPromises = selectedNumbers.map(number => {
        return fetch('/api/tickets', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            raffleId: raffleId,
            number: number,
            cedula: formData.cedula,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            paymentStatus: 'pendiente'
          })
        }).then(res => {
          if (!res.ok) {
            throw new Error(`Error al reservar el número ${number}`);
          }
          return res.json();
        });
      });
      
      // Esperar a que todas las reservas se completen
      await Promise.all(reservationPromises);
      
      return true;
    } catch (error) {
      console.error("Error al reservar boletos:", error);
      toast({
        title: "Error al reservar números",
        description: "Hubo un problema al reservar tus números. Por favor, intenta de nuevo.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación simple
    if (!formData.name || !formData.email || !formData.phone || !formData.cedula) {
      toast({
        title: "Error en el formulario",
        description: "Por favor, completa todos los campos obligatorios.",
        variant: "destructive"
      });
      return;
    }
    
    if (selectedNumbers.length === 0) {
      toast({
        title: "No hay números seleccionados",
        description: "Por favor, selecciona al menos un número para participar.",
        variant: "destructive"
      });
      return;
    }
    
    // Mostrar estado de carga
    toast({
      title: "Procesando tu solicitud",
      description: "Estamos reservando tus números...",
      variant: "default"
    });
    
    // Guardar la información en la base de datos
    const success = await reserveTickets();
    
    // Si se guardó correctamente, dirigir a WhatsApp para finalizar la compra
    if (success) {
      // Crear mensaje para WhatsApp
      const message = `Hola, he apartado los siguientes números para la rifa "${raffle?.title}": ${selectedNumbers.join(', ')}. Mis datos: Nombre: ${formData.name}, Cédula: ${formData.cedula}, Teléfono: ${formData.phone}, Email: ${formData.email}. Total a pagar: $${calculateTotal()} MXN`;
      
      // Encode el mensaje para URL de WhatsApp
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/+5212345678?text=${encodedMessage}`;
      
      // Abrir WhatsApp en nueva ventana
      window.open(whatsappUrl, '_blank');
      
      // Mostrar mensaje de éxito
      toast({
        title: "¡Números apartados!",
        description: `Has apartado ${selectedNumbers.length} número(s) para la rifa "${raffle?.title}". Se abrirá WhatsApp para finalizar tu compra.`,
        variant: "default"
      });
      
      // Redirigir a la página principal después de 3 segundos
      setTimeout(() => {
        setLocation('/');
      }, 3000);
    }
  };

  // Si no hay un ID válido, redireccionar
  useEffect(() => {
    if (raffleId === 0) {
      setLocation('/rifas-activas');
    }
  }, [raffleId, setLocation]);

  // Si hay un error al cargar la rifa o la rifa no está activa
  useEffect(() => {
    if (isError || (raffle && raffle.status !== 'activa')) {
      toast({
        title: "No disponible",
        description: "Esta rifa no está disponible actualmente.",
        variant: "destructive"
      });
      setLocation('/rifas-activas');
    }
  }, [isError, raffle, setLocation, toast]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="bg-gradient-to-r from-blue-700 to-blue-900">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Comprar Boletos</h1>
          <p className="text-white/90">Completa el formulario para participar en la rifa</p>
        </div>
      </div>

      <div className="py-12 bg-gray-100 flex-1">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-700"></div>
            </div>
          ) : raffle ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Información de la Rifa */}
              <div className="lg:col-span-1">
                <Card className="overflow-hidden border border-gray-200">
                  <img 
                    src={raffle.imageUrl || "https://images.unsplash.com/photo-1594077449791-15714a33e895?auto=format&fit=crop&w=600&h=350"} 
                    alt={`Premio: ${raffle.title}`}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1594077449791-15714a33e895?auto=format&fit=crop&w=600&h=350";
                    }}
                  />
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">{raffle.title}</h2>
                    <p className="text-gray-600 mb-4">{raffle.description}</p>
                    
                    <div className="flex flex-col space-y-2 mb-4">
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
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700">Precio por boleto:</span>
                        <span className="text-blue-700 font-bold">${raffle.price} MXN</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700">Fecha de finalización:</span>
                        <span className="text-gray-800">{new Date(raffle.endDate).toLocaleDateString('es-ES')}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Estado:</span>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          Activa
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Formulario de Compra */}
              <div className="lg:col-span-2">
                <Card className="border border-gray-200">
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">Detalles de la compra</h3>
                    
                    <form onSubmit={handleSubmit}>
                      <div className="space-y-6">
                        {/* Información personal */}
                        <div>
                          <h4 className="text-lg font-semibold text-gray-700 mb-4">Información personal</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="name">Nombre completo *</Label>
                              <Input 
                                id="name"
                                name="name"
                                placeholder="Tu nombre completo"
                                value={formData.name}
                                onChange={handleFormChange}
                                required
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="cedula">Cédula *</Label>
                              <Input 
                                id="cedula"
                                name="cedula"
                                placeholder="Tu número de cédula"
                                value={formData.cedula}
                                onChange={handleFormChange}
                                required
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="email">Correo electrónico *</Label>
                              <Input 
                                id="email"
                                name="email"
                                type="email"
                                placeholder="tu@email.com"
                                value={formData.email}
                                onChange={handleFormChange}
                                required
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="phone">Teléfono *</Label>
                              <Input 
                                id="phone"
                                name="phone"
                                placeholder="Tu número de teléfono"
                                value={formData.phone}
                                onChange={handleFormChange}
                                required
                                className="mt-1"
                              />
                            </div>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        {/* Selección de números */}
                        <div>
                          <h4 className="text-lg font-semibold text-gray-700 mb-4">Selecciona tus números</h4>
                          
                          {/* Paginación superior */}
                          <div className="mb-4">
                            <Pagination>
                              <PaginationContent>
                                <PaginationItem>
                                  <PaginationPrevious 
                                    onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                                    className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                                  />
                                </PaginationItem>
                                {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
                                  const page = currentPage <= 3
                                    ? idx + 1
                                    : currentPage >= totalPages - 2
                                      ? totalPages - 4 + idx
                                      : currentPage - 2 + idx;
                                      
                                  if (page <= totalPages && page > 0) {
                                    return (
                                      <PaginationItem key={page}>
                                        <PaginationLink 
                                          isActive={currentPage === page}
                                          onClick={() => handlePageChange(page)}
                                        >
                                          {page}
                                        </PaginationLink>
                                      </PaginationItem>
                                    );
                                  }
                                  return null;
                                })}
                                <PaginationItem>
                                  <PaginationNext 
                                    onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                                    className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                                  />
                                </PaginationItem>
                              </PaginationContent>
                            </Pagination>
                            <p className="text-center text-sm text-gray-500 mt-2">
                              Mostrando números del {startNumber} al {endNumber} de {totalNumbers}
                            </p>
                          </div>
                          
                          {/* Cuadrícula de números */}
                          <div className="grid grid-cols-10 sm:grid-cols-20 md:grid-cols-20 lg:grid-cols-25 gap-1 mb-4">
                            {getNumbersRange().map(number => (
                              <button
                                key={number}
                                type="button"
                                className={`
                                  w-8 h-8 flex items-center justify-center text-xs rounded
                                  ${isNumberSold(number) 
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                                    : isNumberSelected(number)
                                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                  }
                                `}
                                onClick={() => toggleNumberSelection(number)}
                                disabled={isNumberSold(number)}
                              >
                                {number}
                              </button>
                            ))}
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            <div className="flex items-center">
                              <div className="w-4 h-4 bg-white border border-gray-300 mr-1"></div>
                              <span className="text-xs text-gray-600">Disponible</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-4 h-4 bg-blue-600 mr-1"></div>
                              <span className="text-xs text-gray-600">Seleccionado</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-4 h-4 bg-gray-200 mr-1"></div>
                              <span className="text-xs text-gray-600">Vendido</span>
                            </div>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        {/* Resumen */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="text-lg font-semibold text-gray-700 mb-4">Resumen de la compra</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Precio por boleto:</span>
                              <span>${raffle?.price} MXN</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Números seleccionados:</span>
                              <span>{selectedNumbers.length}</span>
                            </div>
                            
                            {selectedNumbers.length > 0 && (
                              <div className="pt-2">
                                <span className="text-gray-600 block mb-1">Tus números:</span>
                                <div className="flex flex-wrap gap-1">
                                  {selectedNumbers.map(number => (
                                    <span key={number} className="inline-flex items-center justify-center w-7 h-7 text-xs rounded bg-blue-100 text-blue-700">
                                      {number}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            <Separator className="my-2" />
                            <div className="flex justify-between font-bold">
                              <span className="text-gray-800">Total:</span>
                              <span className="text-blue-700">${calculateTotal()} MXN</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Acciones */}
                        <div className="flex flex-col sm:flex-row gap-4">
                          <Button 
                            type="button"
                            variant="outline"
                            className="border-blue-700 text-blue-700 hover:bg-blue-50"
                            onClick={() => setLocation('/rifas-activas')}
                          >
                            Cancelar
                          </Button>
                          <Button 
                            type="submit"
                            className="bg-blue-700 text-white hover:bg-blue-600 flex-1"
                          >
                            Comprar boletos - ${calculateTotal()} MXN
                          </Button>
                        </div>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No se encontró información de la rifa.</p>
              <Button 
                className="mt-4 bg-blue-700 text-white hover:bg-blue-600"
                onClick={() => setLocation('/rifas-activas')}
              >
                Volver a las rifas
              </Button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}