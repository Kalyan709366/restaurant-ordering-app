"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function OrdersAdmin() {
  const [orders, setOrders] = useState<any[]>([]);
  const [completedToday, setCompletedToday] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    setLoading(true);

    const today = new Date().toISOString().split("T")[0];

    // Load all orders
    const { data } = await supabase
      .from("orders")
      .select("*, order_items(*, menu(*))")
      .order("created_at", { ascending: false });

    if (data) {
      const active = data.filter(
        (o: any) => o.status !== "COMPLETED"
      );

      const completed = data.filter(
        (o: any) =>
          o.status === "COMPLETED" &&
          o.created_at.startsWith(today)
      );

      setOrders(active);
      setCompletedToday(completed);
    }

    setLoading(false);
  }

  async function approveOrder(id: string) {
    const minutes = prompt("Enter prep time in minutes:");

    if (!minutes) return;

    await supabase.from("orders").update({
      status: "APPROVED",
      prep_time: Number(minutes),
    }).eq("id", id);

    loadOrders();
  }

  async function declineOrder(id: string) {
    await supabase.from("orders")
      .update({ status: "DECLINED" })
      .eq("id", id);

    loadOrders();
  }

  // Auto-deduct inventory based on menu_inventory mapping
  async function deductInventory(order: any) {
    for (let item of order.order_items) {
      const menuId = item.menu_id;

      // get mapping for this menu item
      const { data: mappings } = await supabase
        .from("menu_inventory")
        .select("*")
        .eq("menu_id", menuId);

      for (let map of mappings!) {
        // get current inventory
        const { data: inv } = await supabase
          .from("inventory")
          .select("*")
          .eq("id", map.inventory_id)
          .single();

        const newQty =
          inv!.quantity - map.required_qty * item.quantity;

        await supabase
          .from("inventory")
          .update({ quantity: newQty })
          .eq("id", map.inventory_id);
      }
    }
  }

  async function completeOrder(order: any) {
    // Deduct inventory
    await deductInventory(order);

    // Mark as completed
    await supabase
      .from("orders")
      .update({ status: "COMPLETED" })
      .eq("id", order.id);

    loadOrders();
  }

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Orders</h1>

      {/* Active Orders */}
      <h2 className="text-2xl font-semibold mb-4">Active Orders</h2>

      {orders.length === 0 && <p>No active orders.</p>}

      <div className="flex flex-col gap-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white shadow p-6 rounded-lg">
            <p className="font-bold text-lg">Order ID: {order.id}</p>
            <p>Phone: {order.phone}</p>
            <p>Status: {order.status}</p>

            <h3 className="mt-3 font-semibold">Items:</h3>
            <ul className="list-disc ml-6">
              {order.order_items.map((item: any) => (
                <li key={item.id}>
                  {item.menu.name} × {item.quantity}
                </li>
              ))}
            </ul>

            <div className="flex gap-3 mt-6">
              {order.status === "PENDING" && (
                <>
                  <button
                    className="px-4 py-2 bg-green-600 text-white rounded"
                    onClick={() => approveOrder(order.id)}
                  >
                    Approve
                  </button>

                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded"
                    onClick={() => declineOrder(order.id)}
                  >
                    Decline
                  </button>
                </>
              )}

              {order.status === "APPROVED" && (
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                  onClick={() => completeOrder(order)}
                >
                  Mark Completed
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Completed Orders */}
      <h2 className="text-2xl font-semibold mt-10 mb-4">
        Completed Today
      </h2>

      {completedToday.length === 0 && (
        <p>No completed orders today.</p>
      )}

      <div className="flex flex-col gap-6">
        {completedToday.map((order) => (
          <div key={order.id} className="bg-gray-100 p-6 rounded-lg">
            <p className="font-bold text-lg">Order ID: {order.id}</p>
            <p>Phone: {order.phone}</p>

            <h3 className="mt-3 font-semibold">Items:</h3>
            <ul className="list-disc ml-6">
              {order.order_items.map((item: any) => (
                <li key={item.id}>
                  {item.menu.name} × {item.quantity}
                </li>
              ))}
            </ul>

            <p className="text-green-700 font-semibold mt-3">
              ✔ Completed
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
