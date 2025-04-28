import React, { useState } from "react";

export default function ConferenceVibeExample() {
  const conferences = [
    {
      title: "Tech Innovators Conference",
      agenda: [
        "09:00 AM - Opening Remarks",
        "09:30 AM - Keynote: Future of AI",
        "11:00 AM - Coffee Break",
        "11:30 AM - Panel Discussion",
      ],
      speakers: ["Alice Johnson", "Bob Lee", "Catherine Wong"],
      resources: [
        { label: "Official Website", link: "https://techinnovators.com" },
        { label: "Slack Group", link: "https://slack.com/techgroup" },
      ],
    },
    {
      title: "Design Thinking Workshop",
      agenda: [
        "10:00 AM - Introduction to Design Thinking",
        "11:30 AM - Breakout Sessions",
        "01:00 PM - Lunch Break",
      ],
      speakers: ["David Brown", "Eva Green"],
      resources: [
        { label: "Workshop Site", link: "https://designworkshop.com" },
      ],
    },
  ];

  return (
    <div className="container py-5">
      <h2 className="mb-5 text-center">Conference Vibes</h2>
      <div className="row g-4">
        {conferences.map((conf, index) => (
          <ConferenceVibeCard key={index} conference={conf} />
        ))}
      </div>
    </div>
  );
}

function ConferenceVibeCard({ conference }) {
  const [activeTab, setActiveTab] = useState("agenda");

  return (
    <div className="col-md-6">
      <div
        className="p-4 shadow rounded-4 h-100"
        style={{ backgroundColor: "#f8f9fa" }}
      >
        <h5 className="text-center mb-3">{conference.title}</h5>

        {/* Табы */}
        <div className="d-flex justify-content-center mb-3">
          <button
            className={`btn btn-sm ${
              activeTab === "agenda" ? "btn-primary" : "btn-outline-primary"
            } me-2`}
            onClick={() => setActiveTab("agenda")}
          >
            Agenda
          </button>
          <button
            className={`btn btn-sm ${
              activeTab === "resources" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setActiveTab("resources")}
          >
            Resources
          </button>
        </div>

        {/* Контент табов */}
        {activeTab === "agenda" && (
          <div className="text-start">
            <strong>Speakers:</strong>
            <ul>
              {conference.speakers.map((speaker, idx) => (
                <li key={idx}>{speaker}</li>
              ))}
            </ul>
            <strong>Schedule:</strong>
            <ul>
              {conference.agenda.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}
        {activeTab === "resources" && (
          <div className="text-start">
            <strong>Resources:</strong>
            <ul>
              {conference.resources.map((res, idx) => (
                <li key={idx}>
                  <a href={res.link} target="_blank" rel="noopener noreferrer">
                    {res.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
