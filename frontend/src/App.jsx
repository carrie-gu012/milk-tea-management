// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import OrdersList from "./pages/OrdersList.jsx";
import OrderCreate from "./pages/OrderCreate.jsx";
import OrderDetail from "./pages/OrderDetail.jsx";
import Inventory from "./pages/Inventory.jsx";
import StaffRegister from "./pages/StaffRegister.jsx";
import RoleGate from "./components/RoleGate.jsx";
import AppLayout from "./components/AppLayout.jsx";
import Products from "./pages/Products.jsx";
import Analytics from "./pages/Analytics.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* ✅ 登录后：统一进入 AppLayout（Navbar + Outlet） */}
      <Route
        element={
          <RoleGate allow={["ADMIN", "STAFF"]}>
            <AppLayout />
          </RoleGate>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/orders" element={<OrdersList />} />
        <Route path="/orders/new" element={<OrderCreate />} />
        <Route path="/orders/:orderId" element={<OrderDetail />} />
        <Route path="/products" element={<Products />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/staff/register" element={<StaffRegister />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
