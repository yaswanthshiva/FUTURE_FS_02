// =============================================
// config/db.js — MongoDB Connection
// =============================================
// This file handles connecting to MongoDB using Mongoose.
// Mongoose is an ODM (Object Data Modelling) library that
// lets us define schemas and interact with MongoDB easily.

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // mongoose.connect() returns a promise, so we await it
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Exit process with failure code if DB doesn't connect
    process.exit(1);
  }
};

module.exports = connectDB;
