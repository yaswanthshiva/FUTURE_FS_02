// =============================================
// pages/Leads.js — Lead Management Table
// =============================================

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { leadsAPI } from "../utils/api";
import toast from "react-hot-toast";

const STATUS_CONFIG = {
  new:       { label: "New",       color: "#3b82f6", bg: "#eff6ff" },
  contacted: { label: "Contacted", color: "#f59e0b", bg: "#fffbeb" },
  qualified: { label: "Qualified", color: "#8b5cf6", bg: "#f5f3ff" },
  converted: { label: "Converted", color: "#10b981", bg: "#ecfdf5" },
  lost:      { label: "Lost",      color: "#ef4444", bg: "#fef2f2" },
};

const SOURCE_LABELS = {
  website: "Website",
  referral: "Referral",
  social_media: "Social Media",
  email_campaign: "Email",
  cold_call: "Cold Call",
  other: "Other",
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.new;
  return (
    <span
      className="status-badge"
      style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.color}30` }}
    >
      {cfg.label}
    </span>
  );
};

const Leads = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Filter state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "");
  const [sourceFilter, setSourceFilter] = useState("");

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 10,
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter }),
        ...(sourceFilter && { source: sourceFilter }),
      };

      const res = await leadsAPI.getAll(params);
      setLeads(res.data.leads);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      toast.error("Failed to load leads");
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, statusFilter, sourceFilter]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Debounced search
  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleStatusChange = async (leadId, newStatus) => {
    try {
      await leadsAPI.updateStatus(leadId, newStatus);
      toast.success(`Status updated to ${newStatus}`);
      fetchLeads();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    try {
      await leadsAPI.delete(id);
      toast.success("Lead deleted");
      setDeleteConfirm(null);
      fetchLeads();
    } catch (error) {
      toast.error("Failed to delete lead");
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="leads-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">All Leads</h1>
          <p className="page-subtitle">
            {total} lead{total !== 1 ? "s" : ""} total
          </p>
        </div>
        <button className="btn-primary" onClick={() => navigate("/leads/new")}>
          + New Lead
        </button>
      </div>

      {/* ── Filters Bar ── */}
      <div className="filters-bar">
        <div className="search-wrapper">
          <span className="search-icon">⌕</span>
          <input
            type="text"
            placeholder="Search by name, email, or company..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="search-input"
          />
          {search && (
            <button className="search-clear" onClick={() => handleSearch("")}>
              ✕
            </button>
          )}
        </div>

        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
          className="filter-select"
        >
          <option value="">All Statuses</option>
          {Object.entries(STATUS_CONFIG).map(([key, val]) => (
            <option key={key} value={key}>{val.label}</option>
          ))}
        </select>

        <select
          value={sourceFilter}
          onChange={(e) => { setSourceFilter(e.target.value); setCurrentPage(1); }}
          className="filter-select"
        >
          <option value="">All Sources</option>
          {Object.entries(SOURCE_LABELS).map(([key, val]) => (
            <option key={key} value={key}>{val}</option>
          ))}
        </select>

        {(search || statusFilter || sourceFilter) && (
          <button
            className="btn-clear-filters"
            onClick={() => { setSearch(""); setStatusFilter(""); setSourceFilter(""); setCurrentPage(1); }}
          >
            Clear filters
          </button>
        )}
      </div>

      {/* ── Leads Table ── */}
      <div className="table-container">
        {loading ? (
          <div className="table-loading">
            <div className="loading-spinner-lg"></div>
            <p>Loading leads...</p>
          </div>
        ) : leads.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">◎</div>
            <h3>No leads found</h3>
            <p>
              {search || statusFilter || sourceFilter
                ? "Try adjusting your filters"
                : "Add your first lead to get started"}
            </p>
            {!search && !statusFilter && !sourceFilter && (
              <button className="btn-primary" onClick={() => navigate("/leads/new")}>
                + Add First Lead
              </button>
            )}
          </div>
        ) : (
          <>
            <table className="leads-table">
              <thead>
                <tr>
                  <th>Lead</th>
                  <th>Source</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Notes</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead._id} className="lead-row">
                    <td>
                      <div className="lead-info">
                        <div className="lead-avatar">
                          {lead.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="lead-name">{lead.name}</div>
                          <div className="lead-email">{lead.email}</div>
                          {lead.company && (
                            <div className="lead-company">🏢 {lead.company}</div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="source-tag">
                        {SOURCE_LABELS[lead.source] || lead.source}
                      </span>
                    </td>

                    <td>
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                        className="status-select"
                        style={{ color: STATUS_CONFIG[lead.status]?.color }}
                      >
                        {Object.entries(STATUS_CONFIG).map(([key, val]) => (
                          <option key={key} value={key}>{val.label}</option>
                        ))}
                      </select>
                    </td>

                    <td>
                      <span className={`priority-badge priority-${lead.priority}`}>
                        {lead.priority}
                      </span>
                    </td>

                    <td>
                      <span className="notes-count">
                        {lead.notes?.length > 0
                          ? `${lead.notes.length} note${lead.notes.length > 1 ? "s" : ""}`
                          : "—"}
                      </span>
                    </td>

                    <td>
                      <span className="date-text">{formatDate(lead.createdAt)}</span>
                    </td>

                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-action btn-view"
                          onClick={() => navigate(`/leads/${lead._id}`)}
                          title="View details"
                        >
                          View
                        </button>
                        <button
                          className="btn-action btn-edit"
                          onClick={() => navigate(`/leads/${lead._id}/edit`)}
                          title="Edit lead"
                        >
                          Edit
                        </button>
                        <button
                          className="btn-action btn-delete"
                          onClick={() => setDeleteConfirm(lead._id)}
                          title="Delete lead"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="page-btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  ← Prev
                </button>
                <span className="page-info">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="page-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Delete Confirmation Modal ── */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">⚠</div>
            <h3>Delete Lead?</h3>
            <p>This action cannot be undone. The lead and all its notes will be permanently deleted.</p>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </button>
              <button className="btn-danger" onClick={() => handleDelete(deleteConfirm)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;
