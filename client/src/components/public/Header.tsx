import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Header() {
  const [_, setLocation] = useLocation();

  return (
    <header className="bg-white/10 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <i className="fas fa-ticket-alt text-white text-2xl"></i>
          <h1 className="text-white text-xl font-bold">RifasOnline</h1>
        </div>
        <Button 
          className="text-white bg-white/20 hover:bg-white/30 transition px-4 py-2 rounded-lg text-sm font-medium"
          variant="ghost"
          onClick={() => setLocation('/admin-aut')}
        >
          Administrador
        </Button>
      </div>
    </header>
  );
}
