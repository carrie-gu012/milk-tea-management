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

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

       <Route
        element={
          <RoleGate allow={["ADMIN", "STAFF"]}>
            <AppLayout />
          </RoleGate>
        }
      ></Route>

      <Route
        path="/"
        element={
          <RoleGate allow={["ADMIN", "STAFF"]}>
            <Home />
          </RoleGate>
        }
      />

      <Route
        path="/orders"
        element={
          <RoleGate allow={["ADMIN", "STAFF"]}>
            <OrdersList />
          </RoleGate>
        }
      />

      <Route
        path="/orders/new"
        element={
          <RoleGate allow={["ADMIN", "STAFF"]}>
            <OrderCreate />
          </RoleGate>
        }
      />

      <Route
        path="/orders/:orderId"
        element={
          <RoleGate allow={["ADMIN", "STAFF"]}>
            <OrderDetail />
          </RoleGate>
        }
      />

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

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
