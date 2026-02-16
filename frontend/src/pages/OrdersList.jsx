// src/pages/OrdersList.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listOrders } from "../api/orders.jsx";

export default function OrdersList() {
  const [status, setStatus] = useState(""); // "" / "CREATED" / "COMPLETED"
  const [orders, setOrders] = useState([]);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div style={{ padding: 16 }}>
      <h2>Orders</h2>

      <div style={{ marginBottom: 12 }}>
        <Link to="/orders/new">+ Create Order</Link>
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <span>Status:</span>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">ALL</option>
          <option value="CREATED">CREATED</option>
          <option value="COMPLETED">COMPLETED</option>
        </select>

        <button onClick={load}>Refresh</button>
      </div>

      {loading && <div style={{ marginTop: 12 }}>Loading...</div>}
      {err && <div style={{ marginTop: 12, color: "red" }}>{err}</div>}

      {!loading && !err && (
        <table
          border="1"
          cellPadding="8"
          style={{ marginTop: 12, borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.orderId}>
                <td>{o.orderId}</td>
                <td>{o.status}</td>
                <td>{o.createdAt}</td>
                <td>
                  <Link to={`/orders/${o.orderId}`}>Open</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
