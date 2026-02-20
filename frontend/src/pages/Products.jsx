import React, { useEffect, useState } from "react";

export default function Products() {
  const [products, setProducts] = useState([]);

  const role = localStorage.getItem("role");

  // ===== Create =====
  const [showForm, setShowForm] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: "",
    priceCents: "",
    isActive: true,
  });

  // ===== Edit =====
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  function loadProducts() {
    fetch("http://localhost:8080/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error loading products:", err));
  }

  // ===== Delete =====
  function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    fetch(`http://localhost:8080/products/${id}`, {
      method: "DELETE",
    })
      .then(() => loadProducts())
      .catch((err) => console.error("Delete failed:", err));
  }

  // ===== Create =====
  function handleCreate() {
    fetch("http://localhost:8080/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: newProduct.name,
        priceCents: Number(newProduct.priceCents),
        isActive: newProduct.isActive,
        recipe: [
          {
            ingredientId: 1,
            qtyRequired: 1.0,
          },
        ],
      }),
    })
      .then(() => {
        setShowForm(false);

        setNewProduct({
          name: "",
          priceCents: "",
          isActive: true,
        });

        loadProducts();
      })
      .catch((err) => console.error("Create failed:", err));
  }

  // ===== Open Edit =====
  function openEdit(product) {
    setEditingProduct({
      productId: product.productId,
      name: product.name,
      priceCents: product.priceCents,
      isActive: product.isActive,
    });
  }

  // ===== Update =====
  function handleUpdate() {
    fetch(`http://localhost:8080/products/${editingProduct.productId}`, {
      method: "PUT", // 需要后端支持
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: editingProduct.name,
        priceCents: Number(editingProduct.priceCents),
        isActive: editingProduct.isActive,
        recipe: [
          {
            ingredientId: 1,
            qtyRequired: 1.0,
          },
        ],
      }),
    })
      .then(() => {
        setEditingProduct(null);
        loadProducts();
      })
      .catch((err) => console.error("Update failed:", err));
  }

  return (
    <div className="card" style={{ padding: 18 }}>
      <h2 style={{ margin: 0 }}>Products</h2>

      {/* ===== Add Button ===== */}
      {role === "ADMIN" && (
        <button
          onClick={() => setShowForm(true)}
          style={btnBlue}
        >
          Add Product
        </button>
      )}

      {/* ===== Create Form ===== */}
      {showForm && (
        <div style={{ marginTop: 20 }}>
          <h3>Add Product</h3>

          <input
            placeholder="Product Name"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
          />

          <input
            placeholder="Price (cents)"
            value={newProduct.priceCents}
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                priceCents: e.target.value,
              })
            }
            style={{ marginLeft: 10 }}
          />

          <label style={{ marginLeft: 10 }}>
            Active
            <input
              type="checkbox"
              checked={newProduct.isActive}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  isActive: e.target.checked,
                })
              }
            />
          </label>

          <button onClick={handleCreate} style={{ marginLeft: 10 }}>
            Save
          </button>

          <button
            onClick={() => setShowForm(false)}
            style={{ marginLeft: 5 }}
          >
            Cancel
          </button>
        </div>
      )}

      {/* ===== Edit Form ===== */}
      {editingProduct && (
        <div style={{ marginTop: 20 }}>
          <h3>Edit Product</h3>

          <input
            value={editingProduct.name}
            onChange={(e) =>
              setEditingProduct({
                ...editingProduct,
                name: e.target.value,
              })
            }
          />

          <input
            value={editingProduct.priceCents}
            onChange={(e) =>
              setEditingProduct({
                ...editingProduct,
                priceCents: e.target.value,
              })
            }
            style={{ marginLeft: 10 }}
          />

          <label style={{ marginLeft: 10 }}>
            Active
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
          </label>

          <button onClick={handleUpdate} style={{ marginLeft: 10 }}>
            Save
          </button>

          <button
            onClick={() => setEditingProduct(null)}
            style={{ marginLeft: 5 }}
          >
            Cancel
          </button>
        </div>
      )}

      {/* ===== Product Table ===== */}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Price ($)</th>
            <th style={thStyle}>Active</th>

            {role === "ADMIN" && (
              <th style={thStyle}>Actions</th>
            )}
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p.productId}>
              <td style={tdStyle}>{p.name}</td>

              <td style={tdStyle}>
                {(p.priceCents / 100).toFixed(2)}
              </td>

              <td style={tdStyle}>
                {p.isActive ? "Yes" : "No"}
              </td>

              {role === "ADMIN" && (
                <td style={tdStyle}>
                  <button
                    onClick={() => openEdit(p)}
                    style={btnEdit}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(p.productId)}
                    style={btnDelete}
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ===== Styles ===== */

const tableStyle = {
  marginTop: 16,
  width: "100%",
  borderCollapse: "collapse",
};

const thStyle = {
  borderBottom: "1px solid #ddd",
  textAlign: "left",
  padding: "8px",
};

const tdStyle = {
  borderBottom: "1px solid #eee",
  padding: "8px",
};

const btnBlue = {
  marginTop: 12,
  background: "#3498db",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "4px",
  cursor: "pointer",
};

const btnDelete = {
  background: "#e74c3c",
  color: "white",
  border: "none",
  padding: "6px 10px",
  borderRadius: "4px",
  cursor: "pointer",
  marginLeft: 6,
};

const btnEdit = {
  background: "#f39c12",
  color: "white",
  border: "none",
  padding: "6px 10px",
  borderRadius: "4px",
  cursor: "pointer",
};