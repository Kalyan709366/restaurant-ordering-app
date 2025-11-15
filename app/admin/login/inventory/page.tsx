"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";

export default function InventoryAdmin() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [qty, setQty] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data } = await supabase.from("inventory").select("*");
    setItems(data || []);
  }

  async function addItem() {
    await supabase.from("inventory").insert({ name, quantity: qty });
    setName("");
    setQty("");
    load();
  }

  return (
    <>
      <h2 className="fw-bold mb-4" style={{ color: "#b85c38" }}>
        Inventory
      </h2>

      <div className="card shadow p-4 mb-4">
        <h5 className="fw-bold mb-3">Add New Item</h5>

        <div className="row g-3">
          <div className="col-md-5">
            <input
              className="form-control"
              placeholder="Item name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="col-md-3">
            <input
              className="form-control"
              placeholder="Quantity"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
            />
          </div>

          <div className="col-md-3">
            <button
              className="btn w-100"
              style={{ background: "#4aa96c", color: "white" }}
              onClick={addItem}
            >
              Add
            </button>
          </div>
        </div>
      </div>

      <table className="table table-bordered shadow-sm bg-white">
        <thead className="table-light">
          <tr>
            <th>Name</th>
            <th>Quantity</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
