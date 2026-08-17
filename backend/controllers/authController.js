const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const signToken = (admin) =>
  jwt.sign(
    {
      id: admin._id,
      email: admin.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

const register = async (req, res) => {
  try {
    let { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // ✅ auto-generate name
    if (!name) {
      name = email.split("@")[0];
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      message: "Signup successful",
      token: signToken(admin)
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.status(200).json({
      message: "Login successful",
      token: signToken(admin),
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({}, "name email");
    return res.status(200).json(admins);
  } catch (error) {
    console.error("Get Admins Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  register,
  login,
  getAdmins,
};