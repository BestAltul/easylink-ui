import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import "./Header.css";
import LanguageSwitcher from "./LanguageSwitcher";
import { useEarlyAccess } from "../common/hooks/useEarlyAccess";
import { useEarlyAccessCheckable } from "../common/hooks/useEarlyAccessCheckable";

function Header() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    requestEarlyAccess,
    loading: loadingSubscribe,
    error: errorSubscribe,
    subscribed: subscribedAfterRequest,
  } = useEarlyAccess();

  const {
    checkEarlyAccess,
    loading: loadingCheck,
    error: errorCheck,
    subscribed: subscribedStatus,
  } = useEarlyAccessCheckable();

  useEffect(() => {
    if (isAuthenticated) {
      checkEarlyAccess();
    }
  }, [isAuthenticated]);

  const subscribed = subscribedAfterRequest || subscribedStatus;

  console.log("My status: ", subscribed);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="header">
      <div className="header__container">
        {/* ЛОГОТИП */}
        <Link
          to="/"
          className="logo"
          style={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            width: "auto",
            padding: 0,
            margin: 0,
          }}
        >
          <img
            src="/clearviewblue.png"
            alt="logo"
            style={{ width: "36px", height: "36px", marginRight: "8px" }}
          />
          <span
            style={{ color: "#007bff", fontWeight: "bold", fontSize: "2rem" }}
          >
            EasyLink
          </span>
        </Link>

        <div className="early-access-bubble">
          <div className="early-access-text">
            {subscribed
              ? "✅ Subscribed to early access!"
              : t("header.lifetime_offer")}
          </div>

          {subscribed ? (
            <div className="subscribed-message">🎉 Thank you!</div>
          ) : (
            <button
              onClick={requestEarlyAccess}
              className="early-subscribe-highlighted"
              disabled={loadingSubscribe}
            >
              {loadingSubscribe ? "Loading..." : t("header.early_subscribtion")}
            </button>
          )}
        </div>

        <nav
          className="nav"
          style={{ display: "flex", alignItems: "center", gap: 16 }}
        >
          <Link to="/">{t("header.home")}</Link>
          {!isAuthenticated && <Link to="/signup">{t("header.sign_up")}</Link>}
          {!isAuthenticated && <Link to="/signin">{t("header.log_in")}</Link>}
          {isAuthenticated && <Link to="/profile">{t("header.profile")}</Link>}
          <Link to="/about">{t("header.about")}</Link>
          <Link to="/review">{t("header.review")}</Link>
          {isAuthenticated && (
            <button onClick={handleLogout} className="logout-btn">
              {t("header.log_out")}
            </button>
          )}
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
}

export default Header;
