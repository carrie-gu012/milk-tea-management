// src/components/RoleGate.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

export default function RoleGate({ allow, children }) {
  const { token, role, isReady } = useAuth();

  if (!isReady) return <div style={{ padding: 16 }}>Loading...</div>;
  if (!token || !role) return <Navigate to="/login" replace />;
  if (!allow.includes(role))
    return <div style={{ padding: 16 }}>No permission.</div>;

  return <>{children}</>;
}
