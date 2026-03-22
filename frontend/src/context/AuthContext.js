// =============================================
// context/AuthContext.js — Global Auth State
// =============================================
// React Context lets us share state across ALL components
// without "prop drilling" (passing props through many levels).
//
// HOW IT WORKS:
// 1. AuthProvider wraps the entire app
// 2. Any component can call useAuth() to get/set auth state
// 3. When admin logs in, we save token to localStorage
//    so they stay logged in after page refresh

import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../utils/api";

// Step 1: Create the context
const AuthContext = createContext(null);

// Step 2: Create the Provider component
export const AuthProvider = ({ children }) => {
  // State: the logged-in admin object
  const [admin, setAdmin] = useState(null);
  // State: are we still checking if user is logged in?
  const [loading, setLoading] = useState(true);

  // -----------------------------------------------
  // On app load: check if there's a saved token
  // -----------------------------------------------
  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem("crmToken");
      if (token) {
        try {
          // Verify token is still valid by calling /api/auth/me
          const res = await authAPI.getMe();
          setAdmin(res.data.admin);
        } catch (error) {
          // Token invalid/expired — clear storage
          localStorage.removeItem("crmToken");
          localStorage.removeItem("crmAdmin");
        }
      }
      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  // -----------------------------------------------
  // Login function
  // -----------------------------------------------
  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });

    if (res.data.success) {
      // Save token to localStorage (persists across page refreshes)
      localStorage.setItem("crmToken", res.data.token);
      localStorage.setItem("crmAdmin", JSON.stringify(res.data.admin));
      setAdmin(res.data.admin);
      return { success: true };
    }

    return { success: false, message: res.data.message };
  };

  // -----------------------------------------------
  // Logout function
  // -----------------------------------------------
  const logout = () => {
    localStorage.removeItem("crmToken");
    localStorage.removeItem("crmAdmin");
    setAdmin(null);
  };

  // Step 3: Provide values to all child components
  return (
    <AuthContext.Provider value={{ admin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Step 4: Custom hook — makes using context cleaner
// Usage in any component: const { admin, login, logout } = useAuth();
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
