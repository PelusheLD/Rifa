import Header from "@/components/public/Header";
import Hero from "@/components/public/Hero";
import FeaturedRaffles from "@/components/public/FeaturedRaffles";
import Footer from "@/components/public/Footer";
import { useQuery } from "@tanstack/react-query";

export default function HomePage() {
  // Obtener las rifas activas para mostrar
  const { data: rafflesData, isLoading } = useQuery({
    queryKey: ['/api/raffles?filter=activa&limit=3'],
    staleTime: 60000, // 1 minuto
  });

  const featuredRaffles = rafflesData?.data || [];

  return (
    <div className="bg-gradient-to-r from-primary-600 to-primary-700 min-h-screen flex flex-col">
      <Header />
      <Hero />
      <FeaturedRaffles raffles={featuredRaffles} isLoading={isLoading} />
      <Footer />
    </div>
  );
}
