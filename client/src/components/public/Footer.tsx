export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-8 md:mb-0">
            <div className="flex items-center space-x-2 mb-4">
              <i className="fas fa-ticket-alt text-primary-400 text-2xl"></i>
              <h3 className="text-xl font-bold">RifasOnline</h3>
            </div>
            <p className="text-gray-400 max-w-md">La plataforma líder de rifas online en México. Ofrecemos una experiencia segura, transparente y emocionante.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-lg font-bold mb-4">Enlaces</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Inicio</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Rifas activas</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Ganadores</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Cómo participar</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">Legales</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Términos y condiciones</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Política de privacidad</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Permisos</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">Contacto</h4>
              <ul className="space-y-2">
                <li className="text-gray-400">
                  <i className="fas fa-envelope mr-2 text-primary-400"></i>
                  contacto@rifasonline.com
                </li>
                <li className="text-gray-400">
                  <i className="fas fa-phone mr-2 text-primary-400"></i>
                  +52 123 456 7890
                </li>
              </ul>
              <div className="mt-4 flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <i className="fab fa-twitter"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} RifasOnline. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
