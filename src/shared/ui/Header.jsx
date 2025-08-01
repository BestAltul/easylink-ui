import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import "./Header.css";
import LanguageSwitcher from "./LanguageSwitcher";
import { useEarlyAccess } from "../../components/common/hooks/useEarlyAccess";
import { useEarlyAccessCheckable } from "../../components/common/hooks/useEarlyAccessCheckable";
import { trackEvent } from '@/services/amplitude';

function Header() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    requestEarlyAccess,
    loading: loadingSubscribe,
    error: errorSubscribe,
    subscribed: subscribedAfterRequest,
    setSubscribed: setSubscribedAfterRequest,
  } = useEarlyAccess();

  const {
    checkEarlyAccess,
    loading: loadingCheck,
    error: errorCheck,
    subscribed: subscribedStatus,
    setSubscribed: setSubscribedStatus,
  } = useEarlyAccessCheckable();

  useEffect(() => {
    if (isAuthenticated) {
      checkEarlyAccess();
    }
  }, [isAuthenticated]);

  const subscribed = subscribedAfterRequest || subscribedStatus;

  console.log("My status: ", subscribed);

  const handleLogout = () => {
    trackEvent('Logout Clicked', { page: 'header' });
    logout();
    setSubscribedAfterRequest(false);
    setSubscribedStatus(false);
    navigate("/");
  };

  return (
    <header className="header">
      <div className="header__container">
        {/* LOGO */}
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
            YMK
          </span>
        </Link>

        <div
          className={`early-access-bubble ${
            subscribed ? "subscribed-green" : ""
          }`}
        >
          <div className="early-access-text">
            {subscribed ? "✅ Subscribed!" : t("header.lifetime_offer")}
          </div>

          {subscribed ? (
            <div className="subscribed-message"></div>
          ) : (
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  navigate("/signin");
                } else {
                  requestEarlyAccess();
                }
              }}
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
          <Link
            to="/"
            onClick={() => trackEvent("Header Home Clicked")}
          >
            {t("header.home")}
          </Link>

          {!isAuthenticated && (
            <Link
              to="/signup"
              onClick={() => trackEvent("Header Sign Up Clicked")}
            >
              {t("header.sign_up")}
            </Link>
          )}

          {!isAuthenticated && (
            <Link
              to="/signin"
              onClick={() => trackEvent("Header Sign In Clicked")}
            >
              {t("header.log_in")}
            </Link>
          )}

          {isAuthenticated && (
            <Link
              to="/profile"
              onClick={() => trackEvent("Header Profile Clicked")}
            >
              {t("header.profile")}
            </Link>
          )}

          <Link
            to="/about"
            onClick={() => trackEvent("Header About Clicked")}
          >
            {t("header.about")}
          </Link>

          <Link
            to="/review"
            onClick={() => trackEvent("Header Review Clicked")}
          >
            {t("header.review")}
          </Link>

          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="logout-btn"
            >
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
