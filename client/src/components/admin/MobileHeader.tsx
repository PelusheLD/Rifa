import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";

interface MobileHeaderProps {
  isOpen: boolean;
  onOpenMenu: () => void;
  onCloseMenu: () => void;
  activeView: string;
}

export default function MobileHeader({ isOpen, onOpenMenu, onCloseMenu, activeView }: MobileHeaderProps) {
  const { logout } = useAuth();
  const [_, setLocation] = useLocation();

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
    setLocation("/");
  };

  const navigateTo = (view: string) => {
    setLocation(`/admin/${view}`);
    onCloseMenu();
  };

  const NavLink = ({ view, icon, label }: { view: string, icon: string, label: string }) => (
    <a 
      href={`#${view}`} 
      className={cn(
        "flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors",
        activeView === view && "bg-gray-800 text-white"
      )}
      onClick={(e) => {
        e.preventDefault();
        navigateTo(view);
      }}
    >
      <i className={`${icon} w-6`}></i>
      <span>{label}</span>
    </a>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="bg-gray-900 text-white h-16 flex items-center justify-between px-4 md:hidden w-full fixed top-0 z-10">
        <div className="flex items-center space-x-2">
          <i className="fas fa-ticket-alt text-primary-400 text-xl"></i>
          <span className="text-lg font-bold">RifasOnline</span>
        </div>
        
        <button 
          className="text-gray-300"
          onClick={onOpenMenu}
        >
          <i className="fas fa-bars text-xl"></i>
        </button>
      </div>
      
      {/* Mobile Navigation Overlay */}
      <div className={cn(
        "fixed inset-0 bg-gray-900 bg-opacity-50 z-20 md:hidden",
        isOpen ? "block" : "hidden"
      )}>
        <div className="bg-gray-900 text-white w-64 h-full ml-auto">
          <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
            <div className="flex items-center space-x-2">
              <i className="fas fa-ticket-alt text-primary-400 text-xl"></i>
              <span className="text-xl font-bold">RifasOnline</span>
            </div>
            <button 
              className="text-gray-300"
              onClick={onCloseMenu}
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
          
          <nav className="py-4">
            <NavLink view="dashboard" icon="fas fa-home" label="Dashboard" />
            <NavLink view="rifas" icon="fas fa-ticket-alt" label="Gestionar Rifas" />
            <NavLink view="ganadores" icon="fas fa-trophy" label="Ganadores" />
            <NavLink view="participantes" icon="fas fa-users" label="Participantes" />
            <NavLink view="ventas" icon="fas fa-cash-register" label="Ventas" />
            <NavLink view="perfil" icon="fas fa-user-cog" label="Perfil" />
            <NavLink view="system" icon="fas fa-cogs" label="Sistema" />
            
            <a 
              href="#" 
              className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
              onClick={handleLogout}
            >
              <i className="fas fa-sign-out-alt w-6"></i>
              <span>Cerrar sesión</span>
            </a>
          </nav>
        </div>
      </div>
    </>
  );
}
