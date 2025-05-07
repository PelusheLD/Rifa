import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <div className="container mx-auto px-4 py-16 flex-grow flex flex-col lg:flex-row items-center">
      <div className="lg:w-1/2 mb-10 lg:mb-0">
        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">La mejor plataforma de rifas online</h2>
        <p className="text-white/80 text-lg mb-8">Participa en nuestras rifas con los premios más exclusivos y las mejores oportunidades para ganar.</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            className="bg-white text-primary-600 hover:bg-gray-100 transition px-6 py-3 rounded-lg text-lg font-semibold"
            size="lg"
          >
            Ver rifas activas
          </Button>
          <Button 
            className="bg-primary-700 text-white hover:bg-primary-800 transition px-6 py-3 rounded-lg text-lg font-semibold border border-white/20"
            size="lg"
            variant="outline"
          >
            ¿Cómo participar?
          </Button>
        </div>
      </div>
      <div className="lg:w-1/2 flex justify-center">
        <img 
          src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
          alt="Boletos de rifa" 
          className="rounded-xl shadow-2xl max-w-full" 
        />
      </div>
    </div>
  );
}
