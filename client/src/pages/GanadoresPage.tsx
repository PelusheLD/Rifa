import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";

// Definición local del tipo Raffle
type Raffle = {
  id: number;
  title: string;
  description: string;
  price: number;
  totalTickets: number;
  soldTickets: number;
  imageUrl: string;
  // Agrega otros campos si los necesitas
};

export default function GanadoresPage() {
  const [_, setLocation] = useLocation();
  const [filter, setFilter] = useState("todos"); // "todos", "mes", "semestre", "año"
  const [winners, setWinners] = useState([]);
  const [raffles, setRaffles] = useState<Record<number, Raffle>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/winners")
      .then(res => res.json())
      .then(async data => {
        setWinners(data);
        // Obtener todas las rifas únicas de los ganadores
        const raffleIds = Array.from(new Set(data.map((w: any) => w.raffleId))) as number[];
        const rafflesObj: Record<number, Raffle> = {};
        // Obtener los datos de cada rifa
        await Promise.all(raffleIds.map(async (id) => {
          const res = await fetch(`/api/raffles/${id}`);
          if (res.ok) {
            const raffle = await res.json();
            rafflesObj[id] = raffle;
          }
        }));
        setRaffles(rafflesObj);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Filtrar los ganadores según el período seleccionado
  const getFilteredWinners = () => {
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
    const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());

    return winners.filter((winner: any) => {
      const winnerDate = new Date(winner.date);
      switch (filter) {
        case "mes":
          return winnerDate >= oneMonthAgo;
        case "semestre":
          return winnerDate >= sixMonthsAgo;
        case "año":
          return winnerDate >= oneYearAgo;
        default:
          return true;
      }
    });
  };

  const filteredWinners = getFilteredWinners();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? "Sin fecha"
      : date.toLocaleDateString('es-ES', {
          day: "numeric",
          month: "long",
          year: "numeric"
        });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="bg-gradient-to-r from-blue-700 to-blue-900">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold text-white mb-6">Ganadores</h1>
          <p className="text-white/90 max-w-2xl mx-auto">
            Conoce a las personas afortunadas que han ganado nuestras rifas. ¡El próximo podrías ser tú!
          </p>
        </div>
      </div>

      <div className="py-16 bg-gray-100 flex-1">
        <div className="container mx-auto px-4">
          {/* Filtros */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Filtrar por período</h2>
              <div className="flex flex-wrap gap-3">
                <Button 
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'todos' ? 'bg-blue-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  onClick={() => setFilter('todos')}
                >
                  Todos los ganadores
                </Button>
                <Button 
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'mes' ? 'bg-blue-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  onClick={() => setFilter('mes')}
                >
                  Último mes
                </Button>
                <Button 
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'semestre' ? 'bg-blue-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  onClick={() => setFilter('semestre')}
                >
                  Último semestre
                </Button>
                <Button 
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'año' ? 'bg-blue-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  onClick={() => setFilter('año')}
                >
                  Último año
                </Button>
              </div>
            </div>
          </div>

          {/* Lista de ganadores */}
          <div className="max-w-4xl mx-auto">
            {loading ? (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                <span className="text-gray-500">Cargando ganadores...</span>
              </div>
            ) : filteredWinners.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredWinners.map((winner: any) => (
                  <Card key={winner.id} className="overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <div className="flex flex-col sm:flex-row">
                        <div className="sm:w-1/3">
                          <img 
                            src={raffles[winner.raffleId]?.imageUrl || "/default-prize.jpg"}
                            alt={`Premio: ${winner.prize || winner.premio}`}
                            className="w-full h-full object-cover sm:h-40 md:h-full"
                          />
                        </div>
                        <div className="p-6 sm:w-2/3">
                          <div className="text-sm text-gray-500 mb-1">{formatDate(winner.date)}</div>
                          <h3 className="text-xl font-bold text-gray-800 mb-1">{winner.name || winner.nombre}</h3>
                          <p className="text-blue-700 font-medium mb-2">{winner.prize || winner.premio}</p>
                          <p className="text-gray-600 text-sm mb-3">
                            Rifa: {winner.raffleTitle || winner.rifa || winner.raffle}
                          </p>
                          <div className="flex items-center">
                            <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                              Boleto #{winner.ticketNumber || winner.boleto || winner.ticket}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                <div className="text-gray-400 mb-4">
                  <i className="fas fa-trophy text-6xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay ganadores en este período</h3>
                <p className="text-gray-500 mb-6">No se encontraron ganadores para el período seleccionado.</p>
                <Button 
                  className="bg-blue-700 text-white hover:bg-blue-600 px-4 py-2 rounded-lg"
                  onClick={() => setFilter('todos')}
                >
                  Ver todos los ganadores
                </Button>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="max-w-4xl mx-auto mt-16 text-center">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-blue-800 mb-4">¿Quieres ser el próximo ganador?</h2>
              <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                Participa en nuestras rifas activas y podrías ganar increíbles premios. Cada boleto te da una oportunidad de estar en esta lista de ganadores.
              </p>
              <Button 
                className="bg-blue-700 text-white hover:bg-blue-600 px-8 py-3 rounded-lg"
                onClick={() => setLocation('/rifas-activas')}
              >
                Participar ahora
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}