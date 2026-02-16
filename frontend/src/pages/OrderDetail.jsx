// src/pages/OrderDetail.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProducts } from "../api/products.jsx";
import { addOrderItem, completeOrder, getOrderDetail } from "../api/orders.jsx";

function centsToDollars(cents) {
  return `$${(cents / 100).toFixed(2)}`;
}

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
        fontWeight: 800,
      }}
    >
      {s || "—"}
    </span>
  );
}

export default function OrderDetail() {
  const { orderId } = useParams();
  const nav = useNavigate();

  const [products, setProducts] = useState([]);
  const [detail, setDetail] = useState(null);

  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [err, setErr] = useState(null);

  async function refresh() {
    const d = await getOrderDetail(orderId);
    setDetail(d);
  }

  useEffect(() => {
    (async () => {
      try {
        setErr(null);
        setLoading(true);

        const ps = await getProducts();
        const active = ps.filter((p) => p.isActive !== false);
        setProducts(active);
        if (active.length > 0) setProductId(String(active[0].productId));

        await refresh();
      } catch (e) {
        setErr(e?.message ?? "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const totalCents = useMemo(() => {
    if (!detail?.items) return 0;
    return detail.items.reduce(
      (sum, it) => sum + it.priceCents * it.quantity,
      0,
    );
  }, [detail]);

  if (loading)
    return (
      <div className="card" style={{ padding: 18 }}>
        Loading...
      </div>
    );
  if (err) {
    return (
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
    );
  }
  if (!detail)
    return (
      <div className="card" style={{ padding: 18 }}>
        No order detail.
      </div>
    );

  const isCompleted = detail.status === "COMPLETED";

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
            <div style={{ fontSize: 22, fontWeight: 900 }}>
              Order #{detail.orderId}
            </div>
            <div
              style={{
                marginTop: 8,
                display: "flex",
                gap: 10,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <StatusBadge status={detail.status} />
              <span className="pill">Total: {centsToDollars(totalCents)}</span>
              <span className="pill">Items: {detail.items?.length ?? 0}</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button className="btn" onClick={() => nav("/orders")}>
              Back to Orders
            </button>

            <button
              className="btn btn-primary"
              disabled={isCompleted || actionLoading}
              onClick={async () => {
                try {
                  setErr(null);
                  setActionLoading(true);
                  await completeOrder(detail.orderId);
                  await refresh();
                } catch (e) {
                  setErr(e?.message ?? "Failed to complete order");
                } finally {
                  setActionLoading(false);
                }
              }}
            >
              {actionLoading
                ? "Working..."
                : isCompleted
                  ? "Completed"
                  : "Complete Order"}
            </button>
          </div>
        </div>

        {err && (
          <div
            style={{
              marginTop: 12,
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
      </div>

      {/* Add Item */}
      <div className="card" style={{ padding: 18 }}>
        <div style={{ fontWeight: 900 }}>Add Item</div>
        <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 6 }}>
          Select a product and quantity to add into this order.
        </div>

        <div
          style={{
            marginTop: 12,
            display: "flex",
            gap: 10,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <select
            className="input"
            style={{ padding: "10px 12px", minWidth: 260 }}
            disabled={isCompleted || actionLoading}
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
          >
            {products.map((p) => (
              <option key={p.productId} value={p.productId}>
                {p.name} · {centsToDollars(p.priceCents)}
              </option>
            ))}
          </select>

          <input
            className="input"
            style={{ padding: "10px 12px", width: 120 }}
            disabled={isCompleted || actionLoading}
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />

          <button
            className="btn btn-primary"
            disabled={
              isCompleted || actionLoading || !productId || quantity < 1
            }
            onClick={async () => {
              try {
                setErr(null);
                setActionLoading(true);
                await addOrderItem(detail.orderId, {
                  productId: Number(productId),
                  quantity: Number(quantity),
                });
                await refresh();
              } catch (e) {
                setErr(e?.message ?? "Failed to add item");
              } finally {
                setActionLoading(false);
              }
            }}
          >
            {actionLoading ? "Adding..." : "Add"}
          </button>

          {isCompleted && (
            <span className="pill">
              This order is completed. No more changes.
            </span>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: 14, borderBottom: "1px solid var(--border)" }}>
          <div style={{ fontWeight: 900 }}>Items</div>
          <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 6 }}>
            {detail.items?.length
              ? "Order items list"
              : "No items yet. Add the first item above."}
          </div>
        </div>

        {detail.items?.length ? (
          <div style={{ width: "100%", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.7)" }}>
                  <th style={thStyle}>Product</th>
                  <th style={thStyle}>Qty</th>
                  <th style={thStyle}>Unit</th>
                  <th style={{ ...thStyle, textAlign: "right" }}>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {detail.items.map((it, idx) => (
                  <tr key={idx}>
                    <td style={tdStyle}>{it.productName}</td>
                    <td style={tdStyle}>{it.quantity}</td>
                    <td style={tdStyle}>{centsToDollars(it.priceCents)}</td>
                    <td
                      style={{
                        ...tdStyle,
                        textAlign: "right",
                        fontWeight: 800,
                      }}
                    >
                      {centsToDollars(it.priceCents * it.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: 18, color: "var(--muted)" }}>
            No items yet.
          </div>
        )}

        <div
          style={{
            padding: 14,
            borderTop: "1px solid var(--border)",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <div style={{ fontWeight: 900 }}>
            Total: {centsToDollars(totalCents)}
          </div>
        </div>
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
