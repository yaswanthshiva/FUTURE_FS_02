// =============================================
// pages/Login.js — Admin Login Page
// =============================================

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        toast.success("Welcome back! 👋");
        navigate("/dashboard");
      } else {
        toast.error(result.message || "Login failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg">
        <div className="login-orb orb-1"></div>
        <div className="login-orb orb-2"></div>
        <div className="login-orb orb-3"></div>
      </div>

      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">
              <span className="logo-icon">◈</span>
              <span className="logo-text">LeadFlow</span>
            </div>
            <h1>Welcome back</h1>
            <p>Sign in to your admin account</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? (
                <span className="btn-loading">
                  <span className="spinner"></span> Signing in...
                </span>
              ) : (
                "Sign In →"
              )}
            </button>
          </form>

          <div className="login-divider">
            <span>Don't have an account?</span>
          </div>

          <a href="/register" className="btn-create-account">
            Create Account
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
