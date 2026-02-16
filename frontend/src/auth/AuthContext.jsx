// src/auth/AuthContext.jsx
import React, { createContext, useContext, useMemo, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // 先不验证 token（等你后端 auth 做完再加 /auth/me）
    setIsReady(true);
  }, []);

  const value = useMemo(() => ({
    token,
    role,
    username,
    isReady,
    login: async (u, p) => {
      // 这里之后接 /auth/login
      // 先做一个临时假登录，方便你把页面都跑通
      const fake = { token: "dev-token", role: "ADMIN", username: u };
      setToken(fake.token);
      setRole(fake.role);
      setUsername(fake.username);
      localStorage.setItem("token", fake.token);
      localStorage.setItem("role", fake.role);
      localStorage.setItem("username", fake.username);
    },
    logout: () => {
      setToken(null);
      setRole(null);
      setUsername(null);
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("username");
    },
  }), [token, role, username, isReady]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
