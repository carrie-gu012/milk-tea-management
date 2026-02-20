import React, { useEffect, useState } from "react";

export default function Products() {
  const role = localStorage.getItem("role");

  const [products, setProducts] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    loadProducts();
    loadIngredients();
  }, []);

  function loadProducts() {
    fetch("http://localhost:8080/products")
      .then((res) => res.json())
      .then(setProducts);
  }

  function loadIngredients() {
    fetch("http://localhost:8080/ingredients")
      .then((res) => res.json())
      .then(setIngredients);
  }

  // =============================
  // DELETE (Inactivate before delete logic)
  // =============================
  function handleDelete(product) {
    // Validation: Product must be inactive before deletion
    if (product.isActive) {
      alert("⚠️ Cannot delete: Please click 'Edit' and set the product to inactive (toggle 'Active' off) first.");
      return;
    }

    if (!window.confirm(`Are you sure you want to permanently delete "${product.name}"? This action cannot be undone.`)) return;
    
    fetch(`http://localhost:8080/products/${product.productId}`, {
      method: "DELETE",
    }).then(loadProducts);
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
          recipe: data.recipe.map((r) => ({
            ingredientId: r.ingredientId,
            qtyRequired: r.qtyRequired,
          })),
        });
      });
  }

  function handleSave() {
    const method = editingProduct.productId ? "PUT" : "POST";
    const url = editingProduct.productId
      ? `http://localhost:8080/products/${editingProduct.productId}`
      : "http://localhost:8080/products";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editingProduct.name,
        priceCents: Number(editingProduct.priceCents),
        isActive: editingProduct.isActive,
        recipe: editingProduct.recipe,
      }),
    }).then(() => {
      setEditingProduct(null);
      loadProducts();
    });
  }

  function addIngredientRow() {
    setEditingProduct({
      ...editingProduct,
      recipe: [...editingProduct.recipe, { ingredientId: "", qtyRequired: "" }],
    });
  }

  function updateRecipe(index, field, value) {
    const updated = [...editingProduct.recipe];
    updated[index][field] = value;
    setEditingProduct({
      ...editingProduct,
      recipe: updated,
    });
  }

  function removeRecipe(index) {
    const updated = editingProduct.recipe.filter((_, i) => i !== index);
    setEditingProduct({
      ...editingProduct,
      recipe: updated,
    });
  }

  return (
    <div className="card" style={{ padding: 20 }}>
      <style>{toggleStyles}</style>

      <h2>Products</h2>

      {/* Only ADMIN can create products */}
      {role === "ADMIN" && (
        <button style={btnPrimary} onClick={openCreate}>
          + Add Product
        </button>
      )}

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={th}>#</th>
            <th style={th}>Name</th>
            <th style={th}>Price ($)</th>
            <th style={th}>Active</th>
            {/* Actions column only visible to ADMIN */}
            {role === "ADMIN" && <th style={th}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {products.map((p, index) => (
            <tr key={p.productId} style={rowLine}>
              <td style={td}>{index + 1}</td>
              <td style={td}>{p.name}</td>
              <td style={td}>{(p.priceCents / 100).toFixed(2)}</td>
              <td style={td}>{p.isActive ? "Yes" : "No"}</td>
              
              {role === "ADMIN" && (
                <td style={td}>
                  <button style={btnEdit} onClick={() => openEdit(p)}>
                    Edit
                  </button>
                  <button style={btnDelete} onClick={() => handleDelete(p)}>
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* =============================
          EDIT PANEL (ADMIN ONLY)
      ============================= */}
      {editingProduct && role === "ADMIN" && (
        <div style={editorCard}>
          <h3 style={{ marginBottom: 20 }}>
            {editingProduct.productId ? "Edit Product" : "Add Product"}
          </h3>

          <label style={labelStyle}>Name</label>
          <input
            style={input}
            placeholder="Enter product name"
            value={editingProduct.name}
            onChange={(e) =>
              setEditingProduct({ ...editingProduct, name: e.target.value })
            }
          />

          <label style={labelStyle}>Price (Cents)</label>
          <input
            style={input}
            type="number"
            placeholder="e.g., 650 for $6.50"
            value={editingProduct.priceCents}
            onChange={(e) =>
              setEditingProduct({ ...editingProduct, priceCents: e.target.value })
            }
          />

          <div style={{ marginTop: 15, display: "flex", alignItems: "center", gap: "12px" }}>
            <label style={{ fontSize: "14px", fontWeight: "500", color: "#374151" }}>Active</label>
            <label className="switch">
              <input
                type="checkbox"
                checked={editingProduct.isActive}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, isActive: e.target.checked })
                }
              />
              <span className="slider round"></span>
            </label>
          </div>

          <h4 style={{ marginTop: 30, marginBottom: 10 }}>Recipe</h4>
          <table style={tableStyle}>
            <thead>
              <tr style={{ background: "#f9fafb" }}>
                <th style={th}>Ingredient</th>
                <th style={th}>Qty Required</th>
                <th style={th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {editingProduct.recipe.map((r, index) => {
                const ing = ingredients.find((i) => i.ingredientId === r.ingredientId);
                return (
                  <tr key={index} style={rowLine}>
                    <td style={td}>
                      <select
                        style={selectStyle}
                        value={r.ingredientId}
                        onChange={(e) =>
                          updateRecipe(index, "ingredientId", Number(e.target.value))
                        }
                      >
                        <option value="">Select Ingredient...</option>
                        {ingredients.map((i) => (
                          <option key={i.ingredientId} value={i.ingredientId}>
                            {i.ingredientName} ({i.type})
                          </option>
                        ))}
                      </select>
                    </td>
                    <td style={td}>
                      <input
                        value={r.qtyRequired}
                        style={qtyInputStyle}
                        onChange={(e) => updateRecipe(index, "qtyRequired", e.target.value)}
                      />
                      <span style={{ marginLeft: 5, color: "#666" }}>{ing?.unit}</span>
                    </td>
                    <td style={td}>
                      <button style={btnTrashLight} onClick={() => removeRecipe(index)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <button style={btnAddIngredient} onClick={addIngredientRow}>
            + Add Ingredient
          </button>

          <div style={footerActions}>
            <button style={btnCancel} onClick={() => setEditingProduct(null)}>
              Cancel
            </button>
            <button style={btnSave} onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Styles remain unchanged
const toggleStyles = `
  .switch { position: relative; display: inline-block; width: 40px; height: 20px; }
  .switch input { opacity: 0; width: 0; height: 0; }
  .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .3s; border-radius: 20px; }
  .slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 2px; bottom: 2px; background-color: white; transition: .3s; border-radius: 50%; }
  input:checked + .slider { background-color: #10b981; }
  input:checked + .slider:before { transform: translateX(20px); }
`;

const tableStyle = { width: "100%", borderCollapse: "collapse", marginTop: 10 };
const th = { textAlign: "left", padding: "12px 8px", borderBottom: "1px solid #e5e7eb", color: "#4b5563", fontSize: "14px" };
const td = { padding: "12px 8px" };
const rowLine = { borderBottom: "1px solid #f3f4f6" };

const labelStyle = { display: "block", fontSize: "14px", fontWeight: "500", color: "#374151", marginBottom: "4px" };
const input = { width: "100%", padding: "10px", border: "1px solid #d1d5db", borderRadius: "6px", marginBottom: "16px", boxSizing: "border-box" };
const selectStyle = { padding: "8px", borderRadius: "6px", border: "1px solid #d1d5db", width: "100%" };
const qtyInputStyle = { width: "70px", padding: "8px", borderRadius: "6px", border: "1px solid #d1d5db" };

const btnPrimary = { background: "#2563eb", color: "white", padding: "8px 16px", border: "none", borderRadius: 6, cursor: "pointer" };
const btnEdit = { background: "#f59e0b", color: "white", padding: "6px 12px", border: "none", borderRadius: 6, marginRight: 6, cursor: "pointer" };
const btnDelete = { background: "#ef4444", color: "white", padding: "6px 12px", border: "none", borderRadius: 6, cursor: "pointer" };
const btnTrashLight = { background: "#fee2e2", color: "#ef4444", border: "none", padding: "6px 10px", borderRadius: 6, cursor: "pointer" };
const btnAddIngredient = { background: "none", color: "#2563eb", border: "1px solid #2563eb", padding: "8px 12px", borderRadius: 6, marginTop: 12, cursor: "pointer", fontWeight: "500" };

const footerActions = { marginTop: 30, display: "flex", justifyContent: "flex-end", gap: "12px", borderTop: "1px solid #f3f4f6", paddingTop: "20px" };

const btnSave = { 
  background: "#2563eb", 
  color: "white", 
  padding: "10px 24px", 
  border: "none", 
  borderRadius: "6px", 
  cursor: "pointer", 
  fontWeight: "500",
  fontSize: "14px" 
};

const btnCancel = { 
  background: "white", 
  color: "#374151", 
  padding: "10px 24px", 
  border: "1px solid #d1d5db", 
  borderRadius: "6px", 
  cursor: "pointer" 
};

const editorCard = { marginTop: 30, padding: "24px", border: "1px solid #e5e7eb", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" };