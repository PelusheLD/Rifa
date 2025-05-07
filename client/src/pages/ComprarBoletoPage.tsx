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

export default function ComprarBoletoPage() {
  const params = useParams();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const raffleId = params.id ? parseInt(params.id) : 0;
  
  const [numTickets, setNumTickets] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  // Obtener detalles de la rifa específica
  const { data: raffle, isLoading, isError } = useQuery<RaffleData>({
    queryKey: [`/api/raffles/${raffleId}`],
    staleTime: 60000, // 1 minuto
    enabled: !!raffleId,
  });

  // Manejar cambios en el formulario
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Manejar cambio en el número de boletos
  const handleTicketChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= 10) {
      setNumTickets(value);
    }
  };

  // Incrementar cantidad de boletos
  const incrementTickets = () => {
    if (numTickets < 10) {
      setNumTickets(prev => prev + 1);
    }
  };

  // Decrementar cantidad de boletos
  const decrementTickets = () => {
    if (numTickets > 1) {
      setNumTickets(prev => prev - 1);
    }
  };

  // Calcular el precio total
  const calculateTotal = () => {
    if (!raffle) return 0;
    return raffle.price * numTickets;
  };

  // Manejar el envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación simple
    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        title: "Error en el formulario",
        description: "Por favor, completa todos los campos obligatorios.",
        variant: "destructive"
      });
      return;
    }
    
    // Aquí normalmente enviarías los datos al servidor
    // Pero para este ejemplo, solo mostraremos un mensaje
    toast({
      title: "¡Compra exitosa!",
      description: `Has comprado ${numTickets} boleto(s) para la rifa "${raffle?.title}". Te enviaremos un correo con los detalles.`,
      variant: "default"
    });
    
    // Redirigir a la página principal después de 2 segundos
    setTimeout(() => {
      setLocation('/');
    }, 2000);
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
                            <div>
                              <Label htmlFor="address">Dirección (opcional)</Label>
                              <Input 
                                id="address"
                                name="address"
                                placeholder="Tu dirección"
                                value={formData.address}
                                onChange={handleFormChange}
                                className="mt-1"
                              />
                            </div>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        {/* Cantidad de boletos */}
                        <div>
                          <h4 className="text-lg font-semibold text-gray-700 mb-4">Boletos</h4>
                          <div className="flex items-center space-x-4">
                            <Label htmlFor="tickets">Cantidad:</Label>
                            <div className="flex items-center">
                              <Button 
                                type="button"
                                onClick={decrementTickets}
                                className="h-10 w-10 rounded-l-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
                                variant="ghost"
                              >
                                -
                              </Button>
                              <Input 
                                id="tickets"
                                type="number"
                                value={numTickets}
                                onChange={handleTicketChange}
                                min="1"
                                max="10"
                                className="h-10 w-16 text-center border-y border-gray-200"
                              />
                              <Button 
                                type="button"
                                onClick={incrementTickets}
                                className="h-10 w-10 rounded-r-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
                                variant="ghost"
                              >
                                +
                              </Button>
                            </div>
                            <span className="text-gray-500 text-sm">(Máximo 10 boletos por compra)</span>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        {/* Resumen */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="text-lg font-semibold text-gray-700 mb-4">Resumen de la compra</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Precio por boleto:</span>
                              <span>${raffle.price} MXN</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Cantidad de boletos:</span>
                              <span>{numTickets}</span>
                            </div>
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