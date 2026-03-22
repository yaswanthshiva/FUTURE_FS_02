// =============================================
// routes/authRoutes.js — Authentication Routes
// =============================================
// These routes handle admin login, registration, and profile.
// POST /api/auth/login    → login and get JWT token
// POST /api/auth/register → create new admin (protected)
// GET  /api/auth/me       → get logged-in admin's profile

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const { protect } = require("../middleware/auth");

// -----------------------------------------------
// Helper: Generate JWT Token
// -----------------------------------------------
// We create the token with the admin's ID embedded inside.
// The token expires based on JWT_EXPIRE in .env
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

// -----------------------------------------------
// POST /api/auth/login
// -----------------------------------------------
// Public route — anyone can attempt login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide email and password",
    });
  }

  try {
    // Find admin by email (include password field — it's excluded by default)
    const admin = await Admin.findOne({ email }).select("+password");

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Compare entered password with hashed password in DB
    const isMatch = await admin.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate token and send response
    const token = generateToken(admin._id);

    res.json({
      success: true,
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// -----------------------------------------------
// POST /api/auth/register
// -----------------------------------------------
// Protected route — only logged-in admins can create new admins
router.post("/register", protect, async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide name, email, and password",
    });
  }

  try {
    // Check if email already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "An admin with this email already exists",
      });
    }

    // Create the admin (password gets hashed by the pre-save hook in model)
    const admin = await Admin.create({ name, email, password });

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// -----------------------------------------------
// GET /api/auth/me
// -----------------------------------------------
// Protected route — returns the logged-in admin's info
router.get("/me", protect, async (req, res) => {
  res.json({
    success: true,
    admin: {
      id: req.admin._id,
      name: req.admin.name,
      email: req.admin.email,
      role: req.admin.role,
    },
  });
});

// -----------------------------------------------
// POST /api/auth/public-register
// -----------------------------------------------
// Open registration — anyone can create an account.
// In production you may want to restrict this or add an invite system.
router.post("/public-register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "Please provide name, email, and password" });
  }
  if (password.length < 6) {
    return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
  }

  try {
    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "An account with this email already exists" });
    }

    await Admin.create({ name, email, password });

    res.status(201).json({ success: true, message: "Account created successfully! Please sign in." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// -----------------------------------------------
// POST /api/auth/seed
// -----------------------------------------------
// Special one-time route to create the first admin
// Should be disabled in production!
router.post("/seed", async (req, res) => {
  try {
    const count = await Admin.countDocuments();
    if (count > 0) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists. Seed disabled.",
      });
    }

    const admin = await Admin.create({
      name: "Super Admin",
      email: process.env.ADMIN_EMAIL || "admin@crm.com",
      password: process.env.ADMIN_PASSWORD || "Admin@123",
    });

    res.status(201).json({
      success: true,
      message: "✅ Default admin created! Login with your .env credentials.",
      email: admin.email,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
