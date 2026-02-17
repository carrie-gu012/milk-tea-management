import React, { useState } from "react";
import { api } from "../api/client.jsx";
import { useAuth } from "../auth/AuthContext.jsx";

const styles = {
  page: {
    padding: 24,
    display: "flex",
    justifyContent: "center", 
  },
  card: {
    maxWidth: 720,
    background: "#fff",
    border: "1px solid rgba(15, 23, 42, 0.10)", // slate-ish
    borderRadius: 16,
    padding: 20,
    boxShadow: "0 10px 30px rgba(2, 6, 23, 0.06)",
  },
  title: { margin: 0, fontSize: 34, letterSpacing: "-0.02em" },
  subtitle: { marginTop: 10, marginBottom: 0, color: "rgba(15,23,42,0.72)" },

  form: { marginTop: 18, display: "grid", gap: 14 },
  row: { display: "grid", gap: 8 },

  label: { fontSize: 13, color: "rgba(15,23,42,0.72)" },

  input: {
    height: 42,
    padding: "0 12px",
    borderRadius: 12,
    border: "1px solid rgba(15, 23, 42, 0.14)",
    outline: "none",
    background: "rgba(255,255,255,0.9)",
  },

  actions: { display: "flex", gap: 10, alignItems: "center", marginTop: 6 },

  button: {
    height: 40,
    padding: "0 14px",
    borderRadius: 999,
    border: "1px solid rgba(15, 23, 42, 0.14)",
    background: "#fff",
    cursor: "pointer",
    fontWeight: 600,
  },

  buttonPrimary: {
    height: 40,
    padding: "0 14px",
    borderRadius: 999,
    border: "1px solid rgba(15, 23, 42, 0.14)",
    background: "rgba(255, 91, 138, 0.10)", // 你顶部那个粉色选中 느낌
    color: "#9f1239",
    cursor: "pointer",
    fontWeight: 700,
  },

  buttonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },

  badgeWrap: { display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" },

  badgeOk: {
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid rgba(50,196,141,0.28)",
    background: "rgba(50,196,141,0.14)",
    color: "#065f46",
    fontSize: 13,
    fontWeight: 600,
  },

  badgeErr: {
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid rgba(255,91,138,0.26)",
    background: "rgba(255,91,138,0.12)",
    color: "#9f1239",
    fontSize: 13,
    fontWeight: 600,
  },

  divider: {
    marginTop: 16,
    marginBottom: 4,
    height: 1,
    background: "rgba(15, 23, 42, 0.08)",
  },

  hint: { fontSize: 13, color: "rgba(15,23,42,0.60)", marginTop: 10 },
};

export default function StaffRegister() {
  const { role } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  // 非 ADMIN：保持你原来的逻辑，但 UI 也做成一致的 card
  if (String(role || "").toUpperCase() !== "ADMIN") {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <h1 style={styles.title}>No Permission</h1>
          <p style={styles.subtitle}>Only admin can register staff accounts.</p>
        </div>
      </div>
    );
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr(null);
    setMsg(null);

    const u = username.trim();
    const p = password;

    if (!u || !p) {
      setErr("Please enter username and password.");
      return;
    }

    try {
      setLoading(true);
      const data = await api("/admin/staff", {
        method: "POST",
        body: JSON.stringify({ username: u, password: p }),
      });
      setMsg(`Staff created: ${data?.username ?? u}`);
      setUsername("");
      setPassword("");
    } catch (e2) {
      setErr(String(e2?.message || e2));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Staff Registration</h1>
        <p style={styles.subtitle}>Create a new staff account (Admin only).</p>

        <div style={styles.divider} />

        <form onSubmit={onSubmit} style={styles.form}>
          <div style={styles.row}>
            <div style={styles.label}>Staff Username</div>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g., staff2"
              style={styles.input}
            />
          </div>

          <div style={styles.row}>
            <div style={styles.label}>Staff Password</div>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="e.g., 123456"
              type="password"
              style={styles.input}
            />
          </div>

          <div style={styles.actions}>
            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.buttonPrimary,
                ...(loading ? styles.buttonDisabled : {}),
              }}
            >
              {loading ? "Creating..." : "Create Staff"}
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => {
                setUsername("");
                setPassword("");
                setMsg(null);
                setErr(null);
              }}
              style={{
                ...styles.button,
                ...(loading ? styles.buttonDisabled : {}),
              }}
            >
              Clear
            </button>
          </div>

          {(msg || err) && (
            <div style={styles.badgeWrap}>
              {msg && <div style={styles.badgeOk}>{msg}</div>}
              {err && <div style={styles.badgeErr}>{err}</div>}
            </div>
          )}

          <div style={styles.hint}>
            Tip: Staff accounts are created by admin only. 
          </div>
        </form>
      </div>
    </div>
  );
}
