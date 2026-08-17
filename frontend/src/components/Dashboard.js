import "../Dashboard.css";
import React, { useEffect, useState } from "react";
import API from "../services/api";
import LeadTable from "./LeadTable";
import LeadForm from "./LeadForm";
import Analytics from "./Analytics";

function Dashboard() {

  const [leads, setLeads] = useState([]);
  const [admin, setAdmin] = useState(null);

  const fetchLeads = async () => {
    try {
      const res = await API.get("/leads");
      setLeads(res.data);
    } catch (error) {
      console.error("Error fetching leads:", error);
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        localStorage.removeItem("token");
        localStorage.removeItem("admin");
        window.location.href = "/";
      }
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
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    window.location.href = "/";
  };

  return (
    <div className="container">

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

      <Analytics leads={leads} />

      <LeadForm refreshLeads={fetchLeads} />

      <LeadTable leads={leads} refreshLeads={fetchLeads} />

    </div>
  );
}

export default Dashboard;