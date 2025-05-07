export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-8 md:mb-0">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                <i className="fas fa-ticket-alt text-white text-xl"></i>
              </div>
              <h3 className="text-xl font-bold">
                <span className="bg-gradient-to-r from-primary-400 to-primary-300 text-transparent bg-clip-text">
                  RifasOnline
                </span>
              </h3>
            </div>
            <p className="text-gray-300 max-w-md">La plataforma líder de rifas online en México. Ofrecemos una experiencia segura, transparente y emocionante para todos nuestros participantes.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-lg font-bold mb-4 text-primary-300">Enlaces</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-300 hover:text-primary-300 transition-colors">Inicio</a></li>
                <li><a href="#" className="text-gray-300 hover:text-primary-300 transition-colors">Rifas activas</a></li>
                <li><a href="#" className="text-gray-300 hover:text-primary-300 transition-colors">Ganadores</a></li>
                <li><a href="#" className="text-gray-300 hover:text-primary-300 transition-colors">Cómo participar</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4 text-primary-300">Legales</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-300 hover:text-primary-300 transition-colors">Términos y condiciones</a></li>
                <li><a href="#" className="text-gray-300 hover:text-primary-300 transition-colors">Política de privacidad</a></li>
                <li><a href="#" className="text-gray-300 hover:text-primary-300 transition-colors">Permisos</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4 text-primary-300">Contacto</h4>
              <ul className="space-y-3">
                <li className="text-gray-300 flex items-center">
                  <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center mr-2">
                    <i className="fas fa-envelope text-primary-300"></i>
                  </div>
                  contacto@rifasonline.com
                </li>
                <li className="text-gray-300 flex items-center">
                  <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center mr-2">
                    <i className="fas fa-phone text-primary-300"></i>
                  </div>
                  +52 123 456 7890
                </li>
              </ul>
              <div className="mt-6 flex space-x-4">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-primary-300 hover:bg-primary-600 hover:text-white transition-colors">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-primary-300 hover:bg-primary-600 hover:text-white transition-colors">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-primary-300 hover:bg-primary-600 hover:text-white transition-colors">
                  <i className="fab fa-twitter"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400 text-sm">© {new Date().getFullYear()} <span className="text-primary-300">RifasOnline</span>. Todos los derechos reservados.</p>
          <div className="mt-4 flex justify-center space-x-4">
            <a href="#" className="text-gray-400 hover:text-primary-300 text-sm">Ayuda</a>
            <span className="text-gray-600">|</span>
            <a href="#" className="text-gray-400 hover:text-primary-300 text-sm">FAQ</a>
            <span className="text-gray-600">|</span>
            <a href="#" className="text-gray-400 hover:text-primary-300 text-sm">Soporte</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
