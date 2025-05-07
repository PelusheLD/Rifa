import { useState, useMemo } from "react";
import RaffleTable from "./RaffleTable";
import RaffleForm from "./RaffleForm";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";

export default function RaffleManager() {
  const [showForm, setShowForm] = useState(false);
  const [editingRaffle, setEditingRaffle] = useState<any>(null);
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 10;

  // Usar useMemo para construir la queryString solo cuando las dependencias cambien
  const queryString = useMemo(() => {
    let query = `/api/raffles?page=${page}&limit=${limit}`;
    if (statusFilter !== "all") {
      query += `&filter=${statusFilter}`;
    } else if (filter) {
      query += `&filter=${filter}`;
    }
    return query;
  }, [page, limit, statusFilter, filter]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: [queryString],
  });

  const handleCreate = () => {
    setEditingRaffle(null);
    setShowForm(true);
  };

  const handleEdit = (raffle: any) => {
    setEditingRaffle(raffle);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingRaffle(null);
    refetch();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
    setPage(1);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div>
      {showForm ? (
        <RaffleForm 
          raffle={editingRaffle} 
          onClose={handleFormClose} 
        />
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Gestión de Rifas</h2>
            <Button 
              onClick={handleCreate}
              className="bg-primary-600 hover:bg-primary-700 text-white font-medium"
            >
              <i className="fas fa-plus mr-2"></i>
              Nueva Rifa
            </Button>
          </div>
          
          <Card>
            <div className="p-4 border-b">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-search text-gray-400"></i>
                  </div>
                  <Input
                    type="text"
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Buscar rifas..."
                    value={filter}
                    onChange={handleSearchChange}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Select
                    value={statusFilter}
                    onValueChange={handleStatusFilterChange}
                  >
                    <SelectTrigger className="border border-gray-300 rounded-lg py-2 px-3 min-w-[180px]">
                      <SelectValue placeholder="Todas las rifas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las rifas</SelectItem>
                      <SelectItem value="activa">Rifas activas</SelectItem>
                      <SelectItem value="proxima">Próximas rifas</SelectItem>
                      <SelectItem value="finalizada">Rifas finalizadas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <RaffleTable 
              raffles={data?.data || []}
              pagination={data?.pagination || { total: 0, page: 1, limit: 10, totalPages: 0 }}
              isLoading={isLoading}
              onEdit={handleEdit}
              onPageChange={handlePageChange}
            />
          </Card>
        </>
      )}
    </div>
  );
}
