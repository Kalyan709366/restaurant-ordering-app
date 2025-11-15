"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function SubmitOrderPage() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (!cart.length) return alert("Cart is empty!");

    setLoading(true);

    const { data: order } = await supabase
      .from("orders")
      .insert({ phone })
      .select()
      .single();

    for (const item of cart) {
      await supabase.from("order_items").insert({
        order_id: order.id,
        menu_id: item.id,
        quantity: item.quantity,
      });
    }

    localStorage.removeItem("cart");
    window.location.href = `/order-status/${order.id}`;
  }

  return (
    <div className="container py-5">
      <h1 className="fw-bold mb-4" style={{ color: "#b85c38" }}>
        Submit Order
      </h1>

      <div className="card shadow-sm p-4 border-0 rounded-4">
        <label className="form-label fw-bold">Phone Number</label>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Enter your phone"
          onChange={(e) => setPhone(e.target.value)}
        />

        <button
          onClick={submit}
          disabled={loading}
          className="btn btn-lg w-100"
          style={{ background: "#4aa96c", color: "white" }}
        >
          {loading ? "Submitting..." : "Submit Order"}
        </button>
      </div>
    </div>
  );
}
