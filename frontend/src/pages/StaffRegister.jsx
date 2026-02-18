import React, { useEffect, useMemo, useState } from "react";
import { api } from "../api/client.jsx";
import { useAuth } from "../auth/AuthContext.jsx";

const styles = {
  page: {
    padding: 24,
    display: "flex",
    justifyContent: "center",
  },
  card: {
    width: "100%",
    maxWidth: 920,
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

  actions: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    marginTop: 6,
    flexWrap: "wrap",
  },

  button: {
    height: 40,
    padding: "0 14px",
    borderRadius: 999,
    border: "1px solid rgba(15, 23, 42, 0.14)",
    background: "#fff",
    cursor: "pointer",
    fontWeight: 600,
    whiteSpace: "nowrap",
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
    whiteSpace: "nowrap",
  },

  buttonDanger: {
    height: 40,
    padding: "0 14px",
    borderRadius: 999,
    border: "1px solid rgba(255,91,138,0.26)",
    background: "rgba(255,91,138,0.12)",
    color: "#9f1239",
    cursor: "pointer",
    fontWeight: 700,
    whiteSpace: "nowrap",
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
    marginBottom: 16,
    height: 1,
    background: "rgba(15, 23, 42, 0.08)",
  },

  hint: { fontSize: 13, color: "rgba(15,23,42,0.60)", marginTop: 10 },

  sectionTitle: { margin: "6px 0 0", fontSize: 18, fontWeight: 800 },
  sectionSub: { margin: "6px 0 0", color: "rgba(15,23,42,0.72)", fontSize: 13 },

  tableWrap: {
    marginTop: 14,
    border: "1px solid rgba(15,23,42,0.10)",
    borderRadius: 14,
    overflow: "hidden",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    textAlign: "left",
    fontSize: 12,
    letterSpacing: "0.02em",
    color: "rgba(15,23,42,0.70)",
    padding: "10px 12px",
    background: "rgba(15,23,42,0.04)",
    borderBottom: "1px solid rgba(15,23,42,0.08)",
  },
  td: {
    padding: "10px 12px",
    borderBottom: "1px solid rgba(15,23,42,0.06)",
    verticalAlign: "middle",
    fontSize: 14,
  },
  small: { fontSize: 12, color: "rgba(15,23,42,0.65)" },

  chipOk: {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: 999,
    border: "1px solid rgba(50,196,141,0.28)",
    background: "rgba(50,196,141,0.14)",
    color: "#065f46",
    fontSize: 12,
    fontWeight: 700,
  },
  chipOff: {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: 999,
    border: "1px solid rgba(100,116,139,0.22)",
    background: "rgba(100,116,139,0.10)",
    color: "rgba(15,23,42,0.72)",
    fontSize: 12,
    fontWeight: 700,
  },

  inlineInput: {
    height: 36,
    padding: "0 10px",
    borderRadius: 12,
    border: "1px solid rgba(15, 23, 42, 0.14)",
    outline: "none",
    background: "rgba(255,255,255,0.95)",
    width: 190,
  },

  rowActions: {
    display: "flex",
    gap: 8,
    alignItems: "center",
    flexWrap: "wrap",
  },
};

