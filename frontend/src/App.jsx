import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import OrdersList from "./pages/OrdersList.jsx";
import OrderCreate from "./pages/OrderCreate.jsx";
import OrderDetail from "./pages/OrderDetail.jsx";
import Inventory from "./pages/Inventory.jsx";
import LowStock from "./pages/LowStock.jsx";
import StaffRegister from "./pages/StaffRegister.jsx";
import RoleGate from "./components/RoleGate.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <RoleGate allow={["ADMIN", "STAFF"]}>
            <Home />
          </RoleGate>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
