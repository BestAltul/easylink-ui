import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import "bootstrap/dist/css/bootstrap.min.css";
import VibeSearch from "../components/common/VibeSearch";

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();

  const handleClick = () => {
    if (isAuthenticated) {
      navigate("/profile");
    } else {
      navigate("/signup");
    }
  };

  return (
    <div className="container text-center py-5">
      {/* 🔍 Vibe Code Search */}
      <VibeSearch />

      {/* Heading and CTA */}
      <h1
        className="mb-3"
        style={{ fontWeight: "700", fontSize: "3rem", animation: "fadeIn 1s" }}
      >
        {t("home.welcome")}
      </h1>
      <p className="lead mb-4" style={{ animation: "fadeIn 1.5s" }}>
        {t("home.subtitle")}
      </p>
      <p className="text-muted" style={{ animation: "fadeIn 2s" }}>
        {t("home.curious")}{" "}
        <Link to="/about" className="text-primary">
          {t("home.learn_more")}
        </Link>
      </p>
      <button
        onClick={handleClick}
        className="btn btn-primary px-5 py-3 mt-4"
        style={{ fontSize: "1.25rem", animation: "fadeIn 2.5s" }}
      >
        {t("home.get_started")}
      </button>

      {/* Features Section */}
      <div
        className="row mt-5 justify-content-center"
        style={{ animation: "fadeIn 2s" }}
      >
        <h2 className="mb-5 text-center">{t("home.why")}</h2>

        {[
          {
            emoji: "🔒",
            title: t("home.secure_title"),
            text: t("home.secure_text"),
          },
          {
            emoji: "⚡",
            title: t("home.fast_title"),
            text: t("home.fast_text"),
          },
          {
            emoji: "😊",
            title: t("home.friendly_title"),
            text: t("home.friendly_text"),
          },
        ].map((item, idx) => (
          <div key={idx} className="col-md-4 mb-4 d-flex justify-content-center">
            <div
              className="card p-4 shadow-sm"
              style={{
                width: "100%",
                maxWidth: "400px",
                minHeight: "220px",
                transition: "transform 0.3s, box-shadow 0.3s",
              }}
            >
              <div className="card-body d-flex flex-column align-items-center text-center">
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
                  {item.emoji}
                </div>
                <h5 className="card-title mb-2">{item.title}</h5>
                <p className="card-text" style={{ fontSize: "0.95rem", color: "#555" }}>
                  {item.text}
                </p>
              </div>
            </div>
          </div>
        ))}

        <style>
          {`
            .card:hover {
              transform: scale(1.03);
              box-shadow: 0 6px 20px rgba(0,0,0,0.15);
            }
          `}
        </style>
      </div>

      {/* FadeIn CSS */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}