export default function StaffRegister() {
  const { role } = useAuth();

  // create staff form
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // global messages
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);

  // create loading
  const [loadingCreate, setLoadingCreate] = useState(false);

  // list
  const [staff, setStaff] = useState([]);
  const [loadingList, setLoadingList] = useState(false);

  // edit username
  const [editId, setEditId] = useState(null);
  const [editUsername, setEditUsername] = useState("");

  // reset password
  const [pwId, setPwId] = useState(null);
  const [pwValue, setPwValue] = useState("");

  // row action loading (avoid multiple clicks)
  const [busyId, setBusyId] = useState(null);

  const isAdmin = useMemo(
    () => String(role || "").toUpperCase() === "ADMIN",
    [role],
  );

  // 非 ADMIN：保留你原来的逻辑
  if (!isAdmin) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <h1 style={styles.title}>No Permission</h1>
          <p style={styles.subtitle}>Only admin can manage staff accounts.</p>
        </div>
      </div>
    );
  }

  async function reloadStaff() {
    setErr(null);
    try {
      setLoadingList(true);
      const data = await api("/admin/staff");
      setStaff(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(String(e?.message || e));
    } finally {
      setLoadingList(false);
    }
  }

  useEffect(() => {
    reloadStaff();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreate(e) {
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
      setLoadingCreate(true);
      const data = await api("/admin/staff", {
        method: "POST",
        body: JSON.stringify({ username: u, password: p }),
      });

      setMsg(`Staff created: ${data?.username ?? u}`);
      setUsername("");
      setPassword("");

      await reloadStaff();
    } catch (e2) {
      setErr(String(e2?.message || e2));
    } finally {
      setLoadingCreate(false);
    }
  }

  function startEdit(row) {
    setMsg(null);
    setErr(null);
    setPwId(null);
    setPwValue("");
    setEditId(row.staffId);
    setEditUsername(row.username || "");
  }

  function cancelEdit() {
    setEditId(null);
    setEditUsername("");
  }

  async function saveEdit(staffId) {
    const newU = editUsername.trim();
    if (!newU) {
      setErr("Username cannot be empty.");
      return;
    }
    try {
      setBusyId(staffId);
      setErr(null);
      setMsg(null);

      await api(`/admin/staff/${staffId}`, {
        method: "PATCH",
        body: JSON.stringify({ username: newU }),
      });

      setMsg("Username updated.");
      cancelEdit();
      await reloadStaff();
    } catch (e) {
      setErr(String(e?.message || e));
    } finally {
      setBusyId(null);
    }
  }

  function startResetPassword(row) {
    setMsg(null);
    setErr(null);
    setEditId(null);
    setEditUsername("");
    setPwId(row.staffId);
    setPwValue("");
  }

  function cancelResetPassword() {
    setPwId(null);
    setPwValue("");
  }

  async function saveResetPassword(staffId) {
    const pw = pwValue;
    if (!pw || String(pw).trim().length === 0) {
      setErr("Password cannot be empty.");
      return;
    }
    try {
      setBusyId(staffId);
      setErr(null);
      setMsg(null);

      await api(`/admin/staff/${staffId}/password`, {
        method: "PATCH",
        body: JSON.stringify({ password: pw }),
      });

      setMsg("Password updated.");
      cancelResetPassword();
      await reloadStaff();
    } catch (e) {
      setErr(String(e?.message || e));
    } finally {
      setBusyId(null);
    }
  }

  async function onDelete(row) {
    const ok = window.confirm(
      `Delete staff "${row.username}" (ID: ${row.staffId})? This cannot be undone.`,
    );
    if (!ok) return;

    try {
      setBusyId(row.staffId);
      setErr(null);
      setMsg(null);

      await api(`/admin/staff/${row.staffId}`, { method: "DELETE" });

      setMsg("Staff deleted.");
      await reloadStaff();
    } catch (e) {
      setErr(String(e?.message || e));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Staff Management</h1>
        <p style={styles.subtitle}>
          Create / view / update / delete staff accounts (Admin only).
        </p>

        {/* ===== Create Section ===== */}
        <div style={styles.divider} />
        <div>
          <div style={styles.sectionTitle}>Create Staff</div>
          <div style={styles.sectionSub}>Create a new staff account.</div>

          <form onSubmit={onCreate} style={styles.form}>
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
                disabled={loadingCreate}
                style={{
                  ...styles.buttonPrimary,
                  ...(loadingCreate ? styles.buttonDisabled : {}),
                }}
              >
                {loadingCreate ? "Creating..." : "Create Staff"}
              </button>

              <button
                type="button"
                disabled={loadingCreate}
                onClick={() => {
                  setUsername("");
                  setPassword("");
                  setMsg(null);
                  setErr(null);
                }}
                style={{
                  ...styles.button,
                  ...(loadingCreate ? styles.buttonDisabled : {}),
                }}
              >
                Clear
              </button>

              <button
                type="button"
                disabled={loadingList}
                onClick={reloadStaff}
                style={{
                  ...styles.button,
                  ...(loadingList ? styles.buttonDisabled : {}),
                }}
              >
                {loadingList ? "Refreshing..." : "Refresh List"}
              </button>
            </div>

            {(msg || err) && (
              <div style={styles.badgeWrap}>
                {msg && <div style={styles.badgeOk}>{msg}</div>}
                {err && <div style={styles.badgeErr}>{err}</div>}
              </div>
            )}

            <div style={styles.hint}>
              Tip: Use the list below to rename staff, reset password, or delete
              them.
            </div>
          </form>
        </div>

        {/* ===== List Section ===== */}
        <div style={styles.divider} />
        <div>
          <div style={styles.sectionTitle}>Staff List</div>
          <div style={styles.sectionSub}>
            All staff accounts currently in the system.
          </div>

          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Username</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {loadingList ? (
                  <tr>
                    <td style={styles.td} colSpan={4}>
                      Loading...
                    </td>
                  </tr>
                ) : staff.length === 0 ? (
                  <tr>
                    <td style={styles.td} colSpan={4}>
                      <span style={styles.small}>No staff found.</span>
                    </td>
                  </tr>
                ) : (
                  staff.map((row) => {
                    const id = row.staffId ?? row.staff_id ?? row.id; // 兼容万一你后端字段名不同
                    const uname = row.username ?? "";
                    const active =
                      row.active ??
                      row.isActive ??
                      row.is_active ??
                      row.is_active === 1 ??
                      true;

                    const isBusy = busyId === id;

                    return (
                      <tr key={id}>
                        <td style={styles.td}>{id}</td>

                        <td style={styles.td}>
                          {editId === id ? (
                            <input
                              value={editUsername}
                              onChange={(e) => setEditUsername(e.target.value)}
                              style={styles.inlineInput}
                            />
                          ) : (
                            uname
                          )}
                        </td>

                        <td style={styles.td}>
                          {active ? (
                            <span style={styles.chipOk}>ACTIVE</span>
                          ) : (
                            <span style={styles.chipOff}>INACTIVE</span>
                          )}
                        </td>

                        <td style={styles.td}>
                          <div style={styles.rowActions}>
                            {/* Rename */}
                            {editId === id ? (
                              <>
                                <button
                                  type="button"
                                  disabled={isBusy}
                                  onClick={() => saveEdit(id)}
                                  style={{
                                    ...styles.buttonPrimary,
                                    ...(isBusy ? styles.buttonDisabled : {}),
                                  }}
                                >
                                  {isBusy ? "Saving..." : "Save"}
                                </button>
                                <button
                                  type="button"
                                  disabled={isBusy}
                                  onClick={cancelEdit}
                                  style={{
                                    ...styles.button,
                                    ...(isBusy ? styles.buttonDisabled : {}),
                                  }}
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                onClick={() =>
                                  startEdit({ staffId: id, username: uname })
                                }
                                style={styles.button}
                              >
                                Rename
                              </button>
                            )}

                            {/* Reset password */}
                            {pwId === id ? (
                              <>
                                <input
                                  value={pwValue}
                                  onChange={(e) => setPwValue(e.target.value)}
                                  placeholder="new password"
                                  type="password"
                                  style={styles.inlineInput}
                                />
                                <button
                                  type="button"
                                  disabled={isBusy}
                                  onClick={() => saveResetPassword(id)}
                                  style={{
                                    ...styles.buttonPrimary,
                                    ...(isBusy ? styles.buttonDisabled : {}),
                                  }}
                                >
                                  {isBusy ? "Saving..." : "Set Password"}
                                </button>
                                <button
                                  type="button"
                                  disabled={isBusy}
                                  onClick={cancelResetPassword}
                                  style={{
                                    ...styles.button,
                                    ...(isBusy ? styles.buttonDisabled : {}),
                                  }}
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                onClick={() =>
                                  startResetPassword({ staffId: id })
                                }
                                style={styles.button}
                              >
                                Reset PW
                              </button>
                            )}

                            {/* Delete */}
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() =>
                                onDelete({ staffId: id, username: uname })
                              }
                              style={{
                                ...styles.buttonDanger,
                                ...(isBusy ? styles.buttonDisabled : {}),
                              }}
                            >
                              {isBusy ? "Working..." : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
