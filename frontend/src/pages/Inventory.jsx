import React, { useEffect, useMemo, useState } from "react";
import {
  addInventoryStock,
  getInventory,
  setInventoryQuantity,
} from "../api/inventory.jsx";

const LOW_STOCK = 10;

function getErrMsg(e) {
  if (!e) return "Unknown error";
  if (typeof e === "string") return e;
  return e.message || "Request failed";
}

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [q, setQ] = useState("");
  const [sort, setSort] = useState("qtyAsc");

  const [deltaDraft, setDeltaDraft] = useState({});
  const [qtyDraft, setQtyDraft] = useState({});

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const data = await getInventory();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(getErrMsg(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const view = useMemo(() => {
    const qq = q.trim().toLowerCase();
    let arr = items;

    if (qq) {
      arr = arr.filter((x) =>
        String(x.ingredientName || "").toLowerCase().includes(qq),
      );
    }

    const getQty = (x) => Number(x.quantity ?? 0);
    const getName = (x) => String(x.ingredientName ?? "");

    if (sort === "qtyAsc") arr = [...arr].sort((a, b) => getQty(a) - getQty(b));
    if (sort === "qtyDesc")
      arr = [...arr].sort((a, b) => getQty(b) - getQty(a));
    if (sort === "nameAsc")
      arr = [...arr].sort((a, b) => getName(a).localeCompare(getName(b)));

    return arr;
  }, [items, q, sort]);

  function statusOf(qty) {
    if (qty <= 0) return { text: "Out of stock", tone: "danger" };
    if (qty <= LOW_STOCK) return { text: "Low", tone: "warn" };
    return { text: "OK", tone: "ok" };
  }

  function pillStyle(tone) {
    if (tone === "danger") {
      return {
        borderColor: "rgba(255, 91, 138, 0.26)",
        background: "rgba(255, 91, 138, 0.10)",
        color: "var(--pink)",
        fontWeight: 800,
      };
    }
    if (tone === "warn") {
      return {
        borderColor: "rgba(245, 158, 11, 0.28)",
        background: "rgba(245, 158, 11, 0.12)",
        color: "#92400e",
        fontWeight: 800,
      };
    }
    return {
      borderColor: "rgba(50, 196, 141, 0.28)",
      background: "rgba(50, 196, 141, 0.10)",
      color: "var(--mint)",
      fontWeight: 800,
    };
  }

  async function onAdd(id) {
    setErr("");
    const raw = deltaDraft[id];
    const delta = Number(raw);

    if (!Number.isInteger(delta) || delta <= 0) {
      setErr("delta must be a positive integer");
      return;
    }

    try {
      await addInventoryStock(id, delta);
      setDeltaDraft((m) => ({ ...m, [id]: "" }));
      await load();
    } catch (e) {
      setErr(getErrMsg(e));
    }
  }

  async function onSet(id) {
    setErr("");
    const raw = qtyDraft[id];
    const quantity = Number(raw);

    if (!Number.isInteger(quantity) || quantity < 0) {
      setErr("quantity must be an integer >= 0");
      return;
    }

    try {
      await setInventoryQuantity(id, quantity);
      setQtyDraft((m) => ({ ...m, [id]: "" }));
      await load();
    } catch (e) {
      setErr(getErrMsg(e));
    }
  }

  return (
    <div className="container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          alignItems: "flex-start",
        }}
      >
        <div>
          <h1 className="h1" style={{ fontSize: 26, margin: 0 }}>
            Inventory
          </h1>
          <p className="sub" style={{ marginTop: 8 }}>
            Manage ingredient stock levels. Use <b>Add</b> to restock, and{" "}
            <b>Set</b> for stock-taking adjustments.
          </p>
        </div>

        <button className="btn" onClick={load} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="card card-pad" style={{ marginTop: 14 }}>
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div style={{ flex: "1 1 260px" }}>
            <div className="label" style={{ marginBottom: 6 }}>
              Search
            </div>
            <input
              className="input"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search ingredients..."
            />
          </div>

          <div style={{ width: 220 }}>
            <div className="label" style={{ marginBottom: 6 }}>
              Sort
            </div>
            <select
              className="input"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="qtyAsc">Quantity ↑</option>
              <option value="qtyDesc">Quantity ↓</option>
              <option value="nameAsc">Name A→Z</option>
            </select>
          </div>

          <span className="pill">Low stock ≤ {LOW_STOCK}</span>
        </div>

        {err ? <div className="err">{err}</div> : null}
      </div>

      <div className="card" style={{ marginTop: 14 }}>
        <div
          className="card-pad"
          style={{
            paddingBottom: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ fontWeight: 900 }}>
            Ingredients{" "}
            <span style={{ color: "var(--muted)", fontWeight: 700 }}>
              ({view.length})
            </span>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Unit</th>
                <th style={thStyle}>Quantity</th>
                <th style={thStyle}>Status</th>
                <th style={{ ...thStyle, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={tdMuted}>
                    Loading inventory...
                  </td>
                </tr>
              ) : view.length === 0 ? (
                <tr>
                  <td colSpan={6} style={tdMuted}>
                    No inventory items found.
                  </td>
                </tr>
              ) : (
                view.map((x) => {
                  const id = x.ingredientId;
                  const qty = Number(x.quantity ?? 0);
                  const st = statusOf(qty);

                  return (
                    <tr key={id}>
                      <td style={tdMuted}>{id}</td>
                      <td style={tdBold}>{x.ingredientName}</td>
                      <td style={tdMuted}>{x.unit}</td>
                      <td style={tdBold}>{qty}</td>
                      <td style={tdBase}>
                        <span className="pill" style={pillStyle(st.tone)}>
                          {st.text}
                        </span>
                      </td>

                      <td style={{ ...tdBase, textAlign: "right" }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: 12,
                            flexWrap: "wrap",
                          }}
                        >
                          <div style={{ display: "flex", gap: 8 }}>
                            <input
                              className="input"
                              value={deltaDraft[id] ?? ""}
                              onChange={(e) =>
                                setDeltaDraft((m) => ({
                                  ...m,
                                  [id]: e.target.value,
                                }))
                              }
                              placeholder="delta"
                              style={{ width: 110 }}
                            />
                            <button
                              className="btn btn-primary"
                              onClick={() => onAdd(id)}
                            >
                              Add
                            </button>
                          </div>

                          <div style={{ display: "flex", gap: 8 }}>
                            <input
                              className="input"
                              value={qtyDraft[id] ?? ""}
                              onChange={(e) =>
                                setQtyDraft((m) => ({
                                  ...m,
                                  [id]: e.target.value,
                                }))
                              }
                              placeholder="set qty"
                              style={{ width: 130 }}
                            />
                            <button
                              className="btn btn-primary"
                              onClick={() => onSet(id)}
                            >
                              Set
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const thStyle = {
  padding: "12px 18px",
  borderTop: "1px solid var(--border)",
  borderBottom: "1px solid var(--border)",
  color: "var(--muted)",
  fontSize: 13,
  textAlign: "left",
};

const tdBase = {
  padding: "14px 18px",
  borderBottom: "1px solid var(--border)",
};

const tdMuted = {
  ...tdBase,
  color: "var(--muted)",
};

const tdBold = {
  ...tdBase,
  fontWeight: 900,
};
