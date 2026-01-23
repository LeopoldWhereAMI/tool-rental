"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Head from "next/head";

interface Client {
  id: string;
  name: string;
  phone: string | null;
  company: string | null;
  total_orders: number;
  total_spent: number;
  created_at: string;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClients();
  }, []);

  async function loadClients() {
    try {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error("Ошибка загрузки:", error);
    } finally {
      setLoading(false);
    }
  }

  async function addClient() {
    const name = prompt("Введите имя клиента:");
    const phone = prompt("Введите телефон:");

    if (!name) return;

    const { data } = await supabase
      .from("clients")
      .insert([{ name, phone }])
      .select();

    if (data) {
      setClients([data[0], ...clients]);
    }
  }

  if (loading) {
    return (
      <div>
        <div>Загрузка клиентов...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Клиенты</title>
        <meta name="description" content="Список всех клиентов" />
      </Head>
      <div>
        {clients.map((client) => (
          <div key={client.id}>
            {client.name} {client.phone}
          </div>
        ))}
      </div>
    </>
  );
}
