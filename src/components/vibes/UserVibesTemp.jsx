import React from "react";
import { useNavigate } from "react-router-dom";

const vibeOptions = [
  {
    icon: "💼",
    title: "Business",
    text: "Share your professional profile, work-related info and business vibes.",
    path: "/business-vibes",
    bg: "#f8f3f1",
    shadow: "0 4px 24px rgba(200, 120, 20, 0.06)",
  },
  {
    icon: "💖",
    title: "Personal",
    text: "Highlight your interests, hobbies, and personal vibe stories.",
    path: "/personal-vibes",
    bg: "#f4f3fa",
    shadow: "0 4px 24px rgba(160, 80, 180, 0.07)",
  },
  {
    icon: "🎯",
    title: "Other",
    text: "Store and share everything else — events, projects, creative ideas.",
    path: "/conference-vibes",
    bg: "#f2f8fa",
    shadow: "0 4px 24px rgba(80, 160, 200, 0.07)",
  },
];

export default function MyVibes() {
  const navigate = useNavigate();

  return (
    <div className="container py-5 d-flex flex-column align-items-center">
      {/* Style block for keyframes and hover/active tweaks */}
      <style>
        {`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(25px);}
          to   { opacity: 1; transform: translateY(0);}
        }
        .vibe-card {
          animation: fadeSlideUp 0.5s cubic-bezier(.18,.6,.32,1.15);
          transition: box-shadow 0.18s, transform 0.18s, background 0.18s;
          will-change: box-shadow, transform;
        }
        .vibe-card:hover, .vibe-card:active {
          box-shadow: 0 10px 28px 0 rgba(60,60,60,0.14), 0 1.5px 6px 0 rgba(60,60,60,0.10);
          transform: translateY(-6px) scale(1.025);
          background: #fff !important;
        }
        @media (max-width: 700px) {
          .vibe-row {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 1.3rem !important;
          }
        }
      `}
      </style>
      <h2 className="mb-4 fw-bold" style={{ letterSpacing: ".02em" }}>My Vibes</h2>
      <div className="d-flex vibe-row gap-4 justify-content-center w-100" style={{ maxWidth: 980 }}>
        {vibeOptions.map((opt, idx) => (
          <div
            key={opt.path}
            className="vibe-card rounded-4 p-4 text-center shadow-sm"
            tabIndex={0}
            style={{
              background: opt.bg,
              boxShadow: opt.shadow,
              minWidth: 270,
              maxWidth: 320,
              cursor: "pointer",
              outline: "none",
              userSelect: "none"
            }}
            onClick={() => navigate(opt.path)}
            onKeyDown={e => (e.key === "Enter" || e.key === " ") && navigate(opt.path)}
            aria-label={opt.title}
          >
            <div style={{ fontSize: 38, marginBottom: 10 }}>{opt.icon}</div>
            <h5 className="fw-semibold mb-2">{opt.title}</h5>
            <p className="text-muted mb-0" style={{ fontSize: 15, lineHeight: "1.45" }}>{opt.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
