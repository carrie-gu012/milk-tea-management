// src/pages/OrderCreate.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../api/orders.jsx";

export default function OrderCreate() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  return (
    <div style={{ padding: 16 }}>
      <h2>Create Order</h2>

      {err && <div style={{ color: "red" }}>{err}</div>}

      <button
        disabled={loading}
        onClick={async () => {
          try {
            setErr(null);
            setLoading(true);
            const res = await createOrder(); // { orderId, status }
            nav(`/orders/${res.orderId}`);
          } catch (e) {
            setErr(e?.message ?? "Failed to create order");
          } finally {
            setLoading(false);
          }
        }}
      >
        {loading ? "Creating..." : "Create New Order"}
      </button>
    </div>
  );
}
