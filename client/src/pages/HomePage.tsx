import Header from "@/components/public/Header";
import Hero from "@/components/public/Hero";
import FeaturedRaffles from "@/components/public/FeaturedRaffles";
import Footer from "@/components/public/Footer";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

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

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  // Efecto para manejar el montaje del componente
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Obtener las rifas activas para mostrar
  const { data: rafflesData, isLoading } = useQuery<RafflesResponse>({
    queryKey: ['/api/raffles?filter=activa&limit=3'],
    staleTime: 60000, // 1 minuto
  });

  const featuredRaffles = rafflesData?.data || [];

  if (!mounted) {
    return (
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 min-h-screen flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-4xl mb-4">Cargando...</div>
          <div className="text-xl">Preparando las mejores rifas para ti</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-primary-600 to-primary-700 min-h-screen flex flex-col">
      <Header />
      <Hero />
      <FeaturedRaffles raffles={featuredRaffles} isLoading={isLoading} />
      <Footer />
    </div>
  );
}
