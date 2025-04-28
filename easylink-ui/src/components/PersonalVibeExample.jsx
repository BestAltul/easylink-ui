import React, { useState } from "react";

export default function PersonalVibeExample() {
  const personalVibes = [
    {
      fullName: "Alex Johnson",
      hobby: "Photography",
      favoriteColor: "Blue",
      bio: "Loves traveling and capturing memories through the lens.",
      photoUrl: "/your-photo3.png",
      instagram: "https://instagram.com/alexjohnson",
      twitter: "https://twitter.com/alexjohnson",
    },
    {
      fullName: "Emily Davis",
      hobby: "Reading",
      favoriteColor: "Green",
      bio: "A bookworm and coffee enthusiast.",
      photoUrl: "/your-photo4.png",
      instagram: "https://instagram.com/emilydavis",
      twitter: "https://twitter.com/emilydavis",
    },
  ];

  return (
    <div className="container py-5">
      <h2 className="mb-5 text-center">Personal Vibes</h2>
      <div className="row g-4">
        {personalVibes.map((profile, index) => (
          <PersonalVibeCard key={index} profile={profile} />
        ))}
      </div>
    </div>
  );
}

function PersonalVibeCard({ profile }) {
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
              <strong>Hobby:</strong> {profile.hobby}
            </p>
            <p className="mb-1">
              <strong>Favorite Color:</strong> {profile.favoriteColor}
            </p>
            <p className="mb-1">{profile.bio}</p>
            <div className="d-flex flex-column gap-2 mt-2">
              {profile.instagram && (
                <a
                  href={profile.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
              )}
              {profile.twitter && (
                <a
                  href={profile.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Twitter
                </a>
              )}
            </div>
          </div>
        )}
        {activeTab === "actions" && (
          <div className="text-start">
            <p>📷 Show QR Code</p>
            <p>✉️ Send Personal Story</p>
            <p>🎉 Share Favorite Moment</p>
          </div>
        )}
      </div>
    </div>
  );
}
