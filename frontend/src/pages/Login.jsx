import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e?.preventDefault?.();
    try {
      setErr(null);
      setLoading(true);

      if (!username.trim() || !password) {
        throw new Error("Please enter your username and password.");
      }

      await login(username.trim(), password);

      // ✅ 登录成功直接进入主页
      nav("/", { replace: true });
    } catch (e2) {
      setErr(e2?.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-wrap">
      <div className="card login-card">
        <h1 className="h1">Sign in</h1>
        <p className="sub">Enter your account to continue.</p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <div className="label">Username</div>
            <input
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div className="field">
            <div className="label">Password</div>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {err && <div className="err">{err}</div>}

          <div className="login-actions">
            <button
              className="btn btn-primary"
              style={{ flex: 1 }}
              disabled={loading}
              type="submit"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
