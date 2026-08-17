import React, { useState, useEffect } from "react";
import API from "../services/api";

function EditLeadModal({ lead, admins, onClose, onRefresh }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("new");
  const [source, setSource] = useState("");
  const [notes, setNotes] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (lead) {
      setName(lead.name || "");
      setEmail(lead.email || "");
      setPhone(lead.phone || "");
      setStatus(lead.status || "new");
      setSource(lead.source || "");
      setNotes(lead.notes || "");
      setAssignedTo(lead.assignedTo ? (lead.assignedTo._id || lead.assignedTo) : "");
    }
  }, [lead]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name) {
      setError("Name is required");
      return;
    }

    try {
      await API.put(`/leads/${lead._id}`, {
        name,
        email,
        phone,
        status,
        source,
        notes,
        assignedTo: assignedTo === "" ? null : assignedTo,
      });
      onRefresh();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update lead");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Lead Details</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        {error && <div className="modal-error">{error}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +1 555 0199"
            />
          </div>

          <div className="form-group">
            <label>Source</label>
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="e.g. Website, Referral"
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="converted">Converted</option>
            </select>
          </div>

          <div className="form-group">
            <label>Assigned To</label>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
            >
              <option value="">Unassigned</option>
              {admins.map((admin) => (
                <option key={admin._id} value={admin._id}>
                  {admin.name || admin.email}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group full-width">
            <label>Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="3"
            />
          </div>

          <div className="modal-actions full-width">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-btn">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditLeadModal;
