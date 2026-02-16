// src/pages/OrdersList.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { listOrders, createOrder } from "../api/orders.jsx";

function StatusBadge({ status }) {
  const s = String(status || "").toUpperCase();
  const style =
    s === "COMPLETED"
      ? {
          background: "rgba(50,196,141,0.14)",
          borderColor: "rgba(50,196,141,0.28)",
          color: "#065f46",
        }
      : s === "CREATED"
        ? {
            background: "rgba(255,91,138,0.12)",
            borderColor: "rgba(255,91,138,0.26)",
            color: "#9f1239",
          }
        : s === "CANCELED"
          ? {
              background: "rgba(156,163,175,0.18)",
              borderColor: "rgba(107,114,128,0.30)",
              color: "#374151",
            }
          : {
              background: "rgba(100,116,139,0.10)",
              borderColor: "rgba(100,116,139,0.22)",
              color: "var(--muted)",
            };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "6px 10px",
        borderRadius: 999,
        border: `1px solid ${style.borderColor}`,
        background: style.background,
        color: style.color,
        fontSize: 12,
        fontWeight: 700,
      }}
    >
      {s || "—"}
    </span>
  );
}

function toDateInputValue(d) {
  // YYYY-MM-DD (local)
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function addDays(d, days) {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}

export default function OrdersList() {
  // status filter
  const [status, setStatus] = useState(""); // "" / "CREATED" / "COMPLETED" / "CANCELED"

  // pagination
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(0); // 0-based
  const [hasNext, setHasNext] = useState(false);

  // time filter
  // preset: "ALL" | "TODAY" | "YESTERDAY" | "LAST7" | "LAST30" | "CUSTOM"
  const [timePreset, setTimePreset] = useState("TODAY");
  const today = useMemo(() => new Date(), []);
  const [fromDate, setFromDate] = useState(toDateInputValue(today));
  const [toDate, setToDate] = useState(toDateInputValue(today));

  // data
  const [orders, setOrders] = useState([]);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);

  const nav = useNavigate();
  const [creating, setCreating] = useState(false);

  // Build {from,to} based on preset
  const dateRange = useMemo(() => {
    const now = new Date();

    if (timePreset === "ALL") return { from: null, to: null };

    if (timePreset === "TODAY") {
      const d = toDateInputValue(now);
      return { from: d, to: d };
    }

    if (timePreset === "YESTERDAY") {
      const d = toDateInputValue(addDays(now, -1));
      return { from: d, to: d };
    }

    if (timePreset === "LAST7") {
      const to = toDateInputValue(now);
      const from = toDateInputValue(addDays(now, -6));
      return { from, to };
    }

    if (timePreset === "LAST30") {
      const to = toDateInputValue(now);
      const from = toDateInputValue(addDays(now, -29));
      return { from, to };
    }

    // CUSTOM
    return { from: fromDate || null, to: toDate || null };
  }, [timePreset, fromDate, toDate]);

  async function load({ resetPage = false } = {}) {
    try {
      setErr(null);
      setLoading(true);

      const nextPage = resetPage ? 0 : page;
      const offset = nextPage * pageSize;

      // NOTE: listOrders 目前只收 status/limit/offset
      // 我这里把 from/to 一起传进去（你后端支持后就能直接用）
      const data = await listOrders({
        status: status || null,
        limit: pageSize,
        offset,
        from: dateRange.from,
        to: dateRange.to,
      });

      setOrders(data);
      setHasNext((data?.length ?? 0) === pageSize);
      if (resetPage) setPage(0);
    } catch (e) {
      setErr(e?.message ?? "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }

  // Whenever filters change, reset to page 0
  useEffect(() => {
    load({ resetPage: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, pageSize, timePreset, fromDate, toDate]);

  // When page changes, just load
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const statusLabel = useMemo(() => {
    if (!status) return "All";
    return status;
  }, [status]);

  const timeLabel = useMemo(() => {
    if (timePreset === "ALL") return "All time";
    if (timePreset === "TODAY") return "Today";
    if (timePreset === "YESTERDAY") return "Yesterday";
    if (timePreset === "LAST7") return "Last 7 days";
    if (timePreset === "LAST30") return "Last 30 days";
    return `Custom (${dateRange.from || "—"} → ${dateRange.to || "—"})`;
  }, [timePreset, dateRange.from, dateRange.to]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Header */}
      <div className="card" style={{ padding: 18 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div style={{ fontSize: 22, fontWeight: 900 }}>Orders</div>
            <div style={{ color: "var(--muted)", marginTop: 6 }}>
              Showing <b>{statusLabel}</b> · <b>{timeLabel}</b> ·{" "}
              {loading ? "Loading..." : `${orders.length} orders on this page`}
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button
              className="btn btn-primary"
              disabled={creating}
              onClick={async () => {
                try {
                  setCreating(true);
                  const username =
                    localStorage.getItem("username") || "UNKNOWN";
                  const res = await createOrder(username);
                  nav(`/orders/${res.orderId}`);
                } catch (e) {
                  setErr(e?.message ?? "Failed to create order");
                } finally {
                  setCreating(false);
                }
              }}
            >
              {creating ? "Creating..." : "+ Create Order"}
            </button>

            <button className="btn" onClick={() => load()} disabled={loading}>
              Refresh
            </button>
          </div>
        </div>

        {/* Filters */}
        <div
          style={{
            marginTop: 14,
            display: "flex",
            gap: 10,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <span className="pill">Filter</span>

          {/* Status */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "var(--muted)", fontSize: 13 }}>Status</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="input"
              style={{ padding: "10px 12px", width: 180 }}
            >
              <option value="">ALL</option>
              <option value="CREATED">CREATED</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELED">CANCELED</option>
            </select>
          </div>

          {/* Time */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "var(--muted)", fontSize: 13 }}>Time</span>
            <select
              value={timePreset}
              onChange={(e) => setTimePreset(e.target.value)}
              className="input"
              style={{ padding: "10px 12px", width: 180 }}
            >
              <option value="TODAY">Today</option>
              <option value="YESTERDAY">Yesterday</option>
              <option value="LAST7">Last 7 days</option>
              <option value="LAST30">Last 30 days</option>
              <option value="ALL">All time</option>
              <option value="CUSTOM">Custom</option>
            </select>
          </div>

          {/* Custom date inputs */}
          {timePreset === "CUSTOM" && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "var(--muted)", fontSize: 13 }}>
                  From
                </span>
                <input
                  type="date"
                  className="input"
                  style={{ padding: "10px 12px", width: 170 }}
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "var(--muted)", fontSize: 13 }}>To</span>
                <input
                  type="date"
                  className="input"
                  style={{ padding: "10px 12px", width: 170 }}
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
            </>
          )}

          {/* Page size */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "var(--muted)", fontSize: 13 }}>Page</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="input"
              style={{ padding: "10px 12px", width: 120 }}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {/* Pagination controls */}
        <div
          style={{
            marginTop: 12,
            display: "flex",
            gap: 10,
            alignItems: "center",
            justifyContent: "flex-end",
            flexWrap: "wrap",
          }}
        >
          <span className="pill">Page: {page + 1}</span>
          <button
            className="btn"
            disabled={loading || page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
          >
            Prev
          </button>
          <button
            className="btn"
            disabled={loading || !hasNext}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {/* Error */}
      {err && (
        <div
          className="card"
          style={{
            padding: 14,
            border: "1px solid rgba(185,28,28,0.18)",
            background: "rgba(185,28,28,0.06)",
            color: "#b91c1c",
          }}
        >
          {err}
        </div>
      )}

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: 14, borderBottom: "1px solid var(--border)" }}>
          <div style={{ fontWeight: 900 }}>Order List</div>
          <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 6 }}>
            Click “Open” to view details and add items.
          </div>
        </div>

        {loading ? (
          <div style={{ padding: 18, color: "var(--muted)" }}>
            Loading orders...
          </div>
        ) : orders.length === 0 ? (
          <div style={{ padding: 18, color: "var(--muted)" }}>
            No orders found for this filter.
          </div>
        ) : (
          <div style={{ width: "100%", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.7)" }}>
                  <th style={thStyle}>Order ID</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Created At</th>
                  <th style={thStyle}>Created By</th>
                  <th style={thStyle} />
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.orderId} style={rowStyle}>
                    <td style={tdStyle}>
                      <span style={{ fontWeight: 800 }}>#{o.orderId}</span>
                    </td>
                    <td style={tdStyle}>
                      <StatusBadge status={o.status} />
                    </td>
                    <td style={tdStyle}>
                      <span style={{ color: "var(--muted)" }}>
                        {o.createdAt ?? "—"}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <span style={{ color: "var(--muted)" }}>
                        {o.createdBy ?? "—"}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>
                      <Link
                        to={`/orders/${o.orderId}`}
                        className="btn"
                        style={{ padding: "8px 10px", borderRadius: 12 }}
                      >
                        Open
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer pagination mirror */}
        <div
          style={{
            padding: 14,
            borderTop: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <span style={{ color: "var(--muted)", fontSize: 13 }}>
            Page {page + 1} · showing up to {pageSize} orders
          </span>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button
              className="btn"
              disabled={loading || page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              Prev
            </button>
            <button
              className="btn"
              disabled={loading || !hasNext}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const thStyle = {
  textAlign: "left",
  padding: "12px 14px",
  fontSize: 12,
  color: "var(--muted)",
  borderBottom: "1px solid var(--border)",
  whiteSpace: "nowrap",
};

const tdStyle = {
  padding: "12px 14px",
  borderBottom: "1px solid var(--border)",
  whiteSpace: "nowrap",
};

const rowStyle = {
  background: "transparent",
};
