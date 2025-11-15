"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    setLoading(true);

    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*, menu(*))")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setOrders(data);
    }

    setLoading(false);
  }

  function calculateTotal(order: any) {
    return order.order_items.reduce(
      (total: number, item: any) =>
        total + item.quantity * item.menu.price,
      0
    );
  }

  if (loading) return <p className="p-6">Loading history...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Order History</h1>

      {orders.length === 0 ? (
        <p>No past orders found.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white p-6 rounded-lg shadow border"
            >
              <div className="flex justify-between mb-4">
                <p className="font-semibold text-lg">
                  Order ID: {order.id}
                </p>
                <p className="text-sm text-gray-600">
                  {new Date(order.created_at).toLocaleString()}
                </p>
              </div>

              <p>Status: {order.status}</p>

              <h3 className="mt-3 font-semibold">Items:</h3>
              <ul className="list-disc ml-6 mb-3">
                {order.order_items.map((item: any) => (
                  <li key={item.id}>
                    {item.menu.name} × {item.quantity} — $
                    {item.quantity * item.menu.price}
                  </li>
                ))}
              </ul>

              <p className="text-xl font-bold">
                Total: ${calculateTotal(order)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
