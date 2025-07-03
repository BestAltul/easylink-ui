import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BusinessVibeForm from "./BusinessVibeForm";
import PersonalVibeForm from "./PersonalVibeForm";
import EventVibeForm from "./EventVibeForm";

export default function CreateVibe() {
  const [type, setType] = useState("business");
  const navigate = useNavigate();

  return (
    <div className="container py-5">
      <div style={{ maxWidth: 1020, margin: "0 auto", position: "relative" }}>
        {/* Back Button */}
        <div style={{ marginBottom: 18 }}>
          <button
            className="btn btn-outline-secondary d-inline-flex align-items-center"
            style={{
              borderRadius: 12,
              fontWeight: 500,
              boxShadow: "0 2px 8px rgba(70,110,255,0.06)",
              gap: 6,
              paddingLeft: 15,
              paddingRight: 18,
            }}
            onClick={() => navigate("/profile")}
          >
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 20 20"
              style={{ marginRight: 6, marginLeft: -3 }}
            >
              <path d="M13 5l-5 5 5 5" />
            </svg>
            Back to Profile
          </button>
        </div>

        <h2 className="mb-4 text-center" style={{ fontWeight: 600 }}>
          Create Your Digital Card
        </h2>

        <div className="mb-4" style={{ maxWidth: 420, margin: "0 auto" }}>
          <label className="form-label">Card Type</label>
          <select
            className="form-select"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="business">Business</option>
            <option value="personal">Personal</option>
            <option value="event">Event</option>
          </select>
        </div>

        {/* Каждая форма сама заботится о своем layout */}
        {type === "business" && <BusinessVibeForm />}
        {type === "personal" && <PersonalVibeForm />}
        {type === "event" && <EventVibeForm />}
      </div>
    </div>
  );
}
