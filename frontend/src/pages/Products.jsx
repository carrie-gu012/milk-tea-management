import React, { useEffect, useState } from "react";

export default function Products() {
  const [products, setProducts] = useState([]);

  const role = localStorage.getItem("role");

  const [showForm, setShowForm] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: "",
    priceCents: "",
    isActive: true,
  });

  useEffect(() => {
    loadProducts();
  }, []);

  function loadProducts() {
    fetch("http://localhost:8080/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error loading products:", err));
  }

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

        // ⭐ 正确字段
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

  return (
    <div className="card" style={{ padding: 18 }}>
      <h2 style={{ margin: 0 }}>Products</h2>

      {role === "ADMIN" && (
        <button
          onClick={() => setShowForm(true)}
          style={{
            marginTop: 12,
            background: "#3498db",
            color: "white",
            border: "none",
            padding: "8px 12px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Add Product
        </button>
      )}

      {showForm && (
        <div style={{ marginTop: 20 }}>
          <h3>Add Product</h3>

          <input
            placeholder="Product Name"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                name: e.target.value,
              })
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

          <button onClick={() => setShowForm(false)} style={{ marginLeft: 5 }}>
            Cancel
          </button>
        </div>
      )}

      <table
        style={{
          marginTop: 16,
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
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
                    onClick={() => handleDelete(p.productId)}
                    style={{
                      background: "#e74c3c",
                      color: "white",
                      border: "none",
                      padding: "6px 10px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
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

const thStyle = {
  borderBottom: "1px solid #ddd",
  textAlign: "left",
  padding: "8px",
};

const tdStyle = {
  borderBottom: "1px solid #eee",
  padding: "8px",
};