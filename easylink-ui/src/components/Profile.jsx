import React from "react";

export default function Profile() {
  const handleHoverIn = (e) => {
    e.currentTarget.style.backgroundColor = "#e9eff5";
    e.currentTarget.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.15)";
    e.currentTarget.style.transform = "translateY(-5px)";
  };

  const handleHoverOut = (e) => {
    e.currentTarget.style.backgroundColor = "#f4f6f9";
    e.currentTarget.style.boxShadow = "0 .125rem .25rem rgba(0,0,0,.075)";
    e.currentTarget.style.transform = "translateY(0)";
  };

  const cards = [
    {
      title: "💼 Business",
      text: "Share your professional profile, work-related info and business vibes.",
    },
    {
      title: "🧍 Personal",
      text: "Highlight your interests, hobbies, and personal vibe stories.",
    },
    {
      title: "🎯 Other",
      text: "Store and share everything else — events, projects, creative ideas.",
    },
  ];
  const cards2 = [
    {
      title: "❤️ My Vibes",
      text: "See the vibes you've already created!",
    },
  ];
  return (
    <div className="container py-5">
      <div className="text-center bg-light p-5 rounded shadow mb-5">
        <h2 className="mb-4">Welcome to your Vibe account!</h2>
        <p className="lead text-muted">
          This is your personal dashboard. Manage your interests, hobbies,
          groups, and communities — and share what matters with others through
          different types of Vibes.
        </p>
      </div>

      <div className="row text-center">
        {cards.map((card, index) => (
          <div className="col-md-4 mb-4" key={index}>
            <div
              className="rounded p-4 h-100 shadow-sm"
              style={{
                backgroundColor: "#f4f6f9",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
              onMouseEnter={handleHoverIn}
              onMouseLeave={handleHoverOut}
            >
              <h5 className="mb-2">{card.title}</h5>
              <p className="text-muted mb-0">{card.text}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-5">
        {cards2.map((card, index) => (
          <div
            key={index}
            className="mx-auto p-4 rounded shadow"
            style={{
              maxWidth: "400px",
              backgroundColor: "#fff8f0",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 .125rem .25rem rgba(0,0,0,.075)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#ffeedb";
              e.currentTarget.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.15)";
              e.currentTarget.style.transform = "translateY(-5px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#fff8f0";
              e.currentTarget.style.boxShadow = "0 .125rem .25rem rgba(0,0,0,.075)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <h5>{card.title}</h5>
            <p className="text-muted mb-0">{card.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
