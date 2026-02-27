import { useState } from "react";
import { supabase } from "@/lib/supabase/supabase";
import { useRouter } from "next/navigation";
import { useSWRConfig } from "swr"; // 1. Импортируем конфиг

export function useBlacklist() {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const router = useRouter();
  const { mutate } = useSWRConfig(); // 2. Получаем глобальный mutate

  const openBlacklistModal = (id: string) => {
    setSelectedClientId(id);
    setIsModalOpen(true);
  };

  const closeBlacklistModal = () => {
    setSelectedClientId(null);
    setIsModalOpen(false);
  };

  const addToBlacklist = async (id: string, reason: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("clients")
        .update({
          is_blacklisted: true,
          blacklist_reason: reason,
        })
        .eq("id", id);

      if (error) throw error;

      // 3. Сбрасываем кеш SWR по ключам
      // Очищаем список всех клиентов
      mutate("clients");
      // Очищаем детали конкретного клиента (если ключ в useClientDetails выглядит так)
      mutate(`client-${id}`);

      router.refresh();
      closeBlacklistModal();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromBlacklist = async (id: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("clients")
        .update({
          is_blacklisted: false,
          blacklist_reason: null,
        })
        .eq("id", id);

      if (error) throw error;

      // 4. Те же действия для разблокировки
      mutate("clients");
      mutate(`client-${id}`);

      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    addToBlacklist,
    removeFromBlacklist,
    openBlacklistModal,
    closeBlacklistModal,
    isModalOpen,
    selectedClientId,
    loading,
  };
}
