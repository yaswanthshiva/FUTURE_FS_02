const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error("Error: MONGO_URI is missing in backend/.env");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
