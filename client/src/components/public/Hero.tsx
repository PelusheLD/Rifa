import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <div className="relative overflow-hidden py-20">
      {/* Formas decorativas */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-0 right-0 bg-white/5 w-96 h-96 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 bg-white/5 w-96 h-96 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
        <div className="absolute top-1/2 left-1/3 bg-primary-500/10 w-64 h-64 rounded-full -translate-y-1/2 -translate-x-1/2 blur-xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-10 lg:mb-0">
            <div className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium mb-6">
              ✨ Los mejores premios te esperan
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              La mejor plataforma de 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500"> rifas online</span>
            </h1>
            <p className="text-white/90 text-lg mb-8 max-w-lg">
              Participa en nuestras rifas con los premios más exclusivos y las mejores oportunidades para ganar grandes premios.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="bg-yellow-400 text-blue-900 hover:bg-yellow-300 transition-all px-8 py-3 rounded-full text-lg font-semibold shadow-lg border-2 border-yellow-300"
                size="lg"
                onClick={() => window.location.href = "/rifas-activas"}
              >
                Ver rifas activas
              </Button>
              <Button 
                className="bg-white/90 text-blue-900 hover:bg-white transition-all px-8 py-3 rounded-full text-lg font-semibold shadow-lg"
                size="lg"
                onClick={() => window.location.href = "/como-participar"}
              >
                ¿Cómo participar?
              </Button>
            </div>
            
            <div className="mt-12 flex items-center space-x-8">
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-white">+1000</span>
                <span className="text-white/80 text-sm">Ganadores</span>
              </div>
              <div className="w-px h-10 bg-white/20"></div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-white">+5M</span>
                <span className="text-white/80 text-sm">En premios</span>
              </div>
              <div className="w-px h-10 bg-white/20"></div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-white">100%</span>
                <span className="text-white/80 text-sm">Garantizado</span>
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2 flex justify-center">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-300 to-yellow-300 rounded-2xl blur opacity-50"></div>
              <img 
  src="https://i.pinimg.com/736x/f9/df/e4/f9dfe40bc98a35f738e4fd6a4ac2b0c6.jpg" 
  alt="Boletos de rifa" 
  className="w-64 h-auto rounded-2xl shadow-2xl border-4 border-white/20 backdrop-blur-sm" 
/>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
