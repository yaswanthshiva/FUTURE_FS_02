import React from "react";

function Analytics({ leads }) {

  const total = leads.length;

  const converted = leads.filter(
    (l) => l.status === "converted"
  ).length;

  const rate =
    total === 0 ? 0 : ((converted / total) * 100).toFixed(1);

  return (

    <div className="analytics">

      <div className="card">
        <h3>Total Leads</h3>
        <h2>{total}</h2>
      </div>

      <div className="card">
        <h3>Converted</h3>
        <h2>{converted}</h2>
      </div>

      <div className="card">
        <h3>Conversion Rate</h3>
        <h2>{rate}%</h2>
      </div>

    </div>

  );
}

export default Analytics;