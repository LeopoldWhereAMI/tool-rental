import useSWR from "swr";
import {
  loadClients,
  deleteClient as deleteClientService,
  createClientInSupabase,
} from "@/services/clientsService";
import { ClientWithOrders, CreateClientInput } from "@/types";
import { toast } from "sonner";

export function useClients() {
  // Ключ "clients" теперь связан с mutate("clients") в useBlacklist
  const { data, error, isLoading, mutate } = useSWR<ClientWithOrders[]>(
    "clients",
    loadClients,
  );

  const addClient = async (newClient: CreateClientInput) => {
    try {
      await createClientInSupabase(newClient);
      toast.success("Клиент успешно создан");
      mutate(); // Перезапрашиваем данные
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Ошибка при создании клиента";
      toast.error(errorMessage);
      return false;
    }
  };

  const removeClient = async (id: string) => {
    try {
      await deleteClientService(id);
      toast.success("Клиент удалён");
      mutate(); // Перезапрашиваем данные
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Ошибка при удалении";
      toast.error(errorMessage);
      return false;
    }
  };

  return {
    clients: data ?? [],
    loading: isLoading,
    error: error ? "Не удалось загрузить список клиентов" : null,
    addClient,
    removeClient,
    refresh: mutate,
  };
}
