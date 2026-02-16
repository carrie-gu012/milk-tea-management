// src/App.jsx
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
        {/* 👇 这些都是 AppLayout 的子页面，所以都会显示 Navbar */}
        <Route path="/" element={<Home />} />
        <Route path="/orders" element={<OrdersList />} />
        <Route path="/orders/new" element={<OrderCreate />} />
        <Route path="/orders/:orderId" element={<OrderDetail />} />
        <Route path="/products" element={<Products />} />
        <Route path="/analytics" element={<Analytics />} />

        {/* ADMIN only */}
        <Route
          path="/inventory"
          element={
            <RoleGate allow={["ADMIN"]}>
              <Inventory />
            </RoleGate>
          }
        />
        <Route
          path="/low-stock"
          element={
            <RoleGate allow={["ADMIN"]}>
              <LowStock />
            </RoleGate>
          }
        />
        <Route
          path="/staff/register"
          element={
            <RoleGate allow={["ADMIN"]}>
              <StaffRegister />
            </RoleGate>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
