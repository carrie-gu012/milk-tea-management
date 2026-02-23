import React, { useEffect, useMemo, useState } from "react";

export default function Products() {
  const role = localStorage.getItem("role");

  const [products, setProducts] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  // ✅ 网站风格提示（Toast）
  const [toast, setToast] = useState(null); // {type:'success'|'error'|'info'|'warn', title, message}
  // ✅ 网站风格确认弹窗（Confirm Modal）
  const [confirm, setConfirm] = useState(null); // {title, message, confirmText, danger, onConfirm}

  useEffect(() => {
    loadProducts();
    loadIngredients();
  }, []);

  function showToast(type, title, message, ms = 2600) {
    setToast({ type, title, message });
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(null), ms);
  }

  function openConfirm({
    title,
    message,
    confirmText = "Confirm",
    danger = false,
    onConfirm,
  }) {
    setConfirm({ title, message, confirmText, danger, onConfirm });
  }

  function closeConfirm() {
    setConfirm(null);
  }

  function loadProducts() {
    fetch("http://localhost:8080/products")
      .then((res) => res.json())
      .then(setProducts)
      .catch(() =>
        showToast(
          "error",
          "Failed",
          "Cannot load products. Is backend running?",
        ),
      );
  }

  function loadIngredients() {
    fetch("http://localhost:8080/ingredients")
      .then((res) => res.json())
      .then(setIngredients)
      .catch(() =>
        showToast(
          "error",
          "Failed",
          "Cannot load ingredients. Is backend running?",
        ),
      );
  }

  function handleDelete(product) {
    if (product.isActive) {
      // ❌ 不再 alert，用 Toast
      showToast(
        "warn",
        "Cannot delete",
        "Please click Edit and set this product to Inactive first.",
      );
      return;
    }

    // ❌ 不再 window.confirm，用 Confirm Modal
    openConfirm({
      title: "Delete product?",
      message: `This will permanently delete “${product.name}”. This action cannot be undone.`,
      confirmText: "Delete",
      danger: true,
      onConfirm: async () => {
        try {
          await fetch(`http://localhost:8080/products/${product.productId}`, {
            method: "DELETE",
          });
          closeConfirm();
          showToast(
            "success",
            "Deleted",
            `“${product.name}” has been deleted.`,
          );
          loadProducts();
        } catch (e) {
          closeConfirm();
          showToast("error", "Delete failed", "Please try again.");
        }
      },
    });
  }

  function openCreate() {
    setEditingProduct({
      productId: null,
      name: "",
      priceCents: "",
      isActive: true,
      recipe: [],
    });
  }

  function openEdit(product) {
    fetch(`http://localhost:8080/products/${product.productId}`)
      .then((res) => res.json())
      .then((data) => {
        setEditingProduct({
          productId: data.productId,
          name: data.name,
          priceCents: data.priceCents,
          isActive: data.isActive,
          recipe: (data.recipe || []).map((r) => ({
            ingredientId: r.ingredientId,
            qtyRequired: r.qtyRequired,
          })),
        });
      })
      .catch(() => showToast("error", "Failed", "Cannot open this product."));
  }

  const canSave = useMemo(() => {
    if (!editingProduct) return true;
    const nameOk = String(editingProduct.name || "").trim().length > 0;
    const priceOk = String(editingProduct.priceCents || "").trim().length > 0;
    // recipe 行可以为空（允许没有配方），但如果有行则必须选 ingredient + qty
    const recipeOk = (editingProduct.recipe || []).every((r) => {
      if (r.ingredientId === "" && r.qtyRequired === "") return true;
      const ingOk =
        r.ingredientId !== "" && !Number.isNaN(Number(r.ingredientId));
      const qtyOk =
        String(r.qtyRequired || "").trim().length > 0 &&
        Number(r.qtyRequired) > 0;
      return ingOk && qtyOk;
    });
    return nameOk && priceOk && recipeOk;
  }, [editingProduct]);

  function handleSave() {
    // ✅ 也用 Toast 提示校验
    if (!editingProduct.name || !String(editingProduct.name).trim()) {
      showToast("warn", "Missing field", "Please enter a product name.");
      return;
    }
    if (
      editingProduct.priceCents === "" ||
      Number(editingProduct.priceCents) < 0
    ) {
      showToast(
        "warn",
        "Invalid price",
        "Price must be a non-negative number.",
      );
      return;
    }
    if (!canSave) {
      showToast(
        "warn",
        "Check recipe",
        "Recipe rows must have ingredient + qty (> 0).",
      );
      return;
    }

    const method = editingProduct.productId ? "PUT" : "POST";
    const url = editingProduct.productId
      ? `http://localhost:8080/products/${editingProduct.productId}`
      : "http://localhost:8080/products";

    // 清理掉空白 recipe 行
    const cleanedRecipe = (editingProduct.recipe || [])
      .filter((r) => !(r.ingredientId === "" && r.qtyRequired === ""))
      .map((r) => ({
        ingredientId: Number(r.ingredientId),
        qtyRequired: Number(r.qtyRequired),
      }));

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: String(editingProduct.name).trim(),
        priceCents: Number(editingProduct.priceCents),
        isActive: !!editingProduct.isActive,
        recipe: cleanedRecipe,
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(text || "Request failed");
        }
        setEditingProduct(null);
        showToast("success", "Saved", "Product saved successfully.");
        loadProducts();
      })
      .catch(() =>
        showToast(
          "error",
          "Save failed",
          "Please check backend and try again.",
        ),
      );
  }

  function addIngredientRow() {
    setEditingProduct({
      ...editingProduct,
      recipe: [
        ...(editingProduct.recipe || []),
        { ingredientId: "", qtyRequired: "" },
      ],
    });
  }

  function updateRecipe(index, field, value) {
    const updated = [...editingProduct.recipe];
    updated[index][field] = value;
    setEditingProduct({ ...editingProduct, recipe: updated });
  }

  function removeRecipe(index) {
    const updated = editingProduct.recipe.filter((_, i) => i !== index);
    setEditingProduct({ ...editingProduct, recipe: updated });
  }

  return (
    <div className="card card-pad">
      <style>{customStyles}</style>

      {/* ✅ Toast */}
      {toast && (
        <div className="toast-wrap" role="status" aria-live="polite">
          <div className={`toast toast-${toast.type}`}>
            <div className="toast-top">
              <div className="toast-title">{toast.title}</div>
              <button
                className="toast-x"
                onClick={() => setToast(null)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="toast-msg">{toast.message}</div>
          </div>
        </div>
      )}

      {/* ✅ Confirm Modal */}
      {confirm && (
        <div className="modal-overlay" onMouseDown={closeConfirm}>
          <div className="modal card" onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <div className="modal-title">{confirm.title}</div>
                <div className="modal-sub">{confirm.message}</div>
              </div>
              <button
                className="icon-btn"
                onClick={closeConfirm}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="modal-actions">
              <button className="btn" onClick={closeConfirm}>
                Cancel
              </button>
              <button
                className={`btn ${confirm.danger ? "btn-danger" : "btn-primary"}`}
                onClick={confirm.onConfirm}
              >
                {confirm.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="head-row">
        <div>
          <h2 className="page-title">Product Management</h2>
          <div className="page-sub">
            Manage products and their recipes. Inactive products can be deleted.
            (✅Only admin can edit)
          </div>
        </div>

        {role === "ADMIN" && (
          <button className="btn btn-primary" onClick={openCreate}>
            + Add New Product
          </button>
        )}
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th style={{ width: 60 }}>#</th>
              <th>Product Name</th>
              <th style={{ width: 120 }}>Price</th>
              <th style={{ width: 140 }}>Status</th>
              {role === "ADMIN" && (
                <th style={{ textAlign: "right", width: 200 }}>Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {products.map((p, index) => (
              <tr key={p.productId}>
                <td className="muted">{index + 1}</td>
                <td style={{ fontWeight: 800 }}>{p.name}</td>
                <td>${(p.priceCents / 100).toFixed(2)}</td>
                <td>
                  <span
                    className={`status ${p.isActive ? "status-on" : "status-off"}`}
                  >
                    <span
                      className={`dot ${p.isActive ? "dot-on" : "dot-off"}`}
                    />
                    {p.isActive ? "Active" : "Inactive"}
                  </span>
                </td>

                {role === "ADMIN" && (
                  <td style={{ textAlign: "right" }}>
                    <button
                      className="btn btn-ghost"
                      onClick={() => openEdit(p)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-ghost danger"
                      onClick={() => handleDelete(p)}
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td colSpan={role === "ADMIN" ? 5 : 4} className="empty">
                  No products yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Product Editor */}
      {editingProduct && role === "ADMIN" && (
        <div
          className="modal-overlay"
          onMouseDown={() => setEditingProduct(null)}
        >
          <div
            className="modal modal-lg card"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="modal-head">
              <div>
                <div className="modal-title">
                  {editingProduct.productId ? "Edit Product" : "New Product"}
                </div>
                <div className="modal-sub">
                  Fill in product info and recipe ingredients.
                </div>
              </div>
              <button
                className="icon-btn"
                onClick={() => setEditingProduct(null)}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="grid">
              <div className="field">
                <div className="label">Product Name</div>
                <input
                  className="input"
                  placeholder="e.g. Cappuccino"
                  value={editingProduct.name}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      name: e.target.value,
                    })
                  }
                />
              </div>

              <div className="field">
                <div className="label">Price (in cents)</div>
                <input
                  className="input"
                  type="number"
                  placeholder="e.g. 500 for $5.00"
                  value={editingProduct.priceCents}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      priceCents: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="row-between">
              <div>
                <div className="label">Availability Status</div>
                <div className="muted" style={{ marginTop: 2 }}>
                  {editingProduct.isActive
                    ? "Active (Visible to users)"
                    : "Inactive (Hidden)"}
                </div>
              </div>

              <label className="switch">
                <input
                  type="checkbox"
                  checked={editingProduct.isActive}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      isActive: e.target.checked,
                    })
                  }
                />
                <span className="slider" />
              </label>
            </div>

            <div className="recipe card-soft">
              <div className="recipe-head">
                <div>
                  <div className="h4">Recipe Ingredients</div>
                  <div className="muted" style={{ fontSize: 13 }}>
                    Add ingredients and required quantity for 1 product unit.
                  </div>
                </div>
                <button className="btn btn-ghost" onClick={addIngredientRow}>
                  + Add Ingredient
                </button>
              </div>

              <div className="table-wrap soft">
                <table className="table table-soft">
                  <thead>
                    <tr>
                      <th>Ingredient</th>
                      <th style={{ width: 220 }}>Qty Required</th>
                      <th style={{ width: 60 }} />
                    </tr>
                  </thead>
                  <tbody>
                    {editingProduct.recipe.map((r, index) => {
                      const ing = ingredients.find(
                        (i) => i.ingredientId === r.ingredientId,
                      );
                      return (
                        <tr key={index}>
                          <td>
                            <select
                              className="input"
                              value={r.ingredientId}
                              onChange={(e) =>
                                updateRecipe(
                                  index,
                                  "ingredientId",
                                  e.target.value === ""
                                    ? ""
                                    : Number(e.target.value),
                                )
                              }
                            >
                              <option value="">Select...</option>
                              {ingredients.map((i) => (
                                <option
                                  key={i.ingredientId}
                                  value={i.ingredientId}
                                >
                                  {i.ingredientName}
                                </option>
                              ))}
                            </select>
                          </td>

                          <td>
                            <div className="qty-row">
                              <input
                                className="input"
                                style={{ width: 120 }}
                                type="number"
                                min="0"
                                step="0.01"
                                value={r.qtyRequired}
                                onChange={(e) =>
                                  updateRecipe(
                                    index,
                                    "qtyRequired",
                                    e.target.value,
                                  )
                                }
                              />
                              <span className="pill">
                                {ing?.unit || "unit"}
                              </span>
                            </div>
                          </td>

                          <td style={{ textAlign: "right" }}>
                            <button
                              className="icon-btn danger"
                              onClick={() => removeRecipe(index)}
                              aria-label="Remove"
                            >
                              ×
                            </button>
                          </td>
                        </tr>
                      );
                    })}

                    {editingProduct.recipe.length === 0 && (
                      <tr>
                        <td colSpan={3} className="empty">
                          No ingredients yet. Click “Add Ingredient”.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn" onClick={() => setEditingProduct(null)}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSave}
                disabled={!canSave}
              >
                Save Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ✅ 页面内样式：对齐你给的全局主题（pink/mint 渐变、card、border、shadow、radius）
const customStyles = `
  :root{
    --bg: #fbfbfd;
    --card: #ffffff;
    --text: #0f172a;
    --muted: #64748b;
    --border: rgba(15, 23, 42, 0.08);
    --shadow: 0 14px 40px rgba(2, 6, 23, 0.08);
    --radius: 16px;

    --pink: #ff5b8a;
    --pink-soft: rgba(255, 91, 138, 0.14);
    --mint: #32c48d;
    --mint-soft: rgba(50, 196, 141, 0.14);

    --primary: linear-gradient(135deg, var(--pink), var(--mint));
  }

  .card{
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
  }
  .card-pad{ padding: 18px; }

  .page-title{
    margin: 0;
    font-size: 22px;
    letter-spacing: -0.02em;
  }
  .page-sub{
    margin-top: 6px;
    color: var(--muted);
    font-size: 13px;
  }
  .muted{ color: var(--muted); }

  .head-row{
    display:flex;
    align-items:flex-start;
    justify-content:space-between;
    gap: 12px;
    margin-bottom: 14px;
  }

  /* Buttons */
  .btn{
    border: 1px solid var(--border);
    background: rgba(255,255,255,0.9);
    padding: 10px 12px;
    border-radius: 14px;
    cursor:pointer;
    transition: transform .15s ease, box-shadow .15s ease, filter .15s ease;
  }
  .btn:hover{
    transform: translateY(-1px);
    box-shadow: 0 12px 26px rgba(2,6,23,0.10);
  }
  .btn:disabled{
    opacity: .6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  .btn-primary{
    border: none;
    color: white;
    background: var(--primary);
  }
  .btn-primary:hover{ filter: brightness(0.98); }

  .btn-ghost{
    background: rgba(255,255,255,0.75);
  }
  .btn-ghost.danger{
    border-color: rgba(185,28,28,0.18);
    color: #b91c1c;
  }

  .btn-danger{
    border: none;
    color: white;
    background: linear-gradient(135deg, #ef4444, #fb7185);
  }

  /* Table */
  .table-wrap{
    overflow-x:auto;
    border-radius: 14px;
    border: 1px solid var(--border);
    background: rgba(255,255,255,0.85);
  }
  .table{
    width: 100%;
    border-collapse: collapse;
    min-width: 720px;
  }
  .table thead th{
    text-align:left;
    padding: 12px 12px;
    font-size: 12px;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: .06em;
    border-bottom: 1px solid var(--border);
    background:
      radial-gradient(600px 120px at 0% 0%, var(--pink-soft), transparent 60%),
      radial-gradient(600px 120px at 100% 0%, var(--mint-soft), transparent 60%),
      rgba(255,255,255,0.9);
  }
  .table tbody td{
    padding: 14px 12px;
    border-bottom: 1px solid rgba(15,23,42,0.06);
  }
  .table tbody tr:hover td{
    background: rgba(255,255,255,0.92);
  }
  .empty{
    text-align:center;
    color: var(--muted);
    padding: 18px 12px !important;
  }

  /* Status */
  .status{
    display:inline-flex;
    align-items:center;
    gap: 8px;
    padding: 7px 10px;
    border-radius: 999px;
    border: 1px solid var(--border);
    font-size: 13px;
    background: rgba(255,255,255,0.75);
  }
  .dot{
    width: 8px; height: 8px;
    border-radius: 999px;
    box-shadow: 0 0 0 4px rgba(0,0,0,0.03);
  }
  .dot-on{ background: var(--mint); box-shadow: 0 0 0 4px var(--mint-soft); }
  .dot-off{ background: #94a3b8; box-shadow: 0 0 0 4px rgba(148,163,184,0.18); }
  .status-on{ }
  .status-off{ }

  /* Inputs */
  .field{ display:flex; flex-direction:column; gap: 6px; }
  .label{ font-size: 13px; color: var(--muted); }
  .input{
    padding: 12px 12px;
    border-radius: 14px;
    border: 1px solid var(--border);
    background: rgba(251,251,253,0.8);
    outline:none;
    transition: box-shadow .15s ease, border-color .15s ease;
  }
  .input:focus{
    border-color: rgba(255,91,138,0.32);
    box-shadow: 0 0 0 5px rgba(255,91,138,0.12);
  }

  .grid{
    display:grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-top: 10px;
  }
  @media (max-width: 720px){
    .grid{ grid-template-columns: 1fr; }
    .table{ min-width: 0; }
  }

  .row-between{
    margin-top: 14px;
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap: 12px;
    padding: 12px 12px;
    border-radius: 14px;
    border: 1px solid var(--border);
    background: rgba(255,255,255,0.7);
  }

  /* Switch */
  .switch{ position: relative; display: inline-block; width: 46px; height: 26px; }
  .switch input{ opacity: 0; width: 0; height: 0; }
  .slider{
    position:absolute; inset:0;
    cursor:pointer;
    background: rgba(148,163,184,0.55);
    transition: .25s;
    border-radius: 999px;
    border: 1px solid rgba(15,23,42,0.10);
  }
  .slider:before{
    content:"";
    position:absolute;
    height: 20px; width: 20px;
    left: 3px; top: 2px;
    background: white;
    transition: .25s;
    border-radius: 999px;
    box-shadow: 0 8px 18px rgba(2,6,23,0.10);
  }
  .switch input:checked + .slider{
    background: rgba(50,196,141,0.55);
  }
  .switch input:checked + .slider:before{
    transform: translateX(20px);
  }

  /* Modal */
  .modal-overlay{
    position: fixed;
    inset: 0;
    background: rgba(2,6,23,0.48);
    display:flex;
    align-items:center;
    justify-content:center;
    z-index: 1000;
    padding: 18px;
    backdrop-filter: blur(6px);
  }
  .modal{
    width: min(520px, 100%);
    padding: 16px;
    border-radius: 18px;
    animation: pop .14s ease-out;
  }
  .modal-lg{
    width: min(820px, 100%);
  }
  @keyframes pop{
    from{ transform: translateY(6px) scale(0.985); opacity: 0; }
    to{ transform: translateY(0) scale(1); opacity: 1; }
  }
  .modal-head{
    display:flex;
    align-items:flex-start;
    justify-content:space-between;
    gap: 12px;
    margin-bottom: 12px;
  }
  .modal-title{
    font-weight: 900;
    letter-spacing: -0.02em;
    font-size: 18px;
  }
  .modal-sub{
    margin-top: 6px;
    color: var(--muted);
    font-size: 13px;
    line-height: 1.45;
  }
  .icon-btn{
    width: 36px; height: 36px;
    border-radius: 12px;
    border: 1px solid var(--border);
    background: rgba(255,255,255,0.9);
    cursor:pointer;
    font-size: 20px;
    display:grid;
    place-items:center;
    transition: transform .15s ease, box-shadow .15s ease;
  }
  .icon-btn:hover{
    transform: translateY(-1px);
    box-shadow: 0 12px 26px rgba(2,6,23,0.10);
  }
  .icon-btn.danger{
    color: #b91c1c;
    border-color: rgba(185,28,28,0.18);
  }
  .modal-actions{
    display:flex;
    justify-content:flex-end;
    gap: 10px;
    margin-top: 14px;
  }

  /* Recipe */
  .card-soft{
    margin-top: 14px;
    border-radius: 16px;
    border: 1px solid var(--border);
    background:
      radial-gradient(700px 220px at 10% 0%, var(--pink-soft), transparent 60%),
      radial-gradient(700px 220px at 95% 0%, var(--mint-soft), transparent 60%),
      rgba(255,255,255,0.75);
    padding: 12px;
  }
  .recipe-head{
    display:flex;
    align-items:flex-start;
    justify-content:space-between;
    gap: 12px;
    margin-bottom: 10px;
  }
  .h4{ font-weight: 900; margin: 0; }
  .qty-row{
    display:flex;
    align-items:center;
    gap: 10px;
  }
  .pill{
    padding: 8px 10px;
    border-radius: 999px;
    border: 1px solid var(--border);
    background: rgba(255,255,255,0.75);
    color: var(--muted);
    font-size: 13px;
    white-space: nowrap;
  }
  .table-wrap.soft{
    background: rgba(255,255,255,0.55);
  }
  .table-soft thead th{
    background: rgba(255,255,255,0.7);
  }

  /* Toast */
  .toast-wrap{
    position: fixed;
    top: 14px;
    right: 14px;
    z-index: 1200;
    display:flex;
    flex-direction:column;
    gap: 10px;
  }
  .toast{
    width: min(360px, calc(100vw - 28px));
    border-radius: 16px;
    border: 1px solid var(--border);
    background: rgba(255,255,255,0.92);
    box-shadow: 0 16px 44px rgba(2,6,23,0.18);
    padding: 12px 12px;
    animation: toastIn .16s ease-out;
  }
  @keyframes toastIn{
    from{ transform: translateY(-6px); opacity: 0; }
    to{ transform: translateY(0); opacity: 1; }
  }
  .toast-top{
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap: 10px;
    margin-bottom: 4px;
  }
  .toast-title{
    font-weight: 900;
    letter-spacing: -0.01em;
    font-size: 14px;
  }
  .toast-msg{
    color: var(--muted);
    font-size: 13px;
    line-height: 1.45;
  }
  .toast-x{
    width: 30px; height: 30px;
    border-radius: 12px;
    border: 1px solid var(--border);
    background: rgba(255,255,255,0.9);
    cursor:pointer;
    font-size: 18px;
    display:grid;
    place-items:center;
  }

  .toast-info{ border-color: rgba(59,130,246,0.18); }
  .toast-success{ border-color: rgba(50,196,141,0.22); box-shadow: 0 16px 44px rgba(50,196,141,0.12); }
  .toast-warn{ border-color: rgba(245,158,11,0.22); box-shadow: 0 16px 44px rgba(245,158,11,0.10); }
  .toast-error{ border-color: rgba(239,68,68,0.22); box-shadow: 0 16px 44px rgba(239,68,68,0.10); }
`;
