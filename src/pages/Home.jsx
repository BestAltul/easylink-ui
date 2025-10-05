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
    <main className="container text-center py-5 home" role="main">
      {/* Heading and CTA */}
      <h1 className="home__title fade-in-1">
        {t("welcome")}
      </h1>

      <p className="lead home__subtitle fade-in-2">
        {t("subtitle")}
      </p>

      <p className="text-muted fade-in-3">
        {t("curious")}{" "}
        <Link to="/about" className="text-primary home__learn-link">
          {t("learn_more")}
        </Link>
      </p>

      <button
        onClick={handleClick}
        className="btn btn-primary px-5 py-3 mt-4 home__cta fade-in-4"
        aria-label={t("get_started")}
      >
        {t("get_started")}
      </button>

      {/* Vibe Code Search */}
      <section className="row mt-5 justify-content-center fade-in-3" aria-label={t("search_section", "Vibe search")}>
        <div className="d-flex justify-content-center my-4 home__search">
          <div className="home__search-inner">
            <VibeSearch />
          </div>
        </div>
      </section>
    </main>
  );
}


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
