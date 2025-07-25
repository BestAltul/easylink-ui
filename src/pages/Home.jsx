import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();

  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleClick = () => {
    if (isAuthenticated) {
      navigate("/profile");
    } else {
      navigate("/signup");
    }
  };

  const handleSearch = async () => {
    setError("");
    if (!/^\d{4,5}$/.test(code)) {
      setError("Please enter a valid 4–5 digit code");
      return;
    }

    try {
      const res = await axios.get(`/api/v3/vibes/by-code/${code}`);
      navigate(`/view/${res.data.id}`);
    } catch (err) {
      setError("Vibe not found");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="container text-center py-5">
      {/* 🔍 Vibe Code Search */}
      <div
        className="d-flex justify-content-end align-items-center mb-4"
        style={{ gap: 12 }}
      >
        <input
          type="text"
          className="form-control"
          placeholder="Enter 4–5 digit Vibe code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ maxWidth: 240 }}
          autoFocus
        />
        <button className="btn btn-primary" onClick={handleSearch}>
          Search
        </button>
      </div>
      {error && <div className="text-danger mb-4">{error}</div>}

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
          <div
            key={idx}
            className="col-md-4 mb-4 d-flex justify-content-center"
          >
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
                <p
                  className="card-text"
                  style={{ fontSize: "0.95rem", color: "#555" }}
                >
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
