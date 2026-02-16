import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

export default function Navbar() {
  const { username, role, logout } = useAuth();
  const nav = useNavigate();

  const linkCls = ({ isActive }) => "nav-link" + (isActive ? " active" : "");

  return (
    <header className="nav">
      <div className="nav-inner">
        <div
          className="brand"
          style={{ cursor: "pointer" }}
          onClick={() => nav("/")}
        >
          <div className="logo" />
          <div>Hikari · Milk Tea</div>
        </div>

        <nav className="nav-links">
          <NavLink className={linkCls} to="/orders">
            Orders
          </NavLink>
          <NavLink className={linkCls} to="/products">
            Products
          </NavLink>
          <NavLink className={linkCls} to="/inventory">
            Inventory
          </NavLink>
          <NavLink className={linkCls} to="/analytics">
            Data Analysis
          </NavLink>
          <NavLink className={linkCls} to="/staff/register">
            Register Staff
          </NavLink>
        </nav>

        <div className="nav-right">
          <span className="pill">{username ? `@${username}` : "Guest"}</span>
          <span className="pill">Role: {role ?? "-"}</span>
          <button
            className="btn"
            onClick={() => {
              logout();
              nav("/login", { replace: true });
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
