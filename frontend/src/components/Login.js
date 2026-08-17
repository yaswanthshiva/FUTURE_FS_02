import React, { useState } from "react";
import API from "../services/api";
import "../Auth.css";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", {
        email,
        password
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("admin", JSON.stringify(res.data.admin));

      window.location.href = "/dashboard";

    } catch (error) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <h2>Welcome Back</h2>

        <form onSubmit={handleLogin}>

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

          <button type="submit">Login</button>

        </form>

        <p>
          Don’t have an account? <a href="/signup">Sign up</a>
        </p>

      </div>
    </div>
  );
}

export default Login;