import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { getDashboardSummary } from "../api/dashboard.jsx";

function formatMoney(cents) {
  return `$${((cents || 0) / 100).toFixed(2)}`;
}

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

  const [summary, setSummary] = useState({
    todayOrders: 0,
    revenueCents: 0,
    lowStockItems: 0,
    pendingOrders: 0,
    recentOrders: [],
    alerts: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getDashboardSummary();
        setSummary({
          todayOrders: data.todayOrders ?? 0,
          revenueCents: data.revenueCents ?? 0,
          lowStockItems: data.lowStockItems ?? 0,
          pendingOrders: data.pendingOrders ?? 0,
          recentOrders: data.recentOrders ?? [],
          alerts: data.alerts ?? [],
        });
        setError("");
      } catch (e) {
        console.error(e);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const stats = [
    {
      title: "Today Orders",
      value: summary.todayOrders,
      sub: "Orders created today",
    },
    {
      title: "Revenue",
      value: formatMoney(summary.revenueCents),
      sub: "Completed orders today",
    },
    {
      title: "Low Stock Items",
      value: summary.lowStockItems,
      sub: "Items below threshold",
    },
    {
      title: "Pending Orders",
      value: summary.pendingOrders,
      sub: "Orders not completed yet",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
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

          <button className="btn btn-primary" onClick={() => nav("/orders/")}>
            + New Order
          </button>
        </div>
      </div>

      {error && (
        <div
          className="card"
          style={{ padding: 16, color: "#b91c1c", borderColor: "#b91c1c" }}
        >
          {error}
        </div>
      )}

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

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: 12,
        }}
      >
        {stats.map((s) => (
          <StatCard
            key={s.title}
            title={s.title}
            value={loading ? "..." : s.value}
            sub={s.sub}
          />
        ))}
      </div>

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
            Latest orders from database
          </div>

          <div
            style={{
              marginTop: 12,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {loading ? (
              <div>Loading...</div>
            ) : summary.recentOrders.length === 0 ? (
              <div
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: 14,
                  padding: "10px 12px",
                  background: "rgba(255,255,255,0.7)",
                }}
              >
                No recent orders.
              </div>
            ) : (
              summary.recentOrders.map((o) => (
                <div
                  key={o.orderId}
                  style={{
                    border: "1px solid var(--border)",
                    borderRadius: 14,
                    padding: "10px 12px",
                    background: "rgba(255,255,255,0.7)",
                  }}
                >
                  #{o.orderId} · {o.status} · by {o.createdBy}
                </div>
              ))
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
            {loading ? (
              <div>Loading...</div>
            ) : summary.alerts.length === 0 ? (
              <div
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: 14,
                  padding: "10px 12px",
                }}
              >
                No alerts yet.
              </div>
            ) : (
              summary.alerts.map((a, idx) => (
                <div
                  key={idx}
                  style={{
                    border: "1px solid var(--border)",
                    borderRadius: 14,
                    padding: "10px 12px",
                  }}
                >
                  {a}
                </div>
              ))
            )}

            {role === "ADMIN" && (
              <button
                className="btn btn-primary"
                onClick={() => nav("/staff/register")}
                style={{ width: "fit-content" }}
              >
                Register Staff
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
