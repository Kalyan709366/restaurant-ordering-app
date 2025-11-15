"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(e) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Invalid login");
    } else {
      window.location.href = "/admin/menu";
    }

    setLoading(false);
  }

  return (
    <div className="d-flex justify-content-center py-5">
      <div className="card shadow p-4" style={{ width: "400px" }}>
        <h3 className="fw-bold mb-3 text-center" style={{ color: "#b85c38" }}>
          Admin Login
        </h3>

        <form onSubmit={login}>
          <label className="form-label fw-bold">Email</label>
          <input
            type="email"
            className="form-control mb-3"
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="form-label fw-bold">Password</label>
          <input
            type="password"
            className="form-control mb-3"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="btn w-100"
            style={{ background: "#b85c38", color: "white" }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
