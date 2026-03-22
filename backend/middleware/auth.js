// =============================================
// middleware/auth.js — JWT Authentication Guard
// =============================================
// "Middleware" in Express sits between the request and route handler.
// This middleware checks if the user has a valid JWT token.
// If not, it blocks access to protected routes.

const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const protect = async (req, res, next) => {
  let token;

  // -----------------------------------------------
  // Step 1: Extract token from request
  // -----------------------------------------------
  // Tokens are sent in the Authorization header as: "Bearer <token>"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Split "Bearer eyJhbGciOi..." → ["Bearer", "eyJhbGciOi..."]
    token = req.headers.authorization.split(" ")[1];
  }

  // If no token found, deny access
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized. No token provided.",
    });
  }

  try {
    // -----------------------------------------------
    // Step 2: Verify the token
    // -----------------------------------------------
    // jwt.verify() decodes the token and checks:
    // 1. Is the signature valid? (was it signed with our secret?)
    // 2. Has it expired?
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // -----------------------------------------------
    // Step 3: Attach admin info to request
    // -----------------------------------------------
    // decoded.id is the admin's MongoDB _id we embedded in the token
    req.admin = await Admin.findById(decoded.id);

    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: "Admin not found. Token invalid.",
      });
    }

    // Call next() to proceed to the actual route handler
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized. Token invalid or expired.",
    });
  }
};

module.exports = { protect };
