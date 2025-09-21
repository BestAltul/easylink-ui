import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import "bootstrap/dist/css/bootstrap.min.css";
import VibeSearch from "../components/common/VibeSearch";
import { trackEvent } from "@/services/amplitude";
import "./styles/Home.css";

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation("home");

  const handleClick = () => {
    trackEvent("Clicked Get Started", {
      isAuthenticated,
      destination: isAuthenticated ? "/profile" : "/signup",
    });
    navigate(isAuthenticated ? "/profile" : "/signup");
  };

  return (
    <div className="container text-center py-5">
      {/* Heading and CTA */}
      <h1
        className="mb-3"
        style={{ fontWeight: "700", fontSize: "3rem", animation: "fadeIn 1s" }}
      >
        {t("welcome")}
      </h1>
      <p className="lead mb-4" style={{ animation: "fadeIn 1.5s" }}>
        {t("subtitle")}
      </p>
      <p className="text-muted" style={{ animation: "fadeIn 2s" }}>
        {t("curious")}{" "}
        <Link to="/about" className="text-primary">
          {t("learn_more")}
        </Link>
      </p>
      <button
        onClick={handleClick}
        className="btn btn-primary px-5 py-3 mt-4"
        style={{ fontSize: "1.25rem", animation: "fadeIn 2.5s" }}
        aria-label={t("get_started")}
      >
        {t("get_started")}
      </button>

      {/* Features Section */}
      <div
        className="row mt-5 justify-content-center"
        style={{ animation: "fadeIn 2s" }}
      >
        {/* 🔍 Vibe Code Search */}
        <div className="d-flex justify-content-center my-4">
          <div style={{ width: "100%", maxWidth: "420px" }}>
            <VibeSearch />
          </div>
        </div>

        {/*
        <h2 className="mb-5 text-center">{t("why")}</h2>
        {[{
            emoji: "🔒",
            title: t("secure_title"),
            text: t("secure_text"),
          },{
            emoji: "⚡",
            title: t("fast_title"),
            text: t("fast_text"),
          },{
            emoji: "😊",
            title: t("friendly_title"),
            text: t("friendly_text"),
          },
        ].map((item, idx) => (...))} */}
      </div>
    </div>
  );
}
