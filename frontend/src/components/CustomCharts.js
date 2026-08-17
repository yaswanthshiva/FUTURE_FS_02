import React from "react";

function CustomCharts({ leads }) {
  // --- 1. Status Data (Donut Chart) ---
  const statuses = ["new", "contacted", "converted"];
  const statusColors = {
    new: "#60a5fa",       // Blue
    contacted: "#f59e0b", // Orange/Yellow
    converted: "#10b981", // Emerald Green
  };

  const statusCounts = statuses.reduce((acc, status) => {
    acc[status] = leads.filter((l) => l.status === status).length;
    return acc;
  }, {});

  const totalLeads = leads.length;

  // Calculate Donut Segments
  const radius = 40;
  const circumference = 2 * Math.PI * radius; // 251.32
  let accumulatedPercent = 0;

  const donutSegments = statuses.map((status) => {
    const count = statusCounts[status];
    const percent = totalLeads > 0 ? count / totalLeads : 0;
    const strokeLength = percent * circumference;
    const strokeOffset = circumference - (accumulatedPercent * circumference);
    accumulatedPercent += percent;

    return {
      status,
      count,
      percent: (percent * 100).toFixed(0),
      strokeLength,
      strokeOffset,
      color: statusColors[status],
    };
  });

  // --- 2. Source Data (Bar Chart) ---
  const sourcesMap = leads.reduce((acc, lead) => {
    const src = lead.source ? lead.source.trim() : "Direct";
    acc[src] = (acc[src] || 0) + 1;
    return acc;
  }, {});

  // Sort and take top 5 sources
  const sortedSources = Object.entries(sourcesMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const maxSourceCount = sortedSources.length > 0 ? Math.max(...sortedSources.map((s) => s[1])) : 1;

  return (
    <div className="charts-grid">
      {/* Donut Chart Card */}
      <div className="chart-card">
        <h3>Leads by Status</h3>
        {totalLeads === 0 ? (
          <div className="empty-chart">No data available</div>
        ) : (
          <div className="chart-content donut-layout">
            <div className="svg-container">
              <svg width="150" height="150" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke="rgba(255,255,255,0.03)"
                  strokeWidth="10"
                />
                {/* Segments */}
                {donutSegments.map((segment) => {
                  if (segment.count === 0) return null;
                  return (
                    <circle
                      key={segment.status}
                      cx="50"
                      cy="50"
                      r={radius}
                      fill="transparent"
                      stroke={segment.color}
                      strokeWidth="10"
                      strokeDasharray={`${segment.strokeLength} ${circumference - segment.strokeLength}`}
                      strokeDashoffset={segment.strokeOffset}
                      transform="rotate(-90 50 50)" // Start from top
                      strokeLinecap="round"
                      className="donut-segment"
                      style={{
                        transition: "stroke-dashoffset 0.6s ease",
                      }}
                    />
                  );
                })}
                {/* Center text */}
                <text x="50" y="47" textAnchor="middle" className="donut-total">
                  {totalLeads}
                </text>
                <text x="50" y="60" textAnchor="middle" className="donut-label">
                  Leads
                </text>
              </svg>
            </div>
            
            {/* Legend */}
            <div className="chart-legend">
              {donutSegments.map((seg) => (
                <div key={seg.status} className="legend-item">
                  <span className="legend-dot" style={{ backgroundColor: seg.color }}></span>
                  <span className="legend-name">{seg.status.toUpperCase()}</span>
                  <span className="legend-count">{seg.count} ({seg.percent}%)</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bar Chart Card */}
      <div className="chart-card">
        <h3>Top Lead Sources</h3>
        {sortedSources.length === 0 ? (
          <div className="empty-chart">No data available</div>
        ) : (
          <div className="chart-content bar-layout">
            <div className="bar-chart-container">
              {sortedSources.map(([source, count]) => {
                const barHeightPercent = (count / maxSourceCount) * 100;
                return (
                  <div key={source} className="bar-column">
                    <div className="bar-tooltip">{count}</div>
                    <div className="bar-wrapper">
                      <div
                        className="bar-fill"
                        style={{
                          height: `${barHeightPercent}%`,
                          background: "linear-gradient(180deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)",
                        }}
                      ></div>
                    </div>
                    <span className="bar-label">{source}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomCharts;
