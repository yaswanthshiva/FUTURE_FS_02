const Lead = require("../models/Lead");

const getLeads = async (_req, res) => {
  try {
    const leads = await Lead.find().populate("assignedTo", "name email").sort({ createdAt: -1 });
    return res.status(200).json(leads);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id).populate("assignedTo", "name email");

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
    const { name, email, phone, status, source, notes, assignedTo } = req.body;

    // Optional: validate allowed values
    const allowed = ["new", "contacted", "converted"];
    if (status && !allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (email !== undefined) updateFields.email = email;
    if (phone !== undefined) updateFields.phone = phone;
    if (status !== undefined) updateFields.status = status;
    if (source !== undefined) updateFields.source = source;
    if (notes !== undefined) updateFields.notes = notes;
    if (assignedTo !== undefined) {
      updateFields.assignedTo = assignedTo === "" || assignedTo === "null" || assignedTo === null ? null : assignedTo;
    }

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }           // return updated document
    ).populate("assignedTo", "name email");

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    return res.status(200).json(lead);

  } catch (error) {
    console.error("Update Lead Error:", error);
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

const addActivity = async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ message: "Activity text is required" });
    }

    const Admin = require("../models/Admin");
    const admin = await Admin.findById(req.user.id);
    const adminName = admin ? (admin.name || admin.email) : req.user.email;

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          activities: {
            text,
            date: new Date(),
            adminName,
          },
        },
      },
      { new: true }
    ).populate("assignedTo", "name email");

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    return res.status(200).json(lead);
  } catch (error) {
    console.error("Add Activity Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  addActivity,
};
