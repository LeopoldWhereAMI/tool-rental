import { useState, useEffect, useMemo } from "react";
import {
  loadClients,
  deleteClient as deleteClientService,
  createClientInSupabase,
} from "@/services/clientsService";
import { Client, CreateClientInput } from "@/types";
import { toast } from "sonner";

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await loadClients();
      setClients(data);
    } catch (err) {
      setError("Не удалось загрузить список клиентов");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Фильтрация внутри хука
  const filteredClients = useMemo(() => {
    if (!searchQuery.trim()) return clients; // Если поиска нет, возвращаем всех сразу

    const s = searchQuery.toLowerCase();

    return clients.filter(
      (c) =>
        c.last_name?.toLowerCase().includes(s) ||
        c.first_name?.toLowerCase().includes(s) ||
        c.phone?.includes(s),
    );
  }, [clients, searchQuery]);

  const addClient = async (newClient: CreateClientInput) => {
    try {
      await createClientInSupabase(newClient);
      toast.success("Клиент успешно создан");
      await fetchData(); // Перезагружаем список, чтобы новый клиент появился в таблице
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Ошибка при создании клиента";
      console.error("Ошибка при создании клиента:", err);
      toast.error(errorMessage);
      return false;
    }
  };

  const removeClient = async (id: string) => {
    try {
      await deleteClientService(id);
      toast.success("Клиент удалён");
      await fetchData(); // Перезагружаем список
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Ошибка при удалении";
      console.error("Ошибка при удалении:", err);
      toast.error(errorMessage);
      return false;
    }
  };

  return {
    clients,
    filteredClients,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    addClient,
    removeClient,
    refresh: fetchData,
  };
}
