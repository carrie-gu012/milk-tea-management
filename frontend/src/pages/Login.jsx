// src/pages/Login.jsx
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();

  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin");
  const [err, setErr] = useState(null);

  return (
    <div style={{ padding: 16, maxWidth: 360 }}>
      <h2>Login</h2>

      <div style={{ marginTop: 8 }}>
        <div>Username</div>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ marginTop: 8 }}>
        <div>Password</div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%" }}
        />
      </div>

      {err && <div style={{ marginTop: 8, color: "red" }}>{err}</div>}

      <button
        style={{ marginTop: 12, width: "100%" }}
        onClick={async () => {
          try {
            setErr(null);
            await login(username, password); // 目前是假登录
            nav("/", { replace: true });
          } catch (e) {
            setErr(e?.message ?? "Login failed");
          }
        }}
      >
        Sign in
      </button>

      <p style={{ marginTop: 12, fontSize: 12, opacity: 0.7 }}>
        (Dev mode) This currently uses a fake login in AuthContext.
      </p>
    </div>
  );
}
