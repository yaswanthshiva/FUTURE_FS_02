const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["new", "contacted", "converted"],
      default: "new",
    },
    source: {
      type: String,
      trim: true,
      default: "",
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
    activities: [
      {
        text: { type: String, required: true },
        date: { type: Date, default: Date.now },
        adminName: { type: String, required: true }
      }
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Lead", leadSchema);
