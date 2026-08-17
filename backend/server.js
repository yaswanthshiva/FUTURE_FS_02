require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const leadRoutes = require("./routes/leadRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/leads", leadRoutes);
app.use("/api/auth", authRoutes);

app.listen(process.env.PORT, () => {
  console.log("Server running on port", process.env.PORT);
});