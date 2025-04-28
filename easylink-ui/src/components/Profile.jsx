import React from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();

  const handleHoverIn = (e) => {
    e.currentTarget.style.backgroundColor = "#f9fafb";
    e.currentTarget.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.15)";
    e.currentTarget.style.transform = "translateY(-8px)";
    e.currentTarget.style.opacity = "1";
  };

  const handleHoverOut = (e) => {
    e.currentTarget.style.backgroundColor = "#f4f6f9";
    e.currentTarget.style.boxShadow = "0 .125rem .25rem rgba(0,0,0,.075)";
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.opacity = "0.9";
  };

  const vibeOptions = [
    {
      title: "💼 Business",
      text: "Share your professional profile, work-related info and business vibes.",
      type: "business",
    },
    {
      title: "🧍 Personal",
      text: "Highlight your interests, hobbies, and personal vibe stories.",
      type: "personal",
    },
    {
      title: "🎯 Other",
      text: "Store and share everything else — events, projects, creative ideas.",
      type: "other",
    },
  ];

  const profileCards = [
    {
      title: "❤️ My Vibes",
      text: "See the vibes you've already created!",
      background: "#fff8f0",
      hoverBackground: "#ffeedb",
      buttonText: "View My Vibes",
      buttonColor: "danger",
      onClick: () => navigate("/my-vibes"),
    },
    {
      title: "💙 Create New Vibe",
      text: "Add a new personal, business, or event Vibe to your account.",
      background: "#e3f2fd",
      hoverBackground: "#d0e5f7",
      buttonText: "Create Vibe",
      buttonColor: "primary",
      onClick: () => navigate("/create-vibe"),
    },
  ];

  return (
    <div className="container py-5">
      <div className="text-center bg-light p-5 rounded shadow mb-5">
        <h2 className="mb-4">Welcome to your Vibe account!</h2>
        <p className="lead text-muted">
          This is your personal dashboard. Manage your interests, hobbies, groups, and communities — and share what matters with others through different types of Vibes.
        </p>
      </div>

      <div className="row text-center mb-5">
        {vibeOptions.map((card, index) => (
          <div className="col-md-4 mb-4" key={index}>
            <div
              className="rounded p-4 h-100 shadow-sm"
              style={{
                backgroundColor: "#f4f6f9",
                transition: "all 0.3s ease",
                cursor: "pointer",
                opacity: "0.9",
              }}
              onClick={() => {
                if (card.type === "business") navigate("/business-vibes");
                if (card.type === "personal") navigate("/personal-vibes");
                if (card.type === "other") navigate("/conference-vibes");
              }}
              onMouseEnter={handleHoverIn}
              onMouseLeave={handleHoverOut}
            >
              <h5 className="mb-2" style={{ fontSize: "1.2rem" }}>{card.title}</h5>
              <p className="text-muted mb-0" style={{ fontSize: "0.95rem" }}>{card.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        {profileCards.map((card, index) => (
          <div
            key={index}
            className="mx-auto p-4 rounded shadow mb-4"
            style={{
              maxWidth: "400px",
              backgroundColor: card.background,
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onClick={card.onClick}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = card.hoverBackground;
              e.currentTarget.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.15)";
              e.currentTarget.style.transform = "translateY(-5px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = card.background;
              e.currentTarget.style.boxShadow = "0 .125rem .25rem rgba(0,0,0,.075)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <h5 style={{ fontSize: "1.2rem" }}>{card.title}</h5>
            <p className="text-muted mb-0">{card.text}</p>
            <button className={`btn btn-${card.buttonColor} mt-3 px-4`}>
              {card.buttonText}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
