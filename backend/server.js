// =============================================
// server.js — Express Application Entry Point
// =============================================
// This is the main file that starts our backend server.
// It sets up Express, connects to MongoDB, and registers routes.

// Load environment variables from .env file FIRST
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Initialize Express app
const app = express();

// -----------------------------------------------
// Connect to MongoDB
// -----------------------------------------------
connectDB();

// -----------------------------------------------
// Middleware Setup
// -----------------------------------------------

// CORS: Allow frontend (React) to communicate with backend
// In production, replace with your actual frontend domain
app.use(cors({
  origin: [
    'https://future-fs-02-lilac.vercel.app',
    'https://future-fs-02-fxt5sgv4h-yaswanth-shiva.vercel.app',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse incoming JSON request bodies
// Without this, req.body would be undefined
app.use(express.json());

// Parse URL-encoded bodies (form data)
app.use(express.urlencoded({ extended: true }));

// -----------------------------------------------
// Routes
// -----------------------------------------------
// All auth routes → /api/auth/...
app.use("/api/auth", require("./routes/authRoutes"));

// All lead routes → /api/leads/...
app.use("/api/leads", require("./routes/leadRoutes"));

// -----------------------------------------------
// Health Check Route
// -----------------------------------------------
// Useful to verify the server is running
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "🚀 CRM API is running!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// -----------------------------------------------
// 404 Handler — for undefined routes
// -----------------------------------------------
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// -----------------------------------------------
// Global Error Handler
// -----------------------------------------------
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong on the server",
  });
});

// -----------------------------------------------
// Start Server
// -----------------------------------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════╗
  ║     CRM Backend Server Running        ║
  ║     http://localhost:${PORT}             ║
  ║     Environment: ${process.env.NODE_ENV || "development"}          ║
  ╚═══════════════════════════════════════╝
  `);
});

module.exports = app;
