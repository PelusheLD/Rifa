import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeView: string;
}

export default function Sidebar({ activeView }: SidebarProps) {
  const { logout } = useAuth();
  const [_, setLocation] = useLocation();

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
    setLocation("/");
  };

  const navigateTo = (view: string) => {
    setLocation(`/admin/${view}`);
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
    <aside className="bg-gray-900 text-white w-64 flex-shrink-0 hidden md:flex flex-col h-screen">
      <div className="h-16 flex items-center justify-start px-4 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <i className="fas fa-ticket-alt text-primary-400 text-xl"></i>
          <span className="text-xl font-bold">RifasOnline</span>
        </div>
      </div>
      
      <nav className="py-4 flex-grow">
        <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Panel de Control
        </div>
        
        <NavLink view="dashboard" icon="fas fa-home" label="Dashboard" />
        <NavLink view="rifas" icon="fas fa-ticket-alt" label="Gestionar Rifas" />
        <NavLink view="ganadores" icon="fas fa-trophy" label="Ganadores" />
        <NavLink view="participantes" icon="fas fa-users" label="Participantes" />
        <NavLink view="ventas" icon="fas fa-cash-register" label="Ventas" />
        
        <div className="px-4 py-2 mt-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Configuración
        </div>
        
        <NavLink view="perfil" icon="fas fa-user-cog" label="Perfil" />
        <NavLink view="system" icon="fas fa-cogs" label="Sistema" />
      </nav>
      
      <div className="border-t border-gray-800 p-4">
        <a 
          href="#" 
          className="flex items-center text-gray-300 hover:text-white transition-colors"
          onClick={handleLogout}
        >
          <i className="fas fa-sign-out-alt w-6"></i>
          <span>Cerrar sesión</span>
        </a>
      </div>
    </aside>
  );
}
