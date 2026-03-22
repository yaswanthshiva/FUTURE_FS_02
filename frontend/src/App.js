// =============================================
// App.js — Root Component with Routing
// =============================================
// React Router v6 handles navigation between pages.
// All dashboard routes are wrapped in ProtectedRoute.

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import LeadDetail from "./pages/LeadDetail";
import LeadForm from "./pages/LeadForm";

// Global styles
import "./styles.css";

// Helper: wraps a page in Layout + ProtectedRoute
const PrivatePage = ({ component: Component }) => (
  <ProtectedRoute>
    <Layout>
      <Component />
    </Layout>
  </ProtectedRoute>
);

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* Toast notifications — rendered at the top level */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#1a1a2e",
              color: "#e2e8f0",
              border: "1px solid #334155",
              borderRadius: "10px",
              fontSize: "14px",
            },
            success: { iconTheme: { primary: "#10b981", secondary: "#1a1a2e" } },
            error: { iconTheme: { primary: "#ef4444", secondary: "#1a1a2e" } },
          }}
        />

        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route path="/dashboard" element={<PrivatePage component={Dashboard} />} />
          <Route path="/leads" element={<PrivatePage component={Leads} />} />
          <Route path="/leads/new" element={<PrivatePage component={LeadForm} />} />
          <Route path="/leads/:id" element={<PrivatePage component={LeadDetail} />} />
          <Route path="/leads/:id/edit" element={<PrivatePage component={LeadForm} />} />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
