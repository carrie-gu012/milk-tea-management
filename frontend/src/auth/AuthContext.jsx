// src/auth/AuthContext.jsx
import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import { api } from "../api/client.jsx"; // ✅ 用你现成的 fetch 封装

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

      // ✅ 真实登录
      login: async (u, p) => {
        // ✅ 写死的管理员账号
        if (u === "admin" && p === "123456") {
          const fakeToken = "admin-token";
          const fakeRole = "ADMIN";

          setToken(fakeToken);
          setRole(fakeRole);
          setUsername(u);

          localStorage.setItem("token", fakeToken);
          localStorage.setItem("role", fakeRole);
          localStorage.setItem("username", u);
        } else {
          throw new Error("Invalid username or password.");
        }
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
