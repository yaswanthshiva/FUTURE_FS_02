// =============================================
// models/Admin.js — Admin User Schema
// =============================================
// This defines the structure (schema) of an Admin document
// in the MongoDB "admins" collection.

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // Used to hash passwords

// Schema = blueprint for how documents look in MongoDB
const AdminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true, // removes whitespace from both ends
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // no two admins can have the same email
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false, // won't be returned in queries by default (security!)
    },
    role: {
      type: String,
      default: "admin",
    },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt fields
  }
);

// -----------------------------------------------
// MIDDLEWARE: Hash password before saving
// -----------------------------------------------
// This runs automatically BEFORE a document is saved.
// It encrypts the password so we never store plain text.
AdminSchema.pre("save", async function (next) {
  // Only hash if password was modified (not on every save)
  if (!this.isModified("password")) return next();

  // bcrypt.genSalt(10) creates a "salt" — random data added to password
  // The number 10 is the "cost factor" — higher = more secure but slower
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// -----------------------------------------------
// INSTANCE METHOD: Compare passwords
// -----------------------------------------------
// We add a custom method to compare entered password vs stored hash
AdminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Admin", AdminSchema);
