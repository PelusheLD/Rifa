import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { adminLoginSchema } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export default function AdminLogin() {
  const { toast } = useToast();
  const [_, setLocation] = useLocation();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  async function onSubmit(data: any) {
    setLoading(true);
    try {
      const response = await apiRequest("POST", "/api/admin/login", data);
      const result = await response.json();
      
      if (result.token) {
        login(result.token, result.user);
        toast({
          title: "Inicio de sesión exitoso",
          description: "Bienvenido al panel de administración.",
        });
        
        setLocation("/admin/dashboard");
      }
    } catch (error) {
      console.error("Error de inicio de sesión:", error);
      toast({
        title: "Error de inicio de sesión",
        description: "Credenciales incorrectas. Por favor intenta de nuevo.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full p-8 rounded-xl shadow-lg">
        <CardContent className="space-y-8 p-0">
          <div className="text-center">
            <div className="flex justify-center">
              <i className="fas fa-ticket-alt text-primary-500 text-3xl"></i>
            </div>
            <h2 className="mt-4 text-3xl font-extrabold text-gray-900">Acceso Administrativo</h2>
            <p className="mt-2 text-sm text-gray-600">
              Ingresa tus credenciales para acceder al panel de administración
            </p>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo electrónico</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="admin@rifasonline.com" 
                        type="email"
                        className="px-3 py-3 border border-gray-300 rounded-lg"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="••••••••" 
                        type="password"
                        className="px-3 py-3 border border-gray-300 rounded-lg"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Checkbox id="remember-me" />
                  <Label htmlFor="remember-me" className="ml-2 text-sm text-gray-900">
                    Recordarme
                  </Label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
              </div>

              <Button 
                type="submit"
                disabled={loading}
                className="relative w-full py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none transition-colors"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <i className="fas fa-lock text-primary-400 group-hover:text-primary-300 transition-colors"></i>
                </span>
                {loading ? "Iniciando sesión..." : "Iniciar sesión"}
              </Button>
            </form>
          </Form>
          
          <div className="text-center">
            <a href="/" className="text-sm text-gray-600 hover:text-primary-500 flex items-center justify-center">
              <i className="fas fa-arrow-left mr-2"></i>
              Volver a la página principal
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
