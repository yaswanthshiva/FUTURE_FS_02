// =============================================
// models/Lead.js — Lead Schema
// =============================================
// This defines the structure of a Lead document.
// Each lead represents a potential customer/client.

const mongoose = require("mongoose");

const LeadSchema = new mongoose.Schema(
  {
    // Basic contact info
    name: {
      type: String,
      required: [true, "Lead name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    company: {
      type: String,
      trim: true,
      default: "",
    },

    // Where did this lead come from?
    source: {
      type: String,
      enum: ["website", "referral", "social_media", "email_campaign", "cold_call", "other"],
      default: "website",
    },

    // Current stage in the sales pipeline
    status: {
      type: String,
      enum: ["new", "contacted", "qualified", "converted", "lost"],
      default: "new",
    },

    // Priority level
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    // Follow-up notes — array of note objects with timestamps
    notes: [
      {
        text: {
          type: String,
          required: true,
        },
        addedBy: {
          type: String,
          default: "Admin",
        },
        addedAt: {
          type: Date,
          default: Date.now, // automatically set when note is added
        },
      },
    ],

    // The message from the original contact form
    message: {
      type: String,
      default: "",
    },

    // Which admin is handling this lead
    assignedTo: {
      type: String,
      default: "Unassigned",
    },

    // Next follow-up date
    followUpDate: {
      type: Date,
      default: null,
    },
  },
  {
    // timestamps: true automatically adds:
    // - createdAt: when the lead was first created
    // - updatedAt: when the lead was last modified
    timestamps: true,
  }
);

// -----------------------------------------------
// INDEX: for faster searching
// -----------------------------------------------
// This creates a "text index" so we can do full-text searches
// across name, email, and company fields
LeadSchema.index({ name: "text", email: "text", company: "text" });

module.exports = mongoose.model("Lead", LeadSchema);
