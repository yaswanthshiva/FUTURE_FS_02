const express = require("express");

const { register, login, getAdmins } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/admins", authMiddleware, getAdmins);

module.exports = router;
