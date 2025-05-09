import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/queryClient";

export default function Hero() {
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    async function fetchConfig() {
      try {
        const data = await apiRequest("/api/page-config");
        setConfig(data);
      } catch (e) {
        setConfig(null);
      }
    }
    fetchConfig();
  }, []);

  if (!config) {
    return (
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 min-h-[400px] flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-2xl mb-2">Cargando...</div>
        </div>
      </div>
    );
  }

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
          <div className="lg:w-1/2 mb-10 lg:mb-0 lg:pl-24">
            <div className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium mb-6">
              ✨ Los mejores premios te esperan
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {config.title.split('rifas online')[0]}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500"> rifas online</span>
            </h1>
            <p className="text-white/90 text-lg mb-8 max-w-lg">
              {config.subtitle}
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
                <span className="text-3xl font-bold text-white">{config.highlight1.replace(/[^\d+]/g, '')}</span>
                <span className="text-white/80 text-sm">{config.highlight1.replace(/^[^a-zA-Z]+/, '')}</span>
              </div>
              <div className="w-px h-10 bg-white/20"></div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-white">{config.highlight2.replace(/[^\d+]/g, '')}</span>
                <span className="text-white/80 text-sm">{config.highlight2.replace(/^[^a-zA-Z]+/, '')}</span>
              </div>
              <div className="w-px h-10 bg-white/20"></div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-white">{config.highlight3.replace(/[^\d+]/g, '')}</span>
                <span className="text-white/80 text-sm">{config.highlight3.replace(/^[^a-zA-Z]+/, '')}</span>
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2 flex justify-center">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-300 to-yellow-300 rounded-2xl blur opacity-50"></div>
              <img 
                src={config.heroImageUrl || "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"} 
                alt="Boletos de rifa" 
                className="relative rounded-2xl shadow-2xl max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl border-4 border-white/20 backdrop-blur-sm object-cover" 
                style={{ maxHeight: '520px', width: '100%' }}
              />
              
              {/* Badge flotante */}
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
