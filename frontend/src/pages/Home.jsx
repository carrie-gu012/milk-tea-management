// src/pages/Home.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

function StatCard({ title, value, sub }) {
  return (
    <div className="card" style={{ padding: 16 }}>
      <div style={{ color: "var(--muted)", fontSize: 13 }}>{title}</div>
      <div style={{ fontSize: 26, fontWeight: 800, marginTop: 6 }}>{value}</div>
      {sub && (
        <div style={{ color: "var(--muted)", fontSize: 12, marginTop: 6 }}>
          {sub}
        </div>
      )}
    </div>
  );
}

function ActionCard({ title, desc, onClick }) {
  return (
    <button
      className="card"
      onClick={onClick}
      style={{
        padding: 16,
        textAlign: "left",
        cursor: "pointer",
        border: "1px solid var(--border)",
      }}
    >
      <div style={{ fontWeight: 800 }}>{title}</div>
      <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 6 }}>
        {desc}
      </div>
      <div style={{ marginTop: 12 }}>
        <span
          className="btn btn-primary"
          style={{ padding: "8px 10px", borderRadius: 12 }}
        >
          Open
        </span>
      </div>
    </button>
  );
}

export default function Home() {
  const nav = useNavigate();
  const { username, role } = useAuth();

  // 先用假数据占位，后面接后端再替换
  const stats = [
    { title: "Today Orders", value: "—", sub: "Connect DB later" },
    { title: "Revenue", value: "—", sub: "Connect DB later" },
    { title: "Low Stock Items", value: "—", sub: "Connect DB later" },
    { title: "Pending Orders", value: "—", sub: "Connect DB later" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Header */}
      <div className="card" style={{ padding: 16 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div style={{ fontSize: 20, fontWeight: 900 }}>Dashboard</div>
            <div style={{ color: "var(--muted)", marginTop: 6 }}>
              Hi {username ? username : "there"} · Role: {role ?? "-"}
            </div>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => nav("/orders/")}
          >
            + New Order
          </button>
        </div>
      </div>

      {/* Quick actions */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 12,
        }}
      >
        <ActionCard
          title="Orders"
          desc="View and manage all orders."
          onClick={() => nav("/orders")}
        />
        <ActionCard
          title="Products"
          desc="Create / edit product menu items."
          onClick={() => nav("/products")}
        />
        <ActionCard
          title="Recipes"
          desc="View recipe summary by product."
          onClick={() => nav("/recipes")}
        />
        <ActionCard
          title="Inventory"
          desc="Track ingredient stock and alerts."
          onClick={() => nav("/inventory")}
        />
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: 12,
        }}
      >
        {stats.map((s) => (
          <StatCard key={s.title} title={s.title} value={s.value} sub={s.sub} />
        ))}
      </div>

      {/* Recent / Alerts */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 12,
        }}
      >
        <div className="card" style={{ padding: 16 }}>
          <div style={{ fontWeight: 900 }}>Recent Orders</div>
          <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 6 }}>
            Placeholder list (connect backend later)
          </div>

          <div
            style={{
              marginTop: 12,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {["#10021 · Pending", "#10020 · Completed", "#10019 · Pending"].map(
              (t) => (
                <div
                  key={t}
                  style={{
                    border: "1px solid var(--border)",
                    borderRadius: 14,
                    padding: "10px 12px",
                    background: "rgba(255,255,255,0.7)",
                  }}
                >
                  {t}
                </div>
              ),
            )}
          </div>
        </div>

        <div className="card" style={{ padding: 16 }}>
          <div style={{ fontWeight: 900 }}>Alerts</div>
          <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 6 }}>
            Low stock / pending actions
          </div>

          <div
            style={{
              marginTop: 12,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <div
              style={{
                border: "1px solid var(--border)",
                borderRadius: 14,
                padding: "10px 12px",
              }}
            >
              No alerts yet.
            </div>

            {/* 以后你可以让 admin 才显示 register staff */}
            {role === "ADMIN" && (
              <button
                className="btn"
                onClick={() => nav("/staff/register")}
                style={{ width: "fit-content" }}
              >
                Register Staff
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 小屏幕响应：你要的话我也可以给你加 media query */}
    </div>
  );
}
