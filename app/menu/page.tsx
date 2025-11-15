"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function MenuPage() {
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("menu").select("*");
      setMenu(data || []);
    }
    load();
  }, []);

  function addToCart(item) {
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const exist = cart.find((c) => c.id === item.id);

    if (exist) exist.quantity++;
    else cart.push({ ...item, quantity: 1 });

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart!");
  }

  return (
    <div className="container py-5">
      <h1 className="fw-bold mb-4 text-center" style={{ color: "#b85c38" }}>
        Our Menu
      </h1>

      <div className="row g-4">
        {menu.map((item) => (
          <div key={item.id} className="col-md-4">
            <div className="card shadow-sm border-0 rounded-4">
              <img
                src={item.image_url}
                className="card-img-top rounded-top-4"
                style={{ height: "220px", objectFit: "cover" }}
              />

              <div className="card-body">
                <h5 className="card-title fw-bold">{item.name}</h5>

                <p className="text-muted mb-2" style={{ fontSize: "1.1rem" }}>
                  ${item.price}
                </p>

                <button
                  className="btn w-100"
                  style={{ background: "#b85c38", color: "white" }}
                  onClick={() => addToCart(item)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating cart button */}
      <a
        href="/cart"
        className="btn position-fixed px-4 py-3 shadow-lg"
        style={{
          background: "#4aa96c",
          color: "white",
          bottom: "30px",
          right: "30px",
          borderRadius: "50px",
        }}
      >
        Go to Cart
      </a>
    </div>
  );
}
