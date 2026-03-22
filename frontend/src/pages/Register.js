// =============================================
// pages/Register.js — Create New Admin Account
// =============================================

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { admin } = useAuth();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Invalid email format";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 6) errs.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword) errs.confirmPassword = "Passwords do not match";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    try {
      if (admin) {
        await authAPI.register({ name: form.name, email: form.email, password: form.password });
      } else {
        await authAPI.publicRegister({ name: form.name, email: form.email, password: form.password });
      }
      toast.success("Account created! Please sign in.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // Password requirements checklist
  const requirements = [
    { label: "At least 6 characters",        met: form.password.length >= 6 },
    { label: "One uppercase letter (A-Z)",    met: /[A-Z]/.test(form.password) },
    { label: "One lowercase letter (a-z)",    met: /[a-z]/.test(form.password) },
    { label: "One number (0-9)",              met: /[0-9]/.test(form.password) },
    { label: "One special character (!@#$)",  met: /[^A-Za-z0-9]/.test(form.password) },
  ];

  return (
    <div className="login-page">
      <div className="login-bg">
        <div className="login-orb orb-1"></div>
        <div className="login-orb orb-2"></div>
        <div className="login-orb orb-3"></div>
      </div>

      <div className="login-container" style={{ maxWidth: 460 }}>
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">
              <span className="logo-icon">◈</span>
              <span className="logo-text">LeadFlow</span>
            </div>
            <h1>Create Account</h1>
            <p>Set up your admin account to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">

            {/* Full Name */}
            <div className={`form-group ${errors.name ? "form-group--error" : ""}`}>
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Rahul Sharma"
                autoComplete="name"
              />
              {errors.name && <span className="error-msg">{errors.name}</span>}
            </div>

            {/* Email */}
            <div className={`form-group ${errors.email ? "form-group--error" : ""}`}>
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
              />
              {errors.email && <span className="error-msg">{errors.email}</span>}
            </div>

            {/* Password */}
            <div className={`form-group ${errors.password ? "form-group--error" : ""}`}>
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                autoComplete="new-password"
              />
              {form.password && (
                <ul className="password-requirements">
                  {requirements.map((req, i) => (
                    <li key={i} className={req.met ? "req-met" : "req-unmet"}>
                      <span className="req-icon">{req.met ? "✓" : "✕"}</span>
                      {req.label}
                    </li>
                  ))}
                </ul>
              )}
              {errors.password && <span className="error-msg">{errors.password}</span>}
            </div>

            {/* Confirm Password */}
            <div className={`form-group ${errors.confirmPassword ? "form-group--error" : ""}`}>
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                autoComplete="new-password"
              />
              {form.confirmPassword && form.password === form.confirmPassword && (
                <span className="match-ok">✓ Passwords match</span>
              )}
              {errors.confirmPassword && <span className="error-msg">{errors.confirmPassword}</span>}
            </div>

            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? (
                <span className="btn-loading">
                  <span className="spinner"></span> Creating account...
                </span>
              ) : (
                "Create Account →"
              )}
            </button>

          </form>

          <div className="login-divider">
            <span>Already have an account?</span>
          </div>

          <a href="/login" className="btn-create-account btn-create-account--outline">
            Sign In Instead
          </a>

        </div>
      </div>
    </div>
  );
};

export default Register;
