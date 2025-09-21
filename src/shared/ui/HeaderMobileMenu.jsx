import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/shared/ui/LanguageSwitcher";
import "./HeaderMobileMenu.css";

function HeaderMobileMenu({
  isOpen,
  onClose,
  isAuthenticated,
  handleLogout,
  trackEvent,
}) {
  const { t } = useTranslation("header"); // ✅ берём строки из ns "header"

  if (!isOpen) return null;

  return (
    <div
      className="mobile-menu-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile menu"
    >
      <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
        <div className="mobile-menu-header">
          <Link to="/" className="logo" onClick={onClose} aria-label="YMK home">
            <img src="/clearviewblue.png" alt="YMK logo" />
            <span>YMK</span>
          </Link>
          <button className="close-btn" onClick={onClose} aria-label="Close menu">
            ✕
          </button>
        </div>

        <nav className="mobile-nav">
          <Link
            to="/"
            className="mobile-menu-link"
            onClick={() => {
              trackEvent("Mobile Home Clicked");
              onClose();
            }}
          >
            {t("home")}
          </Link>

          {!isAuthenticated && (
            <Link
              to="/signup"
              className="mobile-menu-link"
              onClick={() => {
                trackEvent("Mobile Sign Up Clicked");
                onClose();
              }}
            >
              {t("sign_up")}
            </Link>
          )}

          {!isAuthenticated && (
            <Link
              to="/signin"
              className="mobile-menu-link"
              onClick={() => {
                trackEvent("Mobile Sign In Clicked");
                onClose();
              }}
            >
              {t("log_in")}
            </Link>
          )}

          {isAuthenticated && (
            <Link
              to="/profile"
              className="mobile-menu-link"
              onClick={() => {
                trackEvent("Mobile Profile Clicked");
                onClose();
              }}
            >
              {t("profile")}
            </Link>
          )}

          <Link
            to="/about"
            className="mobile-menu-link"
            onClick={() => {
              trackEvent("Mobile About Clicked");
              onClose();
            }}
          >
            {t("about")}
          </Link>

          <Link
            to="/review"
            className="mobile-menu-link"
            onClick={() => {
              trackEvent("Mobile Review Clicked");
              onClose();
            }}
          >
            {t("review")}
          </Link>

          {isAuthenticated && (
            <button
              className="mobile-menu-link logout-btn"
              onClick={() => {
                handleLogout();
                onClose();
              }}
            >
              {t("log_out")}
            </button>
          )}
        </nav>

        <div className="mobile-menu-footer">
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  );
}

export default HeaderMobileMenu;
