import { useState, useEffect, useMemo } from "react";
import { useLocation, useRoute } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import RaffleManager from "@/components/admin/RaffleManager";
import { queryClient } from "@/lib/queryClient";

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

type RafflesResponse = {
  data: Raffle[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
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

// Tipo para representar un participante agrupado
type ParticipantSummary = {
  cedula: string;
  name: string;
  email: string;
  phone: string;
  totalTickets: number;
  pendingTickets: number;
  paidTickets: number;
  tickets: Ticket[];
};

// Importando hook para acciones de tickets
import { useTicketActions } from "@/hooks/use-ticket-actions";

// Componente para mostrar los tickets específicos de un participante
function ParticipantTicketsView({ 
  raffleId, 
  participant, 
  onBack
}: { 
  raffleId: number, 
  participant: ParticipantSummary, 
  onBack: () => void
}) {
  const { data: tickets, refetch } = useQuery<Ticket[]>({
    queryKey: [`/api/raffles/${raffleId}/tickets`],
    retry: 1,
    staleTime: 30000,
  });
  const { data: raffleData } = useQuery<Raffle>({
    queryKey: [`/api/raffles/${raffleId}`],
    retry: 1,
    staleTime: 30000,
  });
  
  const { releaseTicket, markTicketAsPaid, isReleasing, isMarkingAsPaid } = useTicketActions();
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  
  // Manejar la liberación de un ticket
  const handleReleaseTicket = async (ticket: Ticket) => {
    if (window.confirm(`¿Estás seguro de liberar el boleto #${ticket.number}? Esta acción no se puede deshacer.`)) {
      await releaseTicket(ticket.id, raffleId);
      window.location.reload();
    }
  };
  
  // Manejar el marcado como pagado
  const handleMarkAsPaid = async (ticket: Ticket) => {
    await markTicketAsPaid(ticket.id, raffleId);
    window.location.reload();
  };
  
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
          Boletos de: {participant.name} - {raffleData?.title || `Rifa #${raffleId}`}
        </h2>
      </div>
      <Separator className="mb-4" />
      
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">Cédula</p>
            <p className="font-medium">{participant.cedula}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{participant.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Teléfono</p>
            <p className="font-medium">{participant.phone}</p>
          </div>
        </div>
      </div>
      
      {participant.tickets.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de Reserva</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de Pago</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {participant.tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ticket.number}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(ticket.reservationDate).toLocaleDateString('es-ES')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ticket.paymentDate ? new Date(ticket.paymentDate).toLocaleDateString('es-ES') : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      ticket.paymentStatus === 'pagado' 
                        ? 'bg-green-100 text-green-800' 
                        : ticket.paymentStatus === 'pendiente' || ticket.paymentStatus === 'apartado'
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {ticket.paymentStatus === 'pagado' 
                        ? 'Pagado' 
                        : ticket.paymentStatus === 'pendiente' || ticket.paymentStatus === 'apartado'
                          ? 'Apartado' 
                          : 'Cancelado'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      {/* Botón para liberar ticket */}
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={isReleasing}
                        onClick={() => handleReleaseTicket(ticket)}
                      >
                        Liberar
                      </Button>
                      
                      {/* Botón para marcar como pagado (solo si no está pagado) */}
                      {ticket.paymentStatus !== 'pagado' && (
                        <Button
                          variant="default"
                          size="sm"
                          disabled={isMarkingAsPaid}
                          onClick={() => handleMarkAsPaid(ticket)}
                        >
                          Pagar
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8">
          <i className="fas fa-ticket-alt text-4xl text-gray-300 mb-2"></i>
          <p className="text-gray-500">No hay boletos para mostrar</p>
        </div>
      )}
    </div>
  );
}

// Componente para mostrar la lista agrupada de participantes de una rifa
function ParticipantsListView({ raffleId, onBack, onSelectParticipant }: { 
  raffleId: number, 
  onBack: () => void,
  onSelectParticipant: (participant: ParticipantSummary) => void
}) {
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
  
  // Agrupar tickets por cédula para obtener la lista de participantes
  const participantsList = useMemo(() => {
    if (!tickets) return [];
    
    const participantsMap = new Map<string, ParticipantSummary>();
    
    tickets.forEach(ticket => {
      if (!participantsMap.has(ticket.cedula)) {
        participantsMap.set(ticket.cedula, {
          cedula: ticket.cedula,
          name: ticket.name,
          email: ticket.email,
          phone: ticket.phone,
          totalTickets: 0,
          pendingTickets: 0,
          paidTickets: 0,
          tickets: []
        });
      }
      
      const participant = participantsMap.get(ticket.cedula)!;
      participant.totalTickets++;
      
      if (ticket.paymentStatus === 'pagado') {
        participant.paidTickets++;
      } else if (ticket.paymentStatus === 'pendiente') {
        participant.pendingTickets++;
      }
      
      participant.tickets.push(ticket);
    });
    
    return Array.from(participantsMap.values());
  }, [tickets]);
  
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
      ) : participantsList.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cédula</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Boletos</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pagados</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pendientes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {participantsList.map((participant) => (
                <tr key={participant.cedula} className="hover:bg-gray-50 cursor-pointer" onClick={() => onSelectParticipant(participant)}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{participant.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{participant.cedula}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{participant.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{participant.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{participant.totalTickets}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {participant.paidTickets}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      {participant.pendingTickets}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-blue-600 hover:text-blue-800"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectParticipant(participant);
                      }}
                    >
                      Ver boletos
                    </Button>
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

// Componente para mostrar la lista de rifas
function RaffleListView({ onSelectRaffle }: { onSelectRaffle: (id: number) => void }) {
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
            <Card key={raffle.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onSelectRaffle(raffle.id)}>
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

// Componente para la sección de Participantes
function ParticipantesView() {
  const [selectedRaffleId, setSelectedRaffleId] = useState<number | null>(null);
  const [selectedParticipant, setSelectedParticipant] = useState<ParticipantSummary | null>(null);
  
  // Si hay un participante seleccionado, mostramos sus boletos
  if (selectedParticipant && selectedRaffleId) {
    return (
      <ParticipantTicketsView 
        raffleId={selectedRaffleId}
        participant={selectedParticipant}
        onBack={() => setSelectedParticipant(null)}
      />
    );
  }
  
  // Si hay una rifa seleccionada pero no un participante, mostramos la lista de participantes
  if (selectedRaffleId) {
    return (
      <ParticipantsListView 
        raffleId={selectedRaffleId}
        onBack={() => setSelectedRaffleId(null)}
        onSelectParticipant={setSelectedParticipant}
      />
    );
  }
  
  // Si no hay nada seleccionado, mostramos la lista de rifas
  return <RaffleListView onSelectRaffle={setSelectedRaffleId} />;
}

// Componente para la sección de Ganadores
function GanadoresView() {
  const { data: winners, isLoading, refetch } = useQuery<Winner[]>({
    queryKey: ['/api/winners'],
    retry: 1,
    staleTime: 30000,
  });
  
  const { toast } = useToast();
  
  // Función para marcar como reclamado
  const handleMarkAsClaimed = async (winnerId: number) => {
    try {
      const response = await fetch(`/api/winners/${winnerId}/claim`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      if (response.ok) {
        // Refrescar los datos
        refetch();
        
        toast({
          title: "¡Éxito!",
          description: "Premio marcado como reclamado",
          variant: "default"
        });
      } else {
        toast({
          title: "Error",
          description: "No se pudo actualizar el estado del premio",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error al actualizar ganador:", error);
      toast({
        title: "Error",
        description: "Hubo un problema de conexión",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-4">Ganadores de Rifas</h2>
        <Separator className="mb-6" />
        
        {isLoading ? (
          <div className="text-center py-8">
            <i className="fas fa-circle-notch fa-spin text-3xl text-gray-300 mb-2"></i>
            <p className="text-gray-500">Cargando ganadores...</p>
          </div>
        ) : winners && winners.length > 0 ? (
          <div className="space-y-6">
            {winners.map(winner => {
              return (
                <div key={winner.id} className="bg-white border rounded-lg p-6 shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0 mr-4">
                      <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                        <i className="fas fa-trophy text-yellow-500 text-xl"></i>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{winner.winnerName}</h3>
                      <p className="text-sm text-gray-500">
                        Boleto #{winner.ticketNumber} - {new Date(winner.announcedDate).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                    <div className="ml-auto">
                      {winner.claimed ? (
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                          Premio reclamado
                        </span>
                      ) : (
                        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">
                          Pendiente de reclamar
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 mr-3">
                        <i className="fas fa-gift text-primary-500"></i>
                      </div>
                      <div>
                        <p className="font-medium">Premio:</p>
                        <p>{winner.prize}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    {!winner.claimed && (
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => handleMarkAsClaimed(winner.id)}
                      >
                        <i className="fas fa-check-circle mr-2"></i>
                        Marcar como reclamado
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <i className="fas fa-trophy text-4xl text-gray-300 mb-2"></i>
            <p className="text-gray-500">No hay ganadores registrados</p>
            <p className="text-sm text-gray-400 mt-2">
              Los ganadores aparecerán aquí cuando se registren
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Componente para la selección de ganadores
function SeleccionarGanadorView() {
  const [selectedRaffleId, setSelectedRaffleId] = useState<number | null>(null);
  const [winningNumber, setWinningNumber] = useState<number | null>(null);
  const [winnerInfo, setWinnerInfo] = useState<Ticket | null>(null);
  const { toast } = useToast();

  // Consulta para obtener las rifas
  const { data: rafflesData, isLoading: isLoadingRaffles } = useQuery<RafflesResponse>({
    queryKey: ['/api/raffles'],
    retry: 1,
    staleTime: 30000,
  });

  // Consulta para obtener los tickets de una rifa específica
  const { data: ticketsData, isLoading: isLoadingTickets } = useQuery<Ticket[]>({
    queryKey: [`/api/raffles/${selectedRaffleId}/tickets`],
    enabled: selectedRaffleId !== null,
    retry: 1,
    staleTime: 30000,
  });

  const raffles = rafflesData?.data || [];

  // Función para seleccionar una rifa
  const handleSelectRaffle = (raffleId: number) => {
    setSelectedRaffleId(raffleId);
    setWinningNumber(null);
    setWinnerInfo(null);
  };

  // Función para buscar el ganador
  const handleFindWinner = () => {
    if (!winningNumber || !ticketsData) {
      toast({
        title: "Error",
        description: "Debe seleccionar un número ganador válido",
        variant: "destructive"
      });
      return;
    }

    // Buscar el ticket con el número ganador
    const winner = ticketsData.find(ticket => ticket.number === winningNumber);

    if (winner) {
      setWinnerInfo(winner);
      toast({
        title: "¡Ganador encontrado!",
        description: `El ganador es ${winner.name}`,
        variant: "default"
      });
    } else {
      toast({
        title: "No se encontró ganador",
        description: "No hay ningún ticket con ese número",
        variant: "destructive"
      });
      setWinnerInfo(null);
    }
  };
  
  // Obtener la función para cambiar la ubicación
  const [_, setLocation] = useLocation();
  
  // Función para registrar oficialmente al ganador
  const handleRegisterWinner = async () => {
    if (!winnerInfo || !selectedRaffleId) {
      toast({
        title: "Error",
        description: "No hay información de ganador disponible",
        variant: "destructive"
      });
      return;
    }
    
    // Obtener información de la rifa para el premio
    const selectedRaffle = raffles.find(raffle => raffle.id === selectedRaffleId);
    if (!selectedRaffle) {
      toast({
        title: "Error",
        description: "No se encontró información de la rifa",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Datos del ganador
      const winnerData = {
        raffleId: selectedRaffleId,
        winnerName: winnerInfo.name,
        ticketNumber: winnerInfo.number,
        prize: selectedRaffle.title // Usar el título de la rifa como premio
      };
      
      // Llamar a la API para registrar el ganador
      const response = await fetch('/api/winners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(winnerData)
      });
      
      if (response.ok) {
        const data = await response.json();
        toast({
          title: "¡Ganador registrado con éxito!",
          description: `${winnerInfo.name} ha sido registrado oficialmente como ganador`,
          variant: "default"
        });
        
        // Redireccionar a la lista de ganadores
        setTimeout(() => {
          setLocation('/admin/ganadores');
        }, 2000);
      } else {
        const errorData = await response.json();
        toast({
          title: "Error al registrar ganador",
          description: errorData.message || "Hubo un problema al registrar el ganador",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error al registrar ganador:", error);
      toast({
        title: "Error al registrar ganador",
        description: "Hubo un problema de conexión al intentar registrar el ganador",
        variant: "destructive"
      });
    }
  };

  // Renderizar la vista según el estado actual
  if (!selectedRaffleId) {
    return (
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4">Seleccionar Rifa</h2>
          <Separator className="mb-6" />
          
          {isLoadingRaffles ? (
            <div className="text-center py-8">
              <i className="fas fa-circle-notch fa-spin text-3xl text-gray-300 mb-2"></i>
              <p className="text-gray-500">Cargando rifas...</p>
            </div>
          ) : raffles && raffles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {raffles.map(raffle => (
                <Card key={raffle.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleSelectRaffle(raffle.id)}>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                        <i className="fas fa-award text-xl text-yellow-500"></i>
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
        </CardContent>
      </Card>
    );
  }

  // Vista de selección de número ganador
  const selectedRaffle = raffles.find(raffle => raffle.id === selectedRaffleId);

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="mr-2"
          onClick={() => setSelectedRaffleId(null)}
        >
          <i className="fas fa-arrow-left mr-2"></i>
          Volver a rifas
        </Button>
        
        {selectedRaffle && (
          <h2 className="text-xl font-semibold">
            {selectedRaffle.title} - Seleccionar Ganador
          </h2>
        )}
      </div>
      
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Selección de número ganador</h3>
          <Separator className="mb-6" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="winningNumber" className="block text-sm font-medium text-gray-700">
                  Número Ganador:
                </label>
                <div className="flex space-x-2">
                  <input
                    id="winningNumber"
                    type="number"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Ingrese el número ganador"
                    min="1"
                    max={selectedRaffle?.totalTickets || 100}
                    value={winningNumber || ''}
                    onChange={(e) => setWinningNumber(parseInt(e.target.value) || null)}
                  />
                  <Button
                    variant="default"
                    onClick={handleFindWinner}
                    disabled={isLoadingTickets || winningNumber === null}
                  >
                    Buscar Ganador
                  </Button>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <i className="fas fa-info-circle text-yellow-500 mt-0.5"></i>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Información</h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        Ingrese el número ganador de la rifa para buscar al participante que tiene ese boleto.
                        Únicamente se podrán buscar números que hayan sido vendidos.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white border rounded-md p-6">
              <h4 className="text-lg font-semibold mb-4">Información del Ganador</h4>
              
              {isLoadingTickets ? (
                <div className="text-center py-8">
                  <i className="fas fa-circle-notch fa-spin text-2xl text-gray-300 mb-2"></i>
                  <p className="text-gray-500">Cargando tickets...</p>
                </div>
              ) : winnerInfo ? (
                <div className="space-y-4">
                  <div className="text-center bg-green-50 border border-green-200 rounded-md p-4 mb-4">
                    <i className="fas fa-trophy text-4xl text-yellow-500 mb-2"></i>
                    <h3 className="text-lg font-semibold text-green-800">¡Ganador!</h3>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Nombre:</span>
                      <span className="font-bold">{winnerInfo.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Cédula:</span>
                      <span>{winnerInfo.cedula}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Número Ganador:</span>
                      <span className="text-2xl font-bold text-yellow-500">{winnerInfo.number}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Email:</span>
                      <span>{winnerInfo.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Teléfono:</span>
                      <span>{winnerInfo.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Estado:</span>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        winnerInfo.paymentStatus === 'pagado' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {winnerInfo.paymentStatus === 'pagado' ? 'Pagado' : 'Pendiente'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="pt-4 mt-4 border-t border-gray-200">
                    <Button 
                      className="w-full"
                      onClick={handleRegisterWinner}
                    >
                      <i className="fas fa-trophy mr-2"></i>
                      Registrar como Ganador Oficial
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <i className="fas fa-user-circle text-4xl text-gray-300 mb-2"></i>
                  <p className="text-gray-500">
                    {winningNumber 
                      ? 'No se encontró ningún ganador con ese número' 
                      : 'Ingrese un número para buscar al ganador'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
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
            
            <button 
              className="w-full px-4 py-3 flex items-center space-x-3 text-white hover:bg-gray-800 transition-colors"
              onClick={() => setLocation('/admin/seleccionar-ganador')}
            >
              <i className="fas fa-award text-gray-400"></i>
              {isSidebarOpen && <span>Seleccionar Ganador</span>}
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
            {activeView === 'seleccionar-ganador' && 'Seleccionar Ganador'}
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
          
          {/* Vista de Selección de Ganador */}
          {activeView === 'seleccionar-ganador' && <SeleccionarGanadorView />}
        </main>
      </div>
    </div>
  );
}