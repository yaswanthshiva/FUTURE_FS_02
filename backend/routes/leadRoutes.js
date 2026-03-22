// =============================================
// routes/leadRoutes.js — Lead CRUD Routes
// =============================================
// All routes here are PROTECTED (require JWT token)
//
// GET    /api/leads          → Get all leads (with search/filter)
// POST   /api/leads          → Create new lead
// GET    /api/leads/:id      → Get single lead
// PUT    /api/leads/:id      → Update lead
// DELETE /api/leads/:id      → Delete lead
// PATCH  /api/leads/:id/status → Update only the status
// POST   /api/leads/:id/notes  → Add a note to a lead
// DELETE /api/leads/:id/notes/:noteId → Delete a note
// GET    /api/leads/analytics → Get dashboard analytics

const express = require("express");
const router = express.Router();
const Lead = require("../models/Lead");
const { protect } = require("../middleware/auth");

// Apply 'protect' middleware to ALL routes in this file
router.use(protect);

// -----------------------------------------------
// GET /api/leads — Get all leads
// -----------------------------------------------
// Supports: ?search=, ?status=, ?source=, ?priority=, ?page=, ?limit=
router.get("/", async (req, res) => {
  try {
    const { search, status, source, priority, page = 1, limit = 10 } = req.query;

    // Build a "filter object" based on query params
    let filter = {};

    if (status) filter.status = status;
    if (source) filter.source = source;
    if (priority) filter.priority = priority;

    // Text search across name, email, company
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },   // case-insensitive
        { email: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
      ];
    }

    // Pagination math
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query with filter, sorting, and pagination
    const leads = await Lead.find(filter)
      .sort({ createdAt: -1 }) // newest first
      .skip(skip)
      .limit(parseInt(limit));

    // Count total for pagination info
    const total = await Lead.countDocuments(filter);

    res.json({
      success: true,
      count: leads.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      leads,
    });
  } catch (error) {
    console.error("Get leads error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// -----------------------------------------------
// GET /api/leads/analytics — Dashboard Stats
// -----------------------------------------------
router.get("/analytics", async (req, res) => {
  try {
    const total = await Lead.countDocuments();
    const newLeads = await Lead.countDocuments({ status: "new" });
    const contacted = await Lead.countDocuments({ status: "contacted" });
    const qualified = await Lead.countDocuments({ status: "qualified" });
    const converted = await Lead.countDocuments({ status: "converted" });
    const lost = await Lead.countDocuments({ status: "lost" });

    // Conversion rate = (converted / total) * 100
    const conversionRate = total > 0 ? ((converted / total) * 100).toFixed(1) : 0;

    // Leads by source
    const bySource = await Lead.aggregate([
      { $group: { _id: "$source", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Leads created in last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentLeads = await Lead.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    // Monthly trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyTrend = await Lead.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.json({
      success: true,
      analytics: {
        total,
        newLeads,
        contacted,
        qualified,
        converted,
        lost,
        conversionRate: parseFloat(conversionRate),
        recentLeads,
        bySource,
        monthlyTrend,
      },
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// -----------------------------------------------
// POST /api/leads — Create a new lead
// -----------------------------------------------
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, company, source, status, priority, message, assignedTo, followUpDate } = req.body;

    // Basic validation
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required",
      });
    }

    const lead = await Lead.create({
      name, email, phone, company, source,
      status, priority, message, assignedTo, followUpDate,
    });

    res.status(201).json({
      success: true,
      message: "Lead created successfully",
      lead,
    });
  } catch (error) {
    console.error("Create lead error:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// -----------------------------------------------
// GET /api/leads/:id — Get a single lead
// -----------------------------------------------
router.get("/:id", async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }

    res.json({ success: true, lead });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// -----------------------------------------------
// PUT /api/leads/:id — Update a lead
// -----------------------------------------------
router.put("/:id", async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,           // return the UPDATED document
        runValidators: true, // validate against schema
      }
    );

    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }

    res.json({ success: true, message: "Lead updated", lead });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// -----------------------------------------------
// PATCH /api/leads/:id/status — Update status only
// -----------------------------------------------
// This is a convenience endpoint for quick status changes
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ["new", "contacted", "qualified", "converted", "lost"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }

    res.json({ success: true, message: `Status updated to '${status}'`, lead });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// -----------------------------------------------
// POST /api/leads/:id/notes — Add a note
// -----------------------------------------------
router.post("/:id/notes", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ success: false, message: "Note text is required" });
    }

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }

    // Push new note to the notes array
    lead.notes.push({
      text: text.trim(),
      addedBy: req.admin.name, // comes from the auth middleware
      addedAt: new Date(),
    });

    await lead.save();

    res.status(201).json({
      success: true,
      message: "Note added",
      notes: lead.notes,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// -----------------------------------------------
// DELETE /api/leads/:id/notes/:noteId — Delete a note
// -----------------------------------------------
router.delete("/:id/notes/:noteId", async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }

    // Filter out the note with matching _id
    lead.notes = lead.notes.filter(
      (note) => note._id.toString() !== req.params.noteId
    );

    await lead.save();

    res.json({ success: true, message: "Note deleted", notes: lead.notes });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// -----------------------------------------------
// DELETE /api/leads/:id — Delete a lead
// -----------------------------------------------
router.delete("/:id", async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }

    res.json({ success: true, message: "Lead deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
