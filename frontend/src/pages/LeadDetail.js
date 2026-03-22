// =============================================
// pages/LeadDetail.js — Single Lead View
// =============================================

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { leadsAPI } from "../utils/api";
import toast from "react-hot-toast";

const STATUS_CONFIG = {
  new:       { label: "New",       color: "#3b82f6" },
  contacted: { label: "Contacted", color: "#f59e0b" },
  qualified: { label: "Qualified", color: "#8b5cf6" },
  converted: { label: "Converted", color: "#10b981" },
  lost:      { label: "Lost",      color: "#ef4444" },
};

const SOURCE_LABELS = {
  website: "🌐 Website",
  referral: "👥 Referral",
  social_media: "📱 Social Media",
  email_campaign: "📧 Email Campaign",
  cold_call: "📞 Cold Call",
  other: "◎ Other",
};

const LeadDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [noteText, setNoteText] = useState("");
  const [addingNote, setAddingNote] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchLead();
  }, [id]);

  const fetchLead = async () => {
    try {
      const res = await leadsAPI.getById(id);
      setLead(res.data.lead);
    } catch (error) {
      toast.error("Lead not found");
      navigate("/leads");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setUpdatingStatus(true);
    try {
      const res = await leadsAPI.updateStatus(id, newStatus);
      setLead(res.data.lead);
      toast.success(`Status → ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    setAddingNote(true);
    try {
      const res = await leadsAPI.addNote(id, noteText);
      setLead((prev) => ({ ...prev, notes: res.data.notes }));
      setNoteText("");
      toast.success("Note added!");
    } catch (error) {
      toast.error("Failed to add note");
    } finally {
      setAddingNote(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      const res = await leadsAPI.deleteNote(id, noteId);
      setLead((prev) => ({ ...prev, notes: res.data.notes }));
      toast.success("Note deleted");
    } catch (error) {
      toast.error("Failed to delete note");
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (loading) {
    return (
      <div className="page-loading">
        <div className="loading-spinner-lg"></div>
      </div>
    );
  }

  if (!lead) return null;

  const statusCfg = STATUS_CONFIG[lead.status] || STATUS_CONFIG.new;

  // The pipeline steps for the status tracker
  const steps = ["new", "contacted", "qualified", "converted"];
  const currentStep = steps.indexOf(lead.status);

  return (
    <div className="lead-detail-page">
      {/* ── Header ── */}
      <div className="detail-header">
        <button className="btn-back" onClick={() => navigate("/leads")}>
          ← Back to Leads
        </button>
        <div className="detail-header-actions">
          <button
            className="btn-secondary"
            onClick={() => navigate(`/leads/${id}/edit`)}
          >
            Edit Lead
          </button>
        </div>
      </div>

      <div className="detail-grid">
        {/* ── Left Column: Lead Info ── */}
        <div className="detail-main">
          {/* Lead Profile Card */}
          <div className="detail-card lead-profile-card">
            <div className="profile-top">
              <div className="profile-avatar-lg">
                {lead.name.charAt(0).toUpperCase()}
              </div>
              <div className="profile-info">
                <h1 className="profile-name">{lead.name}</h1>
                <a href={`mailto:${lead.email}`} className="profile-email">
                  ✉ {lead.email}
                </a>
                {lead.phone && (
                  <p className="profile-phone">📞 {lead.phone}</p>
                )}
                {lead.company && (
                  <p className="profile-company">🏢 {lead.company}</p>
                )}
              </div>
            </div>

            {/* Status Pipeline Visual */}
            <div className="status-pipeline">
              <h3>Sales Pipeline</h3>
              <div className="pipeline-steps">
                {steps.map((step, i) => (
                  <React.Fragment key={step}>
                    <button
                      className={`pipeline-step ${
                        i <= currentStep ? "pipeline-step--active" : ""
                      } ${lead.status === step ? "pipeline-step--current" : ""}`}
                      onClick={() => handleStatusChange(step)}
                      disabled={updatingStatus}
                      style={{
                        "--step-color": STATUS_CONFIG[step].color,
                      }}
                    >
                      <span className="step-dot"></span>
                      <span className="step-label">
                        {STATUS_CONFIG[step].label}
                      </span>
                    </button>
                    {i < steps.length - 1 && (
                      <div
                        className={`pipeline-connector ${
                          i < currentStep ? "pipeline-connector--active" : ""
                        }`}
                      ></div>
                    )}
                  </React.Fragment>
                ))}
              </div>
              {lead.status === "lost" && (
                <button
                  className="btn-lost"
                  onClick={() => handleStatusChange("lost")}
                >
                  Mark as Lost
                </button>
              )}
            </div>

            {/* Meta info */}
            <div className="lead-meta-grid">
              <div className="meta-item">
                <span className="meta-label">Source</span>
                <span className="meta-value">
                  {SOURCE_LABELS[lead.source] || lead.source}
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Priority</span>
                <span className={`priority-badge priority-${lead.priority}`}>
                  {lead.priority}
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Assigned To</span>
                <span className="meta-value">{lead.assignedTo || "Unassigned"}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Created</span>
                <span className="meta-value">{formatDate(lead.createdAt)}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Last Updated</span>
                <span className="meta-value">{formatDate(lead.updatedAt)}</span>
              </div>
              {lead.followUpDate && (
                <div className="meta-item">
                  <span className="meta-label">Follow Up</span>
                  <span className="meta-value">
                    📅 {new Date(lead.followUpDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            {/* Original message */}
            {lead.message && (
              <div className="lead-message">
                <h3>Original Message</h3>
                <blockquote>{lead.message}</blockquote>
              </div>
            )}
          </div>
        </div>

        {/* ── Right Column: Notes ── */}
        <div className="detail-sidebar">
          <div className="detail-card notes-card">
            <h2 className="card-title">
              Follow-up Notes
              <span className="notes-badge">{lead.notes?.length || 0}</span>
            </h2>

            {/* Add Note Form */}
            <form onSubmit={handleAddNote} className="add-note-form">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add a follow-up note..."
                rows={3}
                className="note-textarea"
              />
              <button
                type="submit"
                className="btn-primary btn-sm"
                disabled={addingNote || !noteText.trim()}
              >
                {addingNote ? "Adding..." : "+ Add Note"}
              </button>
            </form>

            {/* Notes List */}
            <div className="notes-list">
              {lead.notes && lead.notes.length > 0 ? (
                [...lead.notes].reverse().map((note) => (
                  <div key={note._id} className="note-item">
                    <div className="note-header">
                      <div className="note-author">
                        <div className="note-avatar">
                          {note.addedBy?.charAt(0) || "A"}
                        </div>
                        <span>{note.addedBy}</span>
                      </div>
                      <div className="note-actions">
                        <span className="note-date">
                          {formatDate(note.addedAt)}
                        </span>
                        <button
                          className="note-delete"
                          onClick={() => handleDeleteNote(note._id)}
                          title="Delete note"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                    <p className="note-text">{note.text}</p>
                  </div>
                ))
              ) : (
                <div className="empty-notes">
                  <p>No notes yet.</p>
                  <p>Add your first follow-up note above.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetail;
