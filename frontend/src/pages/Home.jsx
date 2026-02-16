// src/pages/Home.jsx

import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ padding: 16 }}>
      <h1>Milk Tea Management</h1>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <Link to="/orders">Orders</Link>
        <Link to="/orders/new">Create Order</Link>
        <Link to="/inventory">Inventory (Admin)</Link>
        <Link to="/low-stock">Low Stock (Admin)</Link>
        <Link to="/staff/register">Register Staff (Admin)</Link>
      </div>
    </div>
  );
}
