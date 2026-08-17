import React from "react";
import API from "../services/api";

function LeadTable({ leads, refreshLeads, onEdit, onViewDetails }) {

  const deleteLead = async (id) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      await API.delete(`/leads/${id}`);
      refreshLeads();
    }
  };

  const updateStatus = async (id, status) => {
    await API.put(`/leads/${id}`, { status });
    refreshLeads();
  };

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Source</th>
            <th>Assigned To</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead._id}>
              <td>{lead.name}</td>
              <td>{lead.email}</td>
              <td>{lead.source || <span style={{ color: "var(--text-muted)", fontStyle: "italic" }}>Direct</span>}</td>
              <td>
                {lead.assignedTo ? (
                  <div className="table-assigned-user">
                    <span className="table-avatar-dot"></span>
                    <span>{lead.assignedTo.name || lead.assignedTo.email}</span>
                  </div>
                ) : (
                  <span className="table-unassigned-badge">Unassigned</span>
                )}
              </td>
              <td>
                <select
                  value={lead.status}
                  onChange={(e) =>
                    updateStatus(lead._id, e.target.value)
                  }
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="converted">Converted</option>
                </select>
              </td>
              <td className="table-actions">
                <button className="details-btn" onClick={() => onViewDetails(lead)}>
                  Details
                </button>
                <button className="edit-btn" onClick={() => onEdit(lead)}>
                  Edit
                </button>
                <button className="delete-btn" onClick={() => deleteLead(lead._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LeadTable;