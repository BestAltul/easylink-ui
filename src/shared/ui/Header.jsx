import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/shared/ui/LanguageSwitcher";
import { useEarlyAccess } from "@/components/common/hooks/useEarlyAccess";
import { useEarlyAccessCheckable } from "@/components/common/hooks/useEarlyAccessCheckable";
import { trackEvent } from "@/services/amplitude";
import "./Header.css";
import HeaderMobileMenu from "./HeaderMobileMenu";

function Header() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [menuOpen, setMenuOpen] = useState(false);

  const {
    requestEarlyAccess,
    loading: loadingSubscribe,
    subscribed: subscribedAfterRequest,
    setSubscribed: setSubscribedAfterRequest,
  } = useEarlyAccess();

  const {
    checkEarlyAccess,
    subscribed: subscribedStatus,
    setSubscribed: setSubscribedStatus,
  } = useEarlyAccessCheckable();

  useEffect(() => {
    if (isAuthenticated) {
      checkEarlyAccess();
    }
  }, [isAuthenticated]);

  const subscribed = subscribedAfterRequest || subscribedStatus;

  const handleLogout = () => {
    trackEvent("Logout Clicked", { page: "header" });
    logout();
    setSubscribedAfterRequest(false);
    setSubscribedStatus(false);
    navigate("/");
  };

  return (
    <>
      <header className="header">
        <div className="header__container">
          <div className="header__top">
            <Link to="/" className="logo">
              <img src="/clearviewblue.png" alt="logo" />
              <span>YMK</span>
            </Link>

            <div className={`early-access-bubble ${subscribed ? "subscribed-green" : ""}`}>
              <div className="early-access-text">
                {subscribed ? "✅ Subscribed!" : t("header.lifetime_offer")}
              </div>

              {!subscribed && (
                <button
                  onClick={() =>
                    isAuthenticated ? requestEarlyAccess() : navigate("/signin")
                  }
                  className="early-subscribe-highlighted"
                  disabled={loadingSubscribe}
                >
                  {loadingSubscribe ? "Loading..." : t("header.early_subscribtion")}
                </button>
              )}
            </div>

            <nav className="nav">
              <Link to="/" onClick={() => trackEvent("Header Home Clicked")}>
                {t("header.home")}
              </Link>

              {!isAuthenticated && (
                <Link to="/signup" onClick={() => trackEvent("Header Sign Up Clicked")}>
                  {t("header.sign_up")}
                </Link>
              )}

              {!isAuthenticated && (
                <Link to="/signin" onClick={() => trackEvent("Header Sign In Clicked")}>
                  {t("header.log_in")}
                </Link>
              )}

              {isAuthenticated && (
                <Link to="/profile" onClick={() => trackEvent("Header Profile Clicked")}>
                  {t("header.profile")}
                </Link>
              )}

              <Link to="/about" onClick={() => trackEvent("Header About Clicked")}>
                {t("header.about")}
              </Link>

              <Link to="/review" onClick={() => trackEvent("Header Review Clicked")}>
                {t("header.review")}
              </Link>

              {isAuthenticated && (
                <Link
                  to="/"
                  onClick={(e) => {
                    e.preventDefault(); 
                    handleLogout();
                  }}
                >
                  {t("header.log_out")}
                </Link>
              )}

              <LanguageSwitcher />
            </nav>

            <button
              className="burger-btn"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              ☰
            </button>
          </div>


        </div>
      </header>

      <HeaderMobileMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        isAuthenticated={isAuthenticated}
        t={t}
        handleLogout={handleLogout}
        trackEvent={trackEvent}
      />
    </>
  );
}

export default Header;
