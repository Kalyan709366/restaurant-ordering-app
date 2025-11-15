"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function OrderStatus({ params }: any) {
  const orderId = params.id;

  const [order, setOrder] = useState<any>(null);
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    load();
    const cleanup = subscribeRealtime();
    return cleanup; // cleanup channel when unmounting
  }, []);

  async function load() {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    setOrder(data);

    if (data?.prep_time) startCountdown(data.prep_time);
  }

  function startCountdown(minutes: number) {
    const end = Date.now() + minutes * 60000;

    const interval = setInterval(() => {
      const diff = end - Date.now();

      if (diff <= 0) {
        setRemaining(0);
        clearInterval(interval);
      } else {
        setRemaining(Math.ceil(diff / 60000));
      }
    }, 1000);
  }

  function subscribeRealtime() {
    const channel = supabase
      .channel("orders-updates")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          setOrder(payload.new);

          if (payload.new.prep_time) {
            startCountdown(payload.new.prep_time);
          }
        }
      )
      .subscribe();

    // Cleanup function required by Vercel
    return () => {
      supabase.removeChannel(channel);
    };
  }

  if (!order) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl fw-bold mb-4">Order Status</h1>

      {order.status === "PENDING" && <p>⏳ Waiting for approval…</p>}
      {order.status === "APPROVED" && (
        <p>⏳ Ready in {remaining ?? order.prep_time} minutes</p>
      )}
      {order.status === "DECLINED" && <p>❌ Order was declined.</p>}
      {order.status === "COMPLETED" && <p>✅ Your order is ready!</p>}
    </div>
  );
}
