// import { useState, useEffect } from "react";
// import {
//   loadClients,
//   deleteClient as deleteClientService,
//   createClientInSupabase,
// } from "@/services/clientsService";
// import { ClientWithOrders, CreateClientInput } from "@/types";
// import { toast } from "sonner";

// export function useClients() {
//   const [clients, setClients] = useState<ClientWithOrders[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const data = await loadClients();
//       setClients(data);
//     } catch (err) {
//       setError("Не удалось загрузить список клиентов");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const addClient = async (newClient: CreateClientInput) => {
//     try {
//       await createClientInSupabase(newClient);
//       toast.success("Клиент успешно создан");
//       await fetchData();
//       return true;
//     } catch (err) {
//       const errorMessage =
//         err instanceof Error ? err.message : "Ошибка при создании клиента";
//       console.error("Ошибка при создании клиента:", err);
//       toast.error(errorMessage);
//       return false;
//     }
//   };

//   const removeClient = async (id: string) => {
//     try {
//       await deleteClientService(id);
//       toast.success("Клиент удалён");
//       await fetchData();
//       return true;
//     } catch (err) {
//       const errorMessage =
//         err instanceof Error ? err.message : "Ошибка при удалении";
//       console.error("Ошибка при удалении:", err);
//       toast.error(errorMessage);
//       return false;
//     }
//   };

//   return {
//     clients,
//     loading,
//     error,
//     addClient,
//     removeClient,
//     refresh: fetchData,
//   };
// }

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
