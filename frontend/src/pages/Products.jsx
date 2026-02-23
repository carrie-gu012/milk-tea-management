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

  function handleDelete(product) {
    if (product.isActive) {
      alert("⚠️ Cannot delete: Please click 'Edit' and set the product to inactive first.");
      return;
    }

    if (!window.confirm(`Are you sure you want to permanently delete "${product.name}"?`)) return;
    
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
    setEditingProduct({ ...editingProduct, recipe: updated });
  }

  function removeRecipe(index) {
    const updated = editingProduct.recipe.filter((_, i) => i !== index);
    setEditingProduct({ ...editingProduct, recipe: updated });
  }

  return (
    <div className="card">
      <style>{customStyles}</style>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ margin: 0 }}>Product Management</h2>
        {role === "ADMIN" && (
          <button className="btn-primary" onClick={openCreate}>
            + Add New Product
          </button>
        )}
      </div>

      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Product Name</th>
              <th>Price</th>
              <th>Status</th>
              {role === "ADMIN" && <th style={{ textAlign: "right" }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {products.map((p, index) => (
              <tr key={p.productId}>
                <td>{index + 1}</td>
                <td style={{ fontWeight: "600" }}>{p.name}</td>
                <td>${(p.priceCents / 100).toFixed(2)}</td>
                <td>
                  <span className={`badge ${p.isActive ? "bg-success" : "bg-gray"}`}>
                    {p.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                {role === "ADMIN" && (
                  <td style={{ textAlign: "right" }}>
                    <button className="btn-edit" onClick={() => openEdit(p)}>Edit</button>
                    <button className="btn-delete" onClick={() => handleDelete(p)}>Delete</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingProduct && role === "ADMIN" && (
        <div className="editor-overlay">
          <div className="editor-modal card">
            <h3>{editingProduct.productId ? "📝 Edit Product" : "✨ New Product"}</h3>
            <hr />
            
            <div className="form-group">
              <label>Product Name</label>
              <input
                className="custom-input"
                placeholder="e.g. Cappuccino"
                value={editingProduct.name}
                onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Price (in cents)</label>
              <input
                className="custom-input"
                type="number"
                placeholder="e.g. 500 for $5.00"
                value={editingProduct.priceCents}
                onChange={(e) => setEditingProduct({ ...editingProduct, priceCents: e.target.value })}
              />
            </div>

            <div className="form-group-inline">
              <label>Availability Status</label>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={editingProduct.isActive}
                  onChange={(e) => setEditingProduct({ ...editingProduct, isActive: e.target.checked })}
                />
                <span className="slider round"></span>
              </label>
              <span style={{ fontSize: "14px", color: "#666" }}>
                {editingProduct.isActive ? "Active (Visible to users)" : "Inactive (Hidden)"}
              </span>
            </div>

            <div className="recipe-section">
              <h4>Recipe Ingredients</h4>
              <table className="recipe-table">
                <thead>
                  <tr>
                    <th>Ingredient</th>
                    <th>Qty Required</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {editingProduct.recipe.map((r, index) => {
                    const ing = ingredients.find((i) => i.ingredientId === r.ingredientId);
                    return (
                      <tr key={index}>
                        <td>
                          <select
                            className="custom-select"
                            value={r.ingredientId}
                            onChange={(e) => updateRecipe(index, "ingredientId", Number(e.target.value))}
                          >
                            <option value="">Select...</option>
                            {ingredients.map((i) => (
                              <option key={i.ingredientId} value={i.ingredientId}>
                                {i.ingredientName}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                            <input
                              className="custom-input-sm"
                              value={r.qtyRequired}
                              onChange={(e) => updateRecipe(index, "qtyRequired", e.target.value)}
                            />
                            <small>{ing?.unit}</small>
                          </div>
                        </td>
                        <td>
                          <button className="btn-icon-delete" onClick={() => removeRecipe(index)}>×</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <button className="btn-outline" onClick={addIngredientRow}>+ Add Ingredient</button>
            </div>

            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setEditingProduct(null)}>Cancel</button>
              <button className="btn-primary" onClick={handleSave}>Save Product</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 这里的样式补充了 main.css 缺少的布局部分，使其更加精致
const customStyles = `
  .table-container { overflow-x: auto; margin-top: 10px; }
  .custom-table { width: 100%; border-collapse: collapse; }
  .custom-table th { background: #f8fafc; padding: 12px; text-align: left; border-bottom: 2px solid #edf2f7; color: #64748b; font-size: 13px; text-transform: uppercase; }
  .custom-table td { padding: 16px 12px; border-bottom: 1px solid #edf2f7; }
  
  .badge { padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
  .bg-success { background: #dcfce7; color: #166534; }
  .bg-gray { background: #f1f5f9; color: #475569; }

  .btn-edit { background: #fef3c7; color: #92400e; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; margin-right: 8px; font-weight: 500; }
  .btn-delete { background: #fee2e2; color: #991b1b; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-weight: 500; }
  
  .editor-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.4); display: flex; justify-content: center; align-items: center; z-index: 1000; }
  .editor-modal { width: 90%; max-width: 600px; max-height: 90vh; overflow-y: auto; background: white; padding: 25px !important; }
  
  .form-group { margin-bottom: 15px; }
  .form-group label { display: block; margin-bottom: 5px; font-weight: 500; font-size: 14px; }
  .form-group-inline { display: flex; align-items: center; gap: 15px; margin: 20px 0; }
  
  .custom-input, .custom-select { width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; box-sizing: border-box; }
  .custom-input-sm { width: 60px; padding: 8px; border: 1px solid #cbd5e1; border-radius: 4px; }
  
  .recipe-section { background: #f8fafc; padding: 15px; border-radius: 8px; margin-top: 20px; }
  .recipe-table { width: 100%; margin-bottom: 10px; }
  .btn-icon-delete { background: none; border: none; color: #ef4444; font-size: 20px; cursor: pointer; }
  .btn-outline { background: white; border: 1px dashed #cbd5e1; color: #64748b; width: 100%; padding: 8px; border-radius: 6px; cursor: pointer; }
  
  .modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 30px; }

  .switch { position: relative; display: inline-block; width: 34px; height: 20px; }
  .switch input { opacity: 0; width: 0; height: 0; }
  .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 34px; }
  .slider:before { position: absolute; content: ""; height: 14px; width: 14px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
  input:checked + .slider { background-color: #2563eb; }
  input:checked + .slider:before { transform: translateX(14px); }
`;