import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/queryClient";

export default function Footer() {
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
    return null;
  }

  return (
    <footer className="bg-blue-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y Descripción */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center overflow-hidden">
                {config.footerLogoUrl ? (
                  <img src={config.footerLogoUrl} alt="Logo" className="w-8 h-8 object-contain" />
                ) : (
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="text-blue-900 w-5 h-5"
                  >
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="M3 10h18" />
                    <path d="M7 15h.01" />
                    <path d="M11 15h2" />
                  </svg>
                )}
              </div>
              <h2 className="text-xl font-bold">
                <span className="text-yellow-400">{config.footerCompanyName}</span>
              </h2>
            </div>
            <p className="text-white/80 mb-6">
              {config.footerDescription}
            </p>
          </div>

          {/* Enlaces Rápidos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <a href="/rifas-activas" className="text-white/80 hover:text-yellow-400 transition-colors">
                  Rifas Activas
                </a>
              </li>
              <li>
                <a href="/como-participar" className="text-white/80 hover:text-yellow-400 transition-colors">
                  ¿Cómo Participar?
                </a>
              </li>
              <li>
                <a href="/terminos" className="text-white/80 hover:text-yellow-400 transition-colors">
                  Términos y Condiciones
                </a>
              </li>
              <li>
                <a href="/privacidad" className="text-white/80 hover:text-yellow-400 transition-colors">
                  Política de Privacidad
                </a>
              </li>
            </ul>
          </div>

          {/* Redes Sociales */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Síguenos</h3>
            <div className="flex space-x-4">
              {config.socialLinks?.facebook && (
                <a 
                  href={config.socialLinks.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-yellow-400 transition-colors"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                  </svg>
                </a>
              )}
              {config.socialLinks?.instagram && (
                <a 
                  href={config.socialLinks.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-yellow-400 transition-colors"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153.509.5.902 1.105 1.153 1.772.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 01-1.153 1.772c-.5.509-1.105.902-1.772 1.153-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 01-1.772-1.153 4.904 4.904 0 01-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 011.153-1.772A4.897 4.897 0 015.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 100 10 5 5 0 000-10zm6.5-.25a1.25 1.25 0 10-2.5 0 1.25 1.25 0 002.5 0zM12 9a3 3 0 110 6 3 3 0 010-6z" />
                  </svg>
                </a>
              )}
              {config.socialLinks?.twitter && (
                <a 
                  href={config.socialLinks.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-yellow-400 transition-colors"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                  </svg>
                </a>
              )}
              {config.socialLinks?.whatsapp && (
                <a 
                  href={config.socialLinks.whatsapp} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-yellow-400 transition-colors"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-white/10 my-8"></div>

        {/* Copyright */}
        <div className="text-center text-white/60 text-sm">
          © {new Date().getFullYear()} {config.footerCompanyName}. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
