import React, { useState } from "react";

export default function BusinessVibeExample() {
  const businessVibes = [
    {
      fullName: "John Doe",
      phone: "+1 555-123-4567",
      email: "john.doe@example.com",
      photoUrl: "/john_doe.png",
      facebook: "https://facebook.com/johndoe",
      linkedin: "https://linkedin.com/in/johndoe",
      website: "https://johndoe.com",
    },
    {
      fullName: "Jane Smith",
      phone: "+1 555-987-6543",
      email: "jane.smith@example.com",
      photoUrl: "/jane_smith.png",
      facebook: "https://facebook.com/janesmith",
      linkedin: "https://linkedin.com/in/janesmith",
      website: "https://janesmith.com",
    },
  ];

  return (
    <div className="container py-5">
      <h2 className="mb-5 text-center">Business Vibes</h2>
      <div className="row g-4">
        {businessVibes.map((profile, index) => (
          <BusinessVibeCard key={index} profile={profile} />
        ))}
      </div>
    </div>
  );
}

function BusinessVibeCard({ profile }) {
  const [activeTab, setActiveTab] = useState("main");

  return (
    <div className="col-md-6">
      <div
        className="p-4 shadow rounded-4 h-100"
        style={{ backgroundColor: "#f8f9fa" }}
      >
        <div className="text-center mb-3">
          <img
            src={profile.photoUrl}
            alt="Profile"
            className="rounded-4"
            style={{ objectFit: "cover", width: "120px", height: "120px" }}
          />
        </div>

        {/* Табы */}
        <div className="d-flex justify-content-center mb-3">
          <button
            className={`btn btn-sm ${
              activeTab === "main" ? "btn-primary" : "btn-outline-primary"
            } me-2`}
            onClick={() => setActiveTab("main")}
          >
            Main Info
          </button>
          <button
            className={`btn btn-sm ${
              activeTab === "actions" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setActiveTab("actions")}
          >
            Actions
          </button>
        </div>

        {/* Контент табов */}
        {activeTab === "main" && (
          <div className="text-start">
            <h5>{profile.fullName}</h5>
            <p className="mb-1">
              <strong>Phone:</strong> {profile.phone}
            </p>
            <p className="mb-1">
              <strong>Email:</strong> {profile.email}
            </p>
            <div className="d-flex flex-column gap-2 mt-2">
              {profile.facebook && (
                <a
                  href={profile.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Facebook
                </a>
              )}
              {profile.linkedin && (
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              )}
              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Website
                </a>
              )}
            </div>
          </div>
        )}
        {activeTab === "actions" && (
          <div className="text-start">
            <p>📷 Show QR Code</p>
            <p>✉️ Send Link</p>
            <p>📍 Share My Location</p>
          </div>
        )}
      </div>
    </div>
  );
}
