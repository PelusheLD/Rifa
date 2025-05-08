import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "./use-toast";

export function useTicketActions() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Mutación para liberar un ticket
  const releaseTicketMutation = useMutation({
    mutationFn: async (ticketId: number) => {
      return await apiRequest<any>(`/api/tickets/${ticketId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
    },
    onSuccess: (_, ticketId) => {
      toast({
        title: "Boleto liberado",
        description: "El boleto ha sido liberado correctamente",
        variant: "default"
      });
      
      // Invalidar consultas para actualizar la UI
      queryClient.invalidateQueries({ queryKey: ['/api/tickets'] });
      queryClient.invalidateQueries({ queryKey: ['/api/raffles'] });
      // La consulta de tickets específicos de rifa se maneja dinámicamente más abajo
    },
    onError: (error) => {
      console.error("Error al liberar boleto:", error);
      toast({
        title: "Error",
        description: "No se pudo liberar el boleto. Intente nuevamente.",
        variant: "destructive"
      });
    }
  });

  // Mutación para marcar un ticket como pagado
  const markAsPaidMutation = useMutation({
    mutationFn: async (ticketId: number) => {
      return await apiRequest<any>(`/api/tickets/${ticketId}/payment-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ paymentStatus: 'pagado' })
      });
    },
    onSuccess: (_, ticketId) => {
      toast({
        title: "Boleto pagado",
        description: "El boleto ha sido marcado como pagado",
        variant: "default"
      });
      
      // Invalidar consultas para actualizar la UI
      queryClient.invalidateQueries({ queryKey: ['/api/tickets'] });
      queryClient.invalidateQueries({ queryKey: ['/api/raffles'] });
      // La consulta de tickets específicos de rifa se maneja dinámicamente más abajo
    },
    onError: (error) => {
      console.error("Error al marcar como pagado:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado del boleto. Intente nuevamente.",
        variant: "destructive"
      });
    }
  });

  // Función para liberar un ticket con confirmación
  const releaseTicket = (ticketId: number, raffleId: number) => {
    releaseTicketMutation.mutate(ticketId, {
      onSuccess: () => {
        // Invalidar la consulta específica de esta rifa
        queryClient.invalidateQueries({ queryKey: [`/api/raffles/${raffleId}/tickets`] });
      }
    });
  };

  // Función para marcar un ticket como pagado
  const markTicketAsPaid = (ticketId: number, raffleId: number) => {
    markAsPaidMutation.mutate(ticketId, {
      onSuccess: () => {
        // Invalidar la consulta específica de esta rifa
        queryClient.invalidateQueries({ queryKey: [`/api/raffles/${raffleId}/tickets`] });
      }
    });
  };

  return {
    releaseTicket,
    markTicketAsPaid,
    isReleasing: releaseTicketMutation.isPending,
    isMarkingAsPaid: markAsPaidMutation.isPending
  };
}