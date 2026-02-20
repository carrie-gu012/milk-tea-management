import React, { useEffect, useState } from "react";

export default function Products() {
  const [products, setProducts] = useState([]);

  // 读取角色（ADMIN / STAFF）
  const role = localStorage.getItem("role");

  // 页面加载时获取数据
  useEffect(() => {
    loadProducts();
  }, []);

  // 加载产品列表
  function loadProducts() {
    fetch("http://localhost:8080/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error loading products:", err));
  }

  // 删除产品
  function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    fetch(`http://localhost:8080/products/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        // 删除成功后重新加载数据（最安全）
        loadProducts();
      })
      .catch((err) => console.error("Delete failed:", err));
  }

  return (
    <div className="card" style={{ padding: 18 }}>
      <h2 style={{ margin: 0 }}>Products</h2>

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

            {/* ADMIN 才显示 */}
            {role === "ADMIN" && (
              <th style={thStyle}>Actions</th>
            )}
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td style={tdStyle}>{p.name}</td>

              <td style={tdStyle}>
                {(p.priceCents / 100).toFixed(2)}
              </td>

              <td style={tdStyle}>
                {p.isActive ? "Yes" : "No"}
              </td>

              {/* ADMIN 才能删除 */}
              {role === "ADMIN" && (
                <td style={tdStyle}>
                  <button
                    onClick={() => handleDelete(p.id)}
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