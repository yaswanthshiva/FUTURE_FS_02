import React, { useState } from "react";
import API from "../services/api";
import "../Auth.css";

function Signup() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await API.post("/auth/register", {
        email,
        password
      });

      alert("Account created successfully");

      window.location.href = "/";

    } catch (error) {
      alert("Signup failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <h2>Create Account</h2>

        <form onSubmit={handleSignup}>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e)=>setConfirmPassword(e.target.value)}
            required
          />

          <button type="submit">Create Account</button>

        </form>

        <p>
          Already have an account? <a href="/">Login</a>
        </p>

      </div>
    </div>
  );
}

export default Signup;