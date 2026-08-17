import React, { useState } from "react";
import API from "../services/api";

function LeadDetailsDrawer({ lead, onClose, onRefresh }) {
  const [newActivity, setNewActivity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!lead) return null;

  const handleAddActivity = async (e) => {
    e.preventDefault();
    if (!newActivity.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await API.post(`/leads/${lead._id}/activity`, {
        text: newActivity,
      });
      setNewActivity("");
      // Update the lead object in the parent component
      onRefresh(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to add activity note");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <h2>Lead Details & Timeline</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="drawer-body">
          {/* Section 1: Core Details */}
          <div className="details-section">
            <h3>Contact Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Name</span>
                <span className="info-val">{lead.name}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Email</span>
                <span className="info-val">{lead.email || <span className="none-label">None</span>}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Phone</span>
                <span className="info-val">{lead.phone || <span className="none-label">None</span>}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Source</span>
                <span className="info-val">{lead.source || <span className="none-label">Direct</span>}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Status</span>
                <span className={`status-badge ${lead.status}`}>{lead.status.toUpperCase()}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Assigned Representative</span>
                <span className="info-val">
                  {lead.assignedTo ? (lead.assignedTo.name || lead.assignedTo.email) : <span className="none-label">Unassigned</span>}
                </span>
              </div>
            </div>
            
            {lead.notes && (
              <div className="details-notes">
                <span className="info-label">Lead Notes</span>
                <p>{lead.notes}</p>
              </div>
            )}
          </div>

          <hr className="divider" />

          {/* Section 2: Timeline */}
          <div className="timeline-section">
            <h3>Activity History</h3>
            
            {/* Add Activity Form */}
            <form onSubmit={handleAddActivity} className="activity-form">
              {error && <div className="activity-error">{error}</div>}
              <input
                type="text"
                placeholder="Log a client interaction note..."
                value={newActivity}
                onChange={(e) => setNewActivity(e.target.value)}
                disabled={loading}
                required
              />
              <button type="submit" disabled={loading || !newActivity.trim()}>
                {loading ? "Logging..." : "Log Note"}
              </button>
            </form>

            {/* List Activities */}
            <div className="timeline-list">
              {(!lead.activities || lead.activities.length === 0) ? (
                <div className="empty-timeline">No activities logged yet.</div>
              ) : (
                lead.activities.map((activity, idx) => (
                  <div key={activity._id || idx} className="timeline-card">
                    <div className="timeline-marker"></div>
                    <div className="timeline-card-header">
                      <span className="timeline-user">{activity.adminName}</span>
                      <span className="timeline-date">{formatDate(activity.date)}</span>
                    </div>
                    <p className="timeline-text">{activity.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeadDetailsDrawer;
