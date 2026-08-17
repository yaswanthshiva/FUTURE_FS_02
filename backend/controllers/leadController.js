const Lead = require("../models/Lead");

const getLeads = async (_req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    return res.status(200).json(leads);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    return res.status(200).json(lead);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createLead = async (req, res) => {
  try {
    const { name, email, phone, status, source, notes, assignedTo } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Lead name is required" });
    }

    const lead = await Lead.create({
      name,
      email,
      phone,
      status,
      source,
      notes,
      assignedTo,
    });

    return res.status(201).json(lead);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateLead = async (req, res) => {
  try {
    const { status } = req.body;

    // Optional: validate allowed values
    const allowed = ["new", "contacted", "converted"];
    if (status && !allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },   // update only the status field
      { new: true }           // return updated document
    );

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    return res.status(200).json(lead);

  } catch (error) {
    console.error("Update Lead Error:", error);  // 👈 important
    return res.status(500).json({ message: error.message });
  }
};

const deleteLead = async (req, res) => {
  try {

    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.status(200).json({ message: "Lead deleted successfully" });

  } catch (error) {

    console.error("Delete Error:", error);
    res.status(500).json({ message: error.message });

  }
};

module.exports = {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
};
