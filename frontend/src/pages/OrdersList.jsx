// src/pages/OrdersList.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { listOrders } from "../api/orders.jsx";
import { createOrder } from "../api/orders.jsx";
import { useNavigate } from "react-router-dom";

function StatusBadge({ status }) {
  const s = String(status || "").toUpperCase();
  const style =
    s === "COMPLETED"
      ? {
          background: "rgba(50,196,141,0.14)",
          borderColor: "rgba(50,196,141,0.28)",
          color: "#065f46",
        }
      : s === "CREATED"
        ? {
            background: "rgba(255,91,138,0.12)",
            borderColor: "rgba(255,91,138,0.26)",
            color: "#9f1239",
          }
        : {
            background: "rgba(100,116,139,0.10)",
            borderColor: "rgba(100,116,139,0.22)",
            color: "var(--muted)",
          };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "6px 10px",
        borderRadius: 999,
        border: `1px solid ${style.borderColor}`,
        background: style.background,
        color: style.color,
        fontSize: 12,
        fontWeight: 700,
      }}
    >
      {s || "—"}
    </span>
  );
}

export default function OrdersList() {
  const [status, setStatus] = useState(""); // "" / "CREATED" / "COMPLETED"
  const [orders, setOrders] = useState([]);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();
  const [creating, setCreating] = useState(false);

  async function load() {
    try {
      setErr(null);
      setLoading(true);
      const data = await listOrders({
        status: status || null,
        limit: 50,
        offset: 0,
      });
      setOrders(data);
    } catch (e) {
      setErr(e?.message ?? "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const total = orders?.length ?? 0;

  const statusLabel = useMemo(() => {
    if (!status) return "All";
    return status;
  }, [status]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Header */}
      <div className="card" style={{ padding: 18 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div style={{ fontSize: 22, fontWeight: 900 }}>Orders</div>
            <div style={{ color: "var(--muted)", marginTop: 6 }}>
              Showing <b>{statusLabel}</b> ·{" "}
              {loading ? "Loading..." : `${total} orders`}
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button
              className="btn btn-primary"
              disabled={creating}
              onClick={async () => {
                try {
                  setCreating(true);
                  const res = await createOrder(); // { orderId, status }
                  nav(`/orders/${res.orderId}`);
                } catch (e) {
                  setErr(e?.message ?? "Failed to create order");
                } finally {
                  setCreating(false);
                }
              }}
            >
              {creating ? "Creating..." : "+ Create Order"}
            </button>
            <button className="btn" onClick={load} disabled={loading}>
              Refresh
            </button>
          </div>
        </div>

        {/* Filters */}
        <div
          style={{
            marginTop: 14,
            display: "flex",
            gap: 10,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <span className="pill">Filter</span>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "var(--muted)", fontSize: 13 }}>Status</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="input"
              style={{ padding: "10px 12px", width: 180 }}
            >
              <option value="">ALL</option>
              <option value="CREATED">CREATED</option>
              <option value="COMPLETED">COMPLETED</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error */}
      {err && (
        <div
          className="card"
          style={{
            padding: 14,
            border: "1px solid rgba(185,28,28,0.18)",
            background: "rgba(185,28,28,0.06)",
            color: "#b91c1c",
          }}
        >
          {err}
        </div>
      )}

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: 14, borderBottom: "1px solid var(--border)" }}>
          <div style={{ fontWeight: 900 }}>Order List</div>
          <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 6 }}>
            Click “Open” to view details and add items.
          </div>
        </div>

        {loading ? (
          <div style={{ padding: 18, color: "var(--muted)" }}>
            Loading orders...
          </div>
        ) : orders.length === 0 ? (
          <div style={{ padding: 18, color: "var(--muted)" }}>
            No orders found for this filter.
          </div>
        ) : (
          <div style={{ width: "100%", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.7)" }}>
                  <th style={thStyle}>Order ID</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Created At</th>
                  <th style={thStyle} />
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.orderId} style={rowStyle}>
                    <td style={tdStyle}>
                      <span style={{ fontWeight: 800 }}>#{o.orderId}</span>
                    </td>
                    <td style={tdStyle}>
                      <StatusBadge status={o.status} />
                    </td>
                    <td style={tdStyle}>
                      <span style={{ color: "var(--muted)" }}>
                        {o.createdAt ?? "—"}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>
                      <Link
                        to={`/orders/${o.orderId}`}
                        className="btn"
                        style={{ padding: "8px 10px", borderRadius: 12 }}
                      >
                        Open
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const thStyle = {
  textAlign: "left",
  padding: "12px 14px",
  fontSize: 12,
  color: "var(--muted)",
  borderBottom: "1px solid var(--border)",
  whiteSpace: "nowrap",
};

const tdStyle = {
  padding: "12px 14px",
  borderBottom: "1px solid var(--border)",
  whiteSpace: "nowrap",
};

const rowStyle = {
  background: "transparent",
};
