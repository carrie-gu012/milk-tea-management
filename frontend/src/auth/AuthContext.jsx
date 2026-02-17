// src/auth/AuthContext.jsx
import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import { api } from "../api/client.jsx";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  const value = useMemo(
    () => ({
      token,
      role,
      username,
      isReady,

      // ✅ 真实登录：调用后端
      login: async (u, p) => {
        const data = await api("/auth/login", {
          method: "POST",
          body: JSON.stringify({ username: u, password: p }),
        });

        // 期望后端返回：{ role: "ADMIN"|"STAFF", username: "xxx", token?: "..." }
        const nextRole = data?.role;
        const nextUsername = data?.username || u;
        const nextToken = data?.token || "session"; // 没 token 也没关系，先占位

        if (!nextRole) {
          throw new Error("Login failed: missing role from server.");
        }

        setToken(nextToken);
        setRole(nextRole);
        setUsername(nextUsername);

        localStorage.setItem("token", nextToken);
        localStorage.setItem("role", nextRole);
        localStorage.setItem("username", nextUsername);
      },

      logout: () => {
        setToken(null);
        setRole(null);
        setUsername(null);
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("username");
      },
    }),
    [token, role, username, isReady],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
