// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import OrdersList from "./pages/OrdersList";
import OrderCreate from "./pages/OrderCreate";
import OrderDetail from "./pages/OrderDetail";
import Inventory from "./pages/Inventory";
import LowStock from "./pages/LowStock";
import StaffRegister from "./pages/StaffRegister";
import RoleGate from "./components/RoleGate";

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
