import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useState } from "react";

// Datos simulados para la demostración
const winnersData = [
  {
    id: 1,
    name: "Juan López",
    ticketNumber: "A-12345",
    raffleTitle: "Gran Sorteo de Primavera",
    raffleId: 1,
    prize: "iPhone 13 Pro Max",
    date: "2023-05-15",
    image: "https://images.unsplash.com/photo-1603921326210-6edd2d60ca68?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80"
  },
  {
    id: 2,
    name: "María Rodríguez",
    ticketNumber: "B-67890",
    raffleTitle: "Sorteo Mensual",
    raffleId: 2,
    prize: "Smart TV 55\"",
    date: "2023-04-10",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80"
  },
  {
    id: 3,
    name: "Carlos Gómez",
    ticketNumber: "C-24680",
    raffleTitle: "Rifa Especial de Verano",
    raffleId: 3,
    prize: "Laptop Gaming",
    date: "2023-06-22",
    image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80"
  },
  {
    id: 4,
    name: "Ana García",
    ticketNumber: "D-13579",
    raffleTitle: "Sorteo de Aniversario",
    raffleId: 4,
    prize: "Viaje a Cancún",
    date: "2023-03-05",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80"
  },
  {
    id: 5,
    name: "Pedro Sánchez",
    ticketNumber: "E-97531",
    raffleTitle: "Gran Sorteo Navideño",
    raffleId: 5,
    prize: "PlayStation 5",
    date: "2022-12-24",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80"
  },
  {
    id: 6,
    name: "Laura Torres",
    ticketNumber: "F-28461",
    raffleTitle: "Sorteo de Año Nuevo",
    raffleId: 6,
    prize: "Set de Cocina Profesional",
    date: "2023-01-05",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80"
  }
];

export default function GanadoresPage() {
  const [_, setLocation] = useLocation();
  const [filter, setFilter] = useState("todos"); // "todos", "mes", "semestre", "año"

  // Filtrar los ganadores según el período seleccionado
  const getFilteredWinners = () => {
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
    const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());

    return winnersData.filter(winner => {
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
    return new Date(dateString).toLocaleDateString('es-ES', {
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
            {filteredWinners.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredWinners.map(winner => (
                  <Card key={winner.id} className="overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <div className="flex flex-col sm:flex-row">
                        <div className="sm:w-1/3">
                          <img 
                            src={winner.image}
                            alt={`Ganador: ${winner.name}`}
                            className="w-full h-full object-cover sm:h-40 md:h-full"
                          />
                        </div>
                        <div className="p-6 sm:w-2/3">
                          <div className="text-sm text-gray-500 mb-1">{formatDate(winner.date)}</div>
                          <h3 className="text-xl font-bold text-gray-800 mb-1">{winner.name}</h3>
                          <p className="text-blue-700 font-medium mb-2">{winner.prize}</p>
                          <p className="text-gray-600 text-sm mb-3">
                            Rifa: {winner.raffleTitle}
                          </p>
                          <div className="flex items-center">
                            <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                              Boleto #{winner.ticketNumber}
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