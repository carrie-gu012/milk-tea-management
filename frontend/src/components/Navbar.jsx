import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

export default function Navbar() {
  const { username, role, logout } = useAuth();
  const nav = useNavigate();

  return (
    <header className="nav">
      <div className="nav-inner">
        <div
          className="brand"
          style={{ cursor: "pointer" }}
          onClick={() => nav("/")}
        >
          <div className="logo" />
          <div>Hikari · Milk Tea Admin</div>
        </div>

        <nav className="nav-links">
          <NavLink
            className={({ isActive }) =>
              "nav-link" + (isActive ? " active" : "")
            }
            to="/"
          >
            Home
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              "nav-link" + (isActive ? " active" : "")
            }
            to="/orders"
          >
            Orders
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              "nav-link" + (isActive ? " active" : "")
            }
            to="/inventory"
          >
            Inventory
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              "nav-link" + (isActive ? " active" : "")
            }
            to="/low-stock"
          >
            Low Stock
          </NavLink>

          {/* staff 注册先不做：你想保留入口也行 */}
          {/* <NavLink className={({isActive}) => "nav-link"+(isActive?" active":"")} to="/staff/register">Staff</NavLink> */}
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
