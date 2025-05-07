import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function ComoParticiparPage() {
  const [_, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="bg-gradient-to-r from-blue-700 to-blue-900">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold text-white mb-6">¿Cómo Participar?</h1>
          <p className="text-white/90 max-w-2xl mx-auto">
            Participar en nuestras rifas es muy sencillo. Sigue estos pasos y podrás ganar increíbles premios.
          </p>
        </div>
      </div>

      <div className="py-16 bg-gray-100 flex-1">
        <div className="container mx-auto px-4">
          {/* Pasos para participar */}
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="bg-white p-6 rounded-xl shadow-md text-center">
                <div className="w-16 h-16 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Elige tu rifa</h3>
                <p className="text-gray-600">
                  Navega por nuestro catálogo de rifas activas y selecciona la que más te interese.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md text-center">
                <div className="w-16 h-16 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Compra boletos</h3>
                <p className="text-gray-600">
                  Selecciona la cantidad de boletos que deseas comprar y completa el formulario.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md text-center">
                <div className="w-16 h-16 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">¡Gana premios!</h3>
                <p className="text-gray-600">
                  Espera al sorteo y si tienes suerte, te contactaremos para entregarte tu premio.
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Preguntas Frecuentes</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">¿Cómo sé si gané?</h3>
                  <p className="text-gray-600 mt-2">
                    Los resultados se publican en nuestra página web y redes sociales. Además, nos comunicaremos directamente contigo a través del correo electrónico o número de teléfono que proporcionaste al comprar tus boletos.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-gray-800">¿Cuántos boletos puedo comprar?</h3>
                  <p className="text-gray-600 mt-2">
                    Puedes comprar hasta 10 boletos por transacción. Si deseas comprar más, puedes realizar múltiples transacciones.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-gray-800">¿Cómo recibo mi premio?</h3>
                  <p className="text-gray-600 mt-2">
                    Dependiendo del premio, puede ser enviado a tu domicilio o puedes recogerlo en nuestras oficinas. Los detalles específicos se coordinarán contigo si resultas ganador.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-gray-800">¿Qué pasa si no se venden todos los boletos?</h3>
                  <p className="text-gray-600 mt-2">
                    Si no se venden todos los boletos, la rifa se realizará igualmente en la fecha indicada. Garantizamos que todos los premios serán entregados.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-gray-800">¿Puedo participar desde cualquier lugar?</h3>
                  <p className="text-gray-600 mt-2">
                    Sí, puedes participar desde cualquier lugar de México. Para participantes internacionales, consulta nuestros términos y condiciones para detalles específicos.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-8 rounded-xl mb-8">
              <h2 className="text-2xl font-bold text-blue-800 mb-4">Términos y Condiciones</h2>
              <p className="text-gray-700 mb-4">
                Al participar en nuestras rifas, aceptas los siguientes términos y condiciones:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>Debes ser mayor de 18 años para participar.</li>
                <li>La fecha del sorteo puede estar sujeta a cambios, los cuales serán notificados con anticipación.</li>
                <li>Los boletos no son reembolsables ni transferibles.</li>
                <li>Los premios no pueden ser cambiados por su valor en efectivo.</li>
                <li>Los ganadores tienen 30 días para reclamar su premio después de ser notificados.</li>
                <li>RifasOnline se reserva el derecho de modificar estos términos en cualquier momento.</li>
              </ul>
            </div>

            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">¿Listo para participar?</h2>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button 
                  className="bg-blue-700 text-white hover:bg-blue-600 px-8 py-3 rounded-lg"
                  onClick={() => setLocation('/rifas-activas')}
                >
                  Ver rifas activas
                </Button>
                <Button 
                  className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-3 rounded-lg border border-blue-700"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  Volver arriba
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}