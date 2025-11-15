"use client";

import { useEffect, useState } from "react";

export default function CartPage() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("cart") || "[]"));
  }, []);

  function updateQty(id, delta) {
    const updated = cart.map((item) =>
      item.id === id
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    );
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  }

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div className="container py-5">
      <h1 className="fw-bold mb-4" style={{ color: "#b85c38" }}>
        Your Cart
      </h1>

      {cart.length === 0 ? (
        <div className="alert alert-warning">Your cart is empty.</div>
      ) : (
        <>
          {cart.map((item) => (
            <div
              key={item.id}
              className="card shadow-sm mb-4 border-0 rounded-4"
            >
              <div className="card-body d-flex justify-content-between">
                <div>
                  <h5 className="fw-bold">{item.name}</h5>
                  <p className="text-muted">${item.price}</p>
                </div>

                <div className="d-flex align-items-center gap-3">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => updateQty(item.id, -1)}
                  >
                    -
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => updateQty(item.id, 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}

          <h3 className="fw-bold mt-4">Total: ${total.toFixed(2)}</h3>

          <a
            href="/submit-order"
            className="btn btn-lg mt-4"
            style={{ background: "#4aa96c", color: "white" }}
          >
            Submit Order
          </a>
        </>
      )}
    </div>
  );
}
