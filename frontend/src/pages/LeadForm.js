// =============================================
// pages/LeadForm.js — Create & Edit Lead
// =============================================
// This same component is used for both creating AND editing.
// We detect which mode we're in via the URL:
// - /leads/new          → create mode
// - /leads/:id/edit     → edit mode

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { leadsAPI } from "../utils/api";
import toast from "react-hot-toast";

const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "",
  company: "",
  source: "website",
  status: "new",
  priority: "medium",
  message: "",
  assignedTo: "",
  followUpDate: "",
};

const LeadForm = () => {
  const { id } = useParams(); // exists only in edit mode
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEditing);
  const [errors, setErrors] = useState({});

  // If editing, load existing lead data
  useEffect(() => {
    if (isEditing) {
      const fetchLead = async () => {
        try {
          const res = await leadsAPI.getById(id);
          const lead = res.data.lead;
          setForm({
            name: lead.name || "",
            email: lead.email || "",
            phone: lead.phone || "",
            company: lead.company || "",
            source: lead.source || "website",
            status: lead.status || "new",
            priority: lead.priority || "medium",
            message: lead.message || "",
            assignedTo: lead.assignedTo || "",
            followUpDate: lead.followUpDate
              ? new Date(lead.followUpDate).toISOString().split("T")[0]
              : "",
          });
        } catch (error) {
          toast.error("Failed to load lead");
          navigate("/leads");
        } finally {
          setFetchLoading(false);
        }
      };
      fetchLead();
    }
  }, [id, isEditing, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      newErrors.email = "Invalid email format";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      if (isEditing) {
        await leadsAPI.update(id, form);
        toast.success("Lead updated successfully!");
        navigate(`/leads/${id}`);
      } else {
        const res = await leadsAPI.create(form);
        toast.success("Lead created successfully!");
        navigate(`/leads/${res.data.lead._id}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save lead");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="page-loading">
        <div className="loading-spinner-lg"></div>
      </div>
    );
  }

  return (
    <div className="form-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            {isEditing ? "Edit Lead" : "New Lead"}
          </h1>
          <p className="page-subtitle">
            {isEditing
              ? "Update the lead's information"
              : "Add a new lead to your pipeline"}
          </p>
        </div>
        <button
          className="btn-secondary"
          onClick={() => navigate(isEditing ? `/leads/${id}` : "/leads")}
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="lead-form">
        {/* ── Section: Contact Info ── */}
        <div className="form-section">
          <h2 className="form-section-title">Contact Information</h2>
          <div className="form-grid">
            <div className={`form-group ${errors.name ? "form-group--error" : ""}`}>
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Smith"
              />
              {errors.name && <span className="error-msg">{errors.name}</span>}
            </div>

            <div className={`form-group ${errors.email ? "form-group--error" : ""}`}>
              <label>Email Address *</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="john@example.com"
              />
              {errors.email && <span className="error-msg">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
              />
            </div>

            <div className="form-group">
              <label>Company</label>
              <input
                type="text"
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="Acme Corp"
              />
            </div>
          </div>
        </div>

        {/* ── Section: Lead Details ── */}
        <div className="form-section">
          <h2 className="form-section-title">Lead Details</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Lead Source</label>
              <select name="source" value={form.source} onChange={handleChange}>
                <option value="website">🌐 Website</option>
                <option value="referral">👥 Referral</option>
                <option value="social_media">📱 Social Media</option>
                <option value="email_campaign">📧 Email Campaign</option>
                <option value="cold_call">📞 Cold Call</option>
                <option value="other">◎ Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="converted">Converted</option>
                <option value="lost">Lost</option>
              </select>
            </div>

            <div className="form-group">
              <label>Priority</label>
              <select name="priority" value={form.priority} onChange={handleChange}>
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            </div>

            <div className="form-group">
              <label>Assigned To</label>
              <input
                type="text"
                name="assignedTo"
                value={form.assignedTo}
                onChange={handleChange}
                placeholder="Admin name"
              />
            </div>

            <div className="form-group">
              <label>Follow-up Date</label>
              <input
                type="date"
                name="followUpDate"
                value={form.followUpDate}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* ── Section: Message ── */}
        <div className="form-section">
          <h2 className="form-section-title">Message / Description</h2>
          <div className="form-group form-group--full">
            <label>Initial Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Enter the lead's original message or additional context..."
              rows={4}
            />
          </div>
        </div>

        {/* ── Submit ── */}
        <div className="form-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate(isEditing ? `/leads/${id}` : "/leads")}
          >
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading
              ? isEditing ? "Saving..." : "Creating..."
              : isEditing ? "Save Changes" : "Create Lead"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeadForm;
