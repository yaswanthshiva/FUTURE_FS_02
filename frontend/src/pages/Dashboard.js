// =============================================
// pages/Dashboard.js — Analytics Dashboard
// =============================================

import React, { useState, useEffect } from "react";
import { leadsAPI } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const STATUS_COLORS = {
  new: "#3b82f6",
  contacted: "#f59e0b",
  qualified: "#8b5cf6",
  converted: "#10b981",
  lost: "#ef4444",
};

const SOURCE_LABELS = {
  website: "Website",
  referral: "Referral",
  social_media: "Social Media",
  email_campaign: "Email Campaign",
  cold_call: "Cold Call",
  other: "Other",
};

const StatCard = ({ title, value, subtitle, color, icon }) => (
  <div className="stat-card" style={{ "--accent": color }}>
    <div className="stat-icon">{icon}</div>
    <div className="stat-content">
      <div className="stat-value">{value}</div>
      <div className="stat-title">{title}</div>
      {subtitle && <div className="stat-subtitle">{subtitle}</div>}
    </div>
    <div className="stat-bar" style={{ background: color }}></div>
  </div>
);

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await leadsAPI.getAnalytics();
      setAnalytics(res.data.analytics);
    } catch (error) {
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-loading">
        <div className="loading-spinner-lg"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  const a = analytics || {};

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Welcome back, <strong>{admin?.name}</strong> — here's your pipeline overview
          </p>
        </div>
        <button className="btn-primary" onClick={() => navigate("/leads/new")}>
          + Add Lead
        </button>
      </div>

      {/* ── Key Metrics Row ── */}
      <div className="stats-grid">
        <StatCard
          title="Total Leads"
          value={a.total || 0}
          subtitle="All time"
          color="#3b82f6"
          icon="◎"
        />
        <StatCard
          title="New Leads"
          value={a.newLeads || 0}
          subtitle="Need attention"
          color="#f59e0b"
          icon="✦"
        />
        <StatCard
          title="Converted"
          value={a.converted || 0}
          subtitle="Closed deals"
          color="#10b981"
          icon="✓"
        />
        <StatCard
          title="Conversion Rate"
          value={`${a.conversionRate || 0}%`}
          subtitle="Success ratio"
          color="#8b5cf6"
          icon="◈"
        />
        <StatCard
          title="This Week"
          value={a.recentLeads || 0}
          subtitle="New in 7 days"
          color="#ec4899"
          icon="◉"
        />
        <StatCard
          title="Lost Leads"
          value={a.lost || 0}
          subtitle="Didn't convert"
          color="#ef4444"
          icon="✕"
        />
      </div>

      {/* ── Pipeline & Sources Row ── */}
      <div className="dashboard-row">
        {/* Pipeline Status */}
        <div className="dashboard-card pipeline-card">
          <h2 className="card-title">Pipeline Status</h2>
          <div className="pipeline-bars">
            {[
              { label: "New", value: a.newLeads || 0, key: "new" },
              { label: "Contacted", value: a.contacted || 0, key: "contacted" },
              { label: "Qualified", value: a.qualified || 0, key: "qualified" },
              { label: "Converted", value: a.converted || 0, key: "converted" },
              { label: "Lost", value: a.lost || 0, key: "lost" },
            ].map((item) => (
              <div className="pipeline-row" key={item.key}>
                <span className="pipeline-label">{item.label}</span>
                <div className="pipeline-track">
                  <div
                    className="pipeline-fill"
                    style={{
                      width: a.total
                        ? `${(item.value / a.total) * 100}%`
                        : "0%",
                      background: STATUS_COLORS[item.key],
                    }}
                  ></div>
                </div>
                <span className="pipeline-count">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Leads by Source */}
        <div className="dashboard-card source-card">
          <h2 className="card-title">Lead Sources</h2>
          {a.bySource && a.bySource.length > 0 ? (
            <div className="source-list">
              {a.bySource.map((s, i) => (
                <div className="source-item" key={i}>
                  <div className="source-dot" style={{
                    background: ["#3b82f6","#10b981","#f59e0b","#8b5cf6","#ec4899","#ef4444"][i % 6]
                  }}></div>
                  <span className="source-name">
                    {SOURCE_LABELS[s._id] || s._id}
                  </span>
                  <span className="source-count">{s.count}</span>
                  <div className="source-bar-track">
                    <div
                      className="source-bar-fill"
                      style={{
                        width: a.total ? `${(s.count / a.total) * 100}%` : "0%",
                        background: ["#3b82f6","#10b981","#f59e0b","#8b5cf6","#ec4899","#ef4444"][i % 6],
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-state-sm">No source data yet</p>
          )}
        </div>
      </div>

      {/* ── Monthly Trend ── */}
      {a.monthlyTrend && a.monthlyTrend.length > 0 && (
        <div className="dashboard-card trend-card">
          <h2 className="card-title">Monthly Trend</h2>
          <div className="trend-chart">
            {(() => {
              const max = Math.max(...a.monthlyTrend.map((m) => m.count));
              const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                              "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
              return a.monthlyTrend.map((m, i) => (
                <div className="trend-bar-wrap" key={i}>
                  <span className="trend-count">{m.count}</span>
                  <div className="trend-bar-track">
                    <div
                      className="trend-bar-fill"
                      style={{ height: `${(m.count / max) * 100}%` }}
                    ></div>
                  </div>
                  <span className="trend-month">
                    {months[m._id.month]}
                  </span>
                </div>
              ));
            })()}
          </div>
        </div>
      )}

      {/* ── Quick Actions ── */}
      <div className="quick-actions">
        <button className="quick-btn" onClick={() => navigate("/leads")}>
          <span>◎</span> View All Leads
        </button>
        <button className="quick-btn" onClick={() => navigate("/leads?status=new")}>
          <span>✦</span> New Leads
        </button>
        <button className="quick-btn" onClick={() => navigate("/leads?status=contacted")}>
          <span>↗</span> Follow Up
        </button>
        <button className="quick-btn" onClick={() => navigate("/leads/new")}>
          <span>+</span> Add Lead
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
