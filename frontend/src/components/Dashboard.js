import "../Dashboard.css";
import React, { useEffect, useState } from "react";
import API from "../services/api";
import LeadTable from "./LeadTable";
import LeadForm from "./LeadForm";
import Analytics from "./Analytics";
import CustomCharts from "./CustomCharts";
import EditLeadModal from "./EditLeadModal";
import LeadDetailsDrawer from "./LeadDrawer";

function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [admin, setAdmin] = useState(null);

  // Filter/Sort State
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [assignmentFilter, setAssignmentFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  // Drawer/Modal State
  const [editingLead, setEditingLead] = useState(null);
  const [viewingLead, setViewingLead] = useState(null);

  const fetchLeads = async () => {
    try {
      const res = await API.get("/leads");
      setLeads(res.data);
      
      // Keep selected lead state in sync if drawer is open
      if (viewingLead) {
        const updatedViewing = res.data.find(l => l._id === viewingLead._id);
        if (updatedViewing) setViewingLead(updatedViewing);
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        handleLogout();
      }
    }
  };

  const fetchAdmins = async () => {
    try {
      const res = await API.get("/auth/admins");
      setAdmins(res.data);
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/";
      return;
    }

    const storedAdmin = localStorage.getItem("admin");
    if (storedAdmin) {
      try {
        setAdmin(JSON.parse(storedAdmin));
      } catch (e) {
        console.error(e);
      }
    }

    fetchLeads();
    fetchAdmins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    window.location.href = "/";
  };

  // Get unique list of sources for filter dropdown
  const uniqueSources = Array.from(
    new Set(leads.map((l) => (l.source ? l.source.trim() : "Direct")))
  ).filter(Boolean);

  // Filter & Sort leads
  const filteredLeads = leads
    .filter((lead) => {
      // 1. Search Query
      const query = search.toLowerCase();
      const nameMatch = lead.name?.toLowerCase().includes(query);
      const emailMatch = lead.email?.toLowerCase().includes(query);
      const sourceMatch = lead.source?.toLowerCase().includes(query);
      const searchMatch = nameMatch || emailMatch || sourceMatch;

      // 2. Status Filter
      const statusMatch = statusFilter === "all" || lead.status === statusFilter;

      // 3. Source Filter
      const leadSrc = lead.source ? lead.source.trim() : "Direct";
      const sourceMatchFilter = sourceFilter === "all" || leadSrc === sourceFilter;

      // 4. Assignment Filter
      const assignedId = lead.assignedTo?._id || lead.assignedTo;
      const adminId = admin?.id || admin?._id;
      const assignmentMatch =
        assignmentFilter === "all" || (assignmentFilter === "me" && assignedId === adminId);

      return searchMatch && statusMatch && sourceMatchFilter && assignmentMatch;
    })
    .sort((a, b) => {
      let valA, valB;
      if (sortBy === "name") {
        valA = a.name?.toLowerCase() || "";
        valB = b.name?.toLowerCase() || "";
      } else {
        valA = new Date(a.createdAt || 0);
        valB = new Date(b.createdAt || 0);
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <div className="header-info">
          <h1>Mini CRM Dashboard</h1>
          <p>Lead Management System</p>
        </div>
        <div className="user-profile">
          {admin && (
            <div className="user-details">
              <span className="user-avatar">{admin.name ? admin.name[0].toUpperCase() : "A"}</span>
              <span className="user-name">{admin.name || admin.email}</span>
            </div>
          )}
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Analytics Summary */}
      <Analytics leads={leads} />

      {/* Custom Premium SVG Charts */}
      <CustomCharts leads={leads} />

      {/* Filter and Search Bar */}
      <div className="control-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search leads by name, email, or source..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filters-group">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="converted">Converted</option>
          </select>

          <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)}>
            <option value="all">All Sources</option>
            <option value="Direct">Direct</option>
            {uniqueSources.map(
              (src) => src !== "Direct" && <option key={src} value={src}>{src}</option>
            )}
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="createdAt">Sort by Date</option>
            <option value="name">Sort by Name</option>
          </select>

          <button
            className="sort-order-btn"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            title="Toggle Sort Order"
          >
            {sortOrder === "asc" ? "▲ Asc" : "▼ Desc"}
          </button>

          {admin && (
            <button
              className={`toggle-filter-btn ${assignmentFilter === "me" ? "active" : ""}`}
              onClick={() => setAssignmentFilter(assignmentFilter === "all" ? "me" : "all")}
            >
              {assignmentFilter === "me" ? "Show All Leads" : "Assigned to Me"}
            </button>
          )}
        </div>
      </div>

      {/* Add Lead Form */}
      <LeadForm refreshLeads={fetchLeads} admins={admins} />

      {/* Leads Table */}
      <LeadTable
        leads={filteredLeads}
        refreshLeads={fetchLeads}
        onEdit={(lead) => setEditingLead(lead)}
        onViewDetails={(lead) => setViewingLead(lead)}
      />

      {/* Modals & Drawers */}
      {editingLead && (
        <EditLeadModal
          lead={editingLead}
          admins={admins}
          onClose={() => setEditingLead(null)}
          onRefresh={fetchLeads}
        />
      )}

      {viewingLead && (
        <LeadDetailsDrawer
          lead={viewingLead}
          onClose={() => setViewingLead(null)}
          onRefresh={(updatedLead) => {
            setLeads(leads.map((l) => (l._id === updatedLead._id ? updatedLead : l)));
            setViewingLead(updatedLead);
          }}
        />
      )}
    </div>
  );
}

export default Dashboard;