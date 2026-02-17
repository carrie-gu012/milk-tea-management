import React, { useEffect, useMemo, useState } from "react";
import {
  addInventoryStock,
  getInventory,
  setInventoryQuantity,
} from "../api/inventory.jsx";
import {
  createIngredient,
  updateIngredient,
  deleteIngredient,
} from "../api/ingredients.jsx";

const LOW_STOCK = 500;
const PAGE_SIZE = 30;

function getErrMsg(e) {
  if (!e) return "Unknown error";
  if (typeof e === "string") return e;
  return e.message || "Request failed";
}

function Modal({ open, title, children, onClose }) {
  if (!open) return null;
  return (
    <div
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(2,6,23,0.45)",
        display: "grid",
        placeItems: "center",
        zIndex: 50,
        padding: 16,
      }}
    >
      <div
        className="card"
        style={{
          width: "min(520px, 100%)",
          borderRadius: "var(--radius)",
        }}
      >
        <div
          className="card-pad"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <div style={{ fontWeight: 900, fontSize: 16 }}>{title}</div>
          <button className="btn" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="card-pad" style={{ paddingTop: 0 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [q, setQ] = useState("");
  const [sort, setSort] = useState("qtyAsc");

  const [deltaDraft, setDeltaDraft] = useState({});
  const [qtyDraft, setQtyDraft] = useState({});


  const [page, setPage] = useState(1);


  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [delOpen, setDelOpen] = useState(false);

  const [selected, setSelected] = useState(null); 


  const [formName, setFormName] = useState("");
  const [formUnit, setFormUnit] = useState("");
  const [formInitialQty, setFormInitialQty] = useState("0"); 

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
        String(x.ingredientName || "")
          .toLowerCase()
          .includes(qq),
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


  useEffect(() => {
    setPage(1);
  }, [q, sort]);


  const totalPages = Math.max(1, Math.ceil(view.length / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const paged = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return view.slice(start, start + PAGE_SIZE);
  }, [view, safePage]);

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

  async function onAddStock(id) {
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

  async function onSetQty(id) {
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



  function openAdd() {
    setErr("");
    setFormName("");
    setFormUnit("");
    setFormInitialQty("0");
    setAddOpen(true);
  }

  function openEdit(row) {
    setErr("");
    setSelected(row);
    setFormName(row.ingredientName || "");
    setFormUnit(row.unit || "");
    setEditOpen(true);
  }

  function openDelete(row) {
    setErr("");
    setSelected(row);
    setDelOpen(true);
  }

  async function submitAddIngredient() {
    setErr("");
    const name = formName.trim();
    const unit = formUnit.trim();
    const initialQuantity = Number(formInitialQty);

    if (!name) {
      setErr("Ingredient name is required");
      return;
    }
    if (!unit) {
      setErr("Unit is required (e.g., g, ml)");
      return;
    }
    if (!Number.isInteger(initialQuantity) || initialQuantity < 0) {
      setErr("Initial quantity must be an integer >= 0");
      return;
    }

    try {
      await createIngredient({ ingredientName: name, unit, initialQuantity });
      setAddOpen(false);
      await load();
    } catch (e) {
      setErr(getErrMsg(e));
    }
  }

  async function submitEditIngredient() {
    setErr("");
    if (!selected) return;

    const name = formName.trim();
    const unit = formUnit.trim();

    if (!name) {
      setErr("Ingredient name is required");
      return;
    }
    if (!unit) {
      setErr("Unit is required");
      return;
    }

    try {
      await updateIngredient(selected.ingredientId, {
        ingredientName: name,
        unit,
      });
      setEditOpen(false);
      setSelected(null);
      await load();
    } catch (e) {
      setErr(getErrMsg(e));
    }
  }

  async function submitDeleteIngredient() {
    setErr("");
    if (!selected) return;

    try {
      await deleteIngredient(selected.ingredientId);
      setDelOpen(false);
      setSelected(null);
      await load();
    } catch (e) {
      setErr(
        getErrMsg(e) ||
          "Delete failed. This ingredient may be referenced by recipes.",
      );
    }
  }

  return (
    <div className="container">
      {/* Header */}
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

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button className="btn btn-primary" onClick={openAdd}>
            + Add Ingredient
          </button>
          <button className="btn" onClick={load} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* Controls */}
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
          <span className="pill">Page size: {PAGE_SIZE}</span>
        </div>

        {err ? <div className="err">{err}</div> : null}
      </div>

      {/* Table Card */}
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


          <span className="pill">
            Page {safePage} / {totalPages}
          </span>
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
              ) : paged.length === 0 ? (
                <tr>
                  <td colSpan={6} style={tdMuted}>
                    No inventory items found.
                  </td>
                </tr>
              ) : (
                paged.map((x) => {
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
                            gap: 10,
                            flexWrap: "wrap",
                            alignItems: "center",
                          }}
                        >
                          {/* 库存操作 */}
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
                              onClick={() => onAddStock(id)}
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
                              onClick={() => onSetQty(id)}
                            >
                              Set
                            </button>
                          </div>


                          <button className="btn" onClick={() => openEdit(x)}>
                            Edit
                          </button>
                          <button className="btn" onClick={() => openDelete(x)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>


        <div
          className="card-pad"
          style={{
            paddingTop: 12,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span className="pill">
            Showing {(safePage - 1) * PAGE_SIZE + 1}-
            {Math.min(safePage * PAGE_SIZE, view.length)} of {view.length}
          </span>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button
              className="btn"
              disabled={safePage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </button>
            <button
              className="btn"
              disabled={safePage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* ============ Add Modal ============ */}
      <Modal
        open={addOpen}
        title="Add Ingredient"
        onClose={() => setAddOpen(false)}
      >
        <div className="field">
          <div className="label">Ingredient Name</div>
          <input
            className="input"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="e.g., Pearl, Milk, Black Tea"
          />
        </div>

        <div className="field">
          <div className="label">Unit</div>
          <input
            className="input"
            value={formUnit}
            onChange={(e) => setFormUnit(e.target.value)}
            placeholder="e.g., g, ml"
          />
        </div>

        <div className="field">
          <div className="label">Initial Quantity</div>
          <input
            className="input"
            value={formInitialQty}
            onChange={(e) => setFormInitialQty(e.target.value)}
            placeholder="0"
          />
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <button className="btn" onClick={() => setAddOpen(false)}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={submitAddIngredient}>
            Create
          </button>
        </div>
      </Modal>

      {/* ============ Edit Modal ============ */}
      <Modal
        open={editOpen}
        title="Edit Ingredient"
        onClose={() => setEditOpen(false)}
      >
        <div className="field">
          <div className="label">Ingredient Name</div>
          <input
            className="input"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
          />
        </div>

        <div className="field">
          <div className="label">Unit</div>
          <input
            className="input"
            value={formUnit}
            onChange={(e) => setFormUnit(e.target.value)}
          />
        </div>

        <div style={{ marginTop: 10 }}>
          <span className="pill">
            Quantity is managed via “Set qty” in the table.
          </span>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <button className="btn" onClick={() => setEditOpen(false)}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={submitEditIngredient}>
            Save
          </button>
        </div>
      </Modal>

      {/* ============ Delete Confirm Modal ============ */}
      <Modal
        open={delOpen}
        title="Delete Ingredient"
        onClose={() => setDelOpen(false)}
      >
        <div style={{ color: "var(--muted)", lineHeight: 1.6 }}>
          Are you sure you want to delete{" "}
          <b style={{ color: "var(--text)" }}>
            {selected?.ingredientName || "this ingredient"}
          </b>
          ?
          <div style={{ marginTop: 10 }}>
            <span className="pill" style={pillStyle("warn")}>
              If this ingredient is used by recipes, delete may fail.
            </span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <button className="btn" onClick={() => setDelOpen(false)}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={submitDeleteIngredient}>
            Delete
          </button>
        </div>
      </Modal>
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
