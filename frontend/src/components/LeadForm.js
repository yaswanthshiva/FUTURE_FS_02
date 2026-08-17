import React, { useState } from "react";
import API from "../services/api";

function LeadForm({ refreshLeads, admins = [] }) {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [source, setSource] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const submitLead = async (e) => {
    e.preventDefault();

    // Generate name from email if name is empty
    const generatedName = name || email.split("@")[0];

    await API.post("/leads", {
      name: generatedName,
      email,
      source,
      assignedTo: assignedTo === "" ? null : assignedTo
    });

    setName("");
    setEmail("");
    setSource("");
    setAssignedTo("");

    refreshLeads();
  };

  return (
    <form onSubmit={submitLead}>
      <h3>Add Lead</h3>
      <input
        placeholder="Name (Optional)"
        value={name}
        onChange={(e)=>setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        required
        onChange={(e)=>setEmail(e.target.value)}
      />
      <input
        placeholder="Source"
        value={source}
        onChange={(e)=>setSource(e.target.value)}
      />
      <select
        value={assignedTo}
        onChange={(e) => setAssignedTo(e.target.value)}
        className="form-select"
      >
        <option value="">Assign Representative...</option>
        {admins.map((admin) => (
          <option key={admin._id} value={admin._id}>
            {admin.name || admin.email}
          </option>
        ))}
      </select>
      <button type="submit">Add Lead</button>
    </form>
  );
}

export default LeadForm;