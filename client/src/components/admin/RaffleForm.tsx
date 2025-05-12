import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

// Crear un esquema de validación para el formulario
const formSchema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  price: z.number().min(1, "El precio debe ser mayor que 0"),
  totalTickets: z.number().min(1, "Debe haber al menos 1 boleto"),
  imageUrl: z.string().url("Debe ser una URL válida"),
  prizeId: z.string().optional(), // Hacemos este campo opcional para evitar problemas con la BD actual
  endDate: z.string().refine(val => !isNaN(Date.parse(val)), "Fecha inválida"),
  status: z.enum(["activa", "proxima", "finalizada"])
});

interface RaffleFormProps {
  raffle?: any;
  onClose: () => void;
}

export default function RaffleForm({ raffle, onClose }: RaffleFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const isEditing = !!raffle;

  // Configurar el formulario con valores predeterminados
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: raffle?.title || "",
      description: raffle?.description || "",
      price: raffle?.price || 0,
      totalTickets: raffle?.totalTickets || 100,
      imageUrl: raffle?.imageUrl || "",
      prizeId: raffle?.prizeId || "",
      endDate: raffle?.endDate ? new Date(raffle.endDate).toISOString().split("T")[0] : "",
      status: raffle?.status || "activa"
    }
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      // Asegurarse de que los valores numéricos sean realmente números
      // y que la fecha esté en formato ISO
      const formattedData = {
        ...data,
        price: Number(data.price),
        totalTickets: Number(data.totalTickets),
        endDate: data.endDate // Ya enviamos como string, el esquema se encargará de transformarlo
      };

      if (isEditing) {
        await apiRequest(`/api/raffles/${raffle.id}`, {
          method: "PUT",
          body: JSON.stringify(formattedData)
        });
        toast({
          title: "Rifa actualizada",
          description: "La rifa se ha actualizado correctamente",
        });
      } else {
        await apiRequest("/api/raffles", {
          method: "POST",
          body: JSON.stringify(formattedData)
        });
        toast({
          title: "Rifa creada",
          description: "La nueva rifa se ha creado correctamente",
        });
      }
      
      // Invalidar la caché para recargar los datos
      queryClient.invalidateQueries({ queryKey: ['/api/raffles'] });
      onClose();
    } catch (error) {
      console.error("Error al guardar la rifa:", error);
      toast({
        title: "Error",
        description: "Hubo un problema al guardar la rifa. Intenta de nuevo.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditing ? "Editar Rifa" : "Nueva Rifa"}
          </h2>
          <Button variant="outline" onClick={onClose}>
            <i className="fas fa-times mr-2"></i>
            Cancelar
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input placeholder="Título de la rifa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="prizeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID del Premio</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre o código del premio" {...field} />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-gray-500 mt-1">Identificador único para el premio de esta rifa (ej: "Auto2025", "ViajeCancun")</p>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio (MXN)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="100" 
                        {...field} 
                        onChange={e => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="totalTickets"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total de Boletos</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="100" 
                        {...field}
                        onChange={e => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Sorteo</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="activa">Activa</SelectItem>
                        <SelectItem value="proxima">Próxima</SelectItem>
                        <SelectItem value="finalizada">Finalizada</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL de la Imagen</FormLabel>
                  <FormControl>
                    <Input placeholder="https://ejemplo.com/imagen.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descripción detallada de la rifa y su premio"
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={onClose} type="button">
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    {isEditing ? "Actualizando..." : "Guardando..."}
                  </>
                ) : (
                  <>
                    <i className="fas fa-save mr-2"></i>
                    {isEditing ? "Actualizar Rifa" : "Guardar Rifa"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
