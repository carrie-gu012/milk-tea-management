// src/pages/OrderCreate.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../api/orders.jsx";

export default function OrderCreate() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div
        className="card"
        style={{
          padding: 24,
          maxWidth: 600,
          width: "100%",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 22, fontWeight: 900 }}>Create New Order</div>
          <div style={{ color: "var(--muted)", marginTop: 6 }}>
            Start a new customer order and add items.
          </div>
        </div>

        {/* Error */}
        {err && (
          <div
            style={{
              marginBottom: 16,
              color: "#b91c1c",
              background: "rgba(185,28,28,0.06)",
              border: "1px solid rgba(185,28,28,0.18)",
              padding: "10px 12px",
              borderRadius: 14,
            }}
          >
            {err}
          </div>
        )}

        {/* Content */}
        <div
          style={{
            border: "1px dashed var(--border)",
            borderRadius: 14,
            padding: 18,
            background: "rgba(255,255,255,0.7)",
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 8 }}>
            Ready to create a new order?
          </div>

          <div style={{ color: "var(--muted)", fontSize: 14 }}>
            Click the button below to generate a new order ID. After creation,
            you will be redirected to the order detail page.
          </div>

          <div style={{ marginTop: 20 }}>
            <button
              className="btn btn-primary"
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
              {loading ? "Creating Order..." : "Create Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
