// =============================================
// components/Layout.js — App Shell with Sidebar
// =============================================

import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const NAV_ITEMS = [
  { path: "/dashboard", label: "Dashboard", icon: "◈" },
  { path: "/leads",     label: "All Leads",  icon: "◎" },
  { path: "/leads/new", label: "Add Lead",   icon: "+" },
];

const Layout = ({ children }) => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="app-shell">
      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`sidebar ${sidebarOpen ? "sidebar--open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="sidebar-logo-icon">◈</span>
            <span className="sidebar-logo-text">LeadFlow</span>
          </div>
          <button
            className="sidebar-close"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
        </div>

        <nav className="sidebar-nav">
          <p className="nav-section-label">Navigation</p>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-item ${isActive ? "nav-item--active" : ""}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="admin-info">
            <div className="admin-avatar">
              {admin?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <div className="admin-details">
              <p className="admin-name">{admin?.name}</p>
              <p className="admin-role">{admin?.role}</p>
            </div>
          </div>
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="main-content">
        {/* Top bar (mobile) */}
        <div className="topbar">
          <button
            className="hamburger"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>
          <div className="topbar-logo">◈ LeadFlow</div>
          <div className="topbar-admin">
            {admin?.name?.charAt(0)?.toUpperCase() || "A"}
          </div>
        </div>

        <div className="content-area">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
