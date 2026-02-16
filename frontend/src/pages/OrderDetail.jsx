// src/pages/OrderDetail.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getProducts } from "../api/products.jsx";
import { addOrderItem, completeOrder, getOrderDetail } from "../api/orders.jsx";

function centsToDollars(cents) {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function OrderDetail() {
  const { orderId } = useParams();

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
        const [ps] = await Promise.all([getProducts()]);
        setProducts(ps.filter((p) => p.isActive !== false));
        if (ps.length > 0) setProductId(String(ps[0].productId));
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

  if (loading) return <div style={{ padding: 16 }}>Loading...</div>;
  if (err) return <div style={{ padding: 16, color: "red" }}>{err}</div>;
  if (!detail) return <div style={{ padding: 16 }}>No order detail.</div>;

  const isCompleted = detail.status === "COMPLETED";

  return (
    <div style={{ padding: 16 }}>
      <h2>Order #{detail.orderId}</h2>
      <div>
        Status: <b>{detail.status}</b>
      </div>

      <hr />

      <h3>Add Item</h3>

      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <select
          disabled={isCompleted || actionLoading}
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        >
          {products.map((p) => (
            <option key={p.productId} value={p.productId}>
              {p.name} ({centsToDollars(p.priceCents)})
            </option>
          ))}
        </select>

        <input
          disabled={isCompleted || actionLoading}
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          style={{ width: 90 }}
        />

        <button
          disabled={isCompleted || actionLoading || !productId || quantity < 1}
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
          Add
        </button>

        <button
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
          Complete Order
        </button>
      </div>

      {err && <div style={{ marginTop: 8, color: "red" }}>{err}</div>}

      <hr />

      <h3>Items</h3>
      {detail.items?.length ? (
        <table
          border="1"
          cellPadding="8"
          style={{ borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              <th>Product</th>
              <th>Qty</th>
              <th>Unit</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {detail.items.map((it, idx) => (
              <tr key={idx}>
                <td>{it.productName}</td>
                <td>{it.quantity}</td>
                <td>{centsToDollars(it.priceCents)}</td>
                <td>{centsToDollars(it.priceCents * it.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>No items yet.</div>
      )}

      <div style={{ marginTop: 12 }}>
        <b>Total:</b> {centsToDollars(totalCents)}
      </div>
    </div>
  );
}
