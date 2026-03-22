// =============================================
// components/ProtectedRoute.js
// =============================================
// Wraps routes that require authentication.
// If user is not logged in, redirect to /login.

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { admin, loading } = useAuth();

  // While checking auth status, show a loading screen
  if (loading) {
    return (
      <div className="page-loading fullscreen">
        <div className="loading-spinner-lg"></div>
        <p>Initializing CRM...</p>
      </div>
    );
  }

  // If not logged in, redirect to login page
  if (!admin) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise render the protected component
  return children;
};

export default ProtectedRoute;
