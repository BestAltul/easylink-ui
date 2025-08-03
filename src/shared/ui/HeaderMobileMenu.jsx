import React from "react";
import { Link } from "react-router-dom";
import LanguageSwitcher from "@/shared/ui/LanguageSwitcher";
import "./HeaderMobileMenu.css";

function HeaderMobileMenu({
  isOpen,
  onClose,
  isAuthenticated,
  t,
  handleLogout,
  trackEvent,
}) {
  if (!isOpen) return null;

  return (
    <div className="mobile-menu-overlay" onClick={onClose}>
      <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
        <div className="mobile-menu-header">
          <Link to="/" className="logo" onClick={onClose}>
            <img src="/clearviewblue.png" alt="logo" />
            <span>YMK</span>
          </Link>
          <button className="close-btn" onClick={onClose}>
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
            {t("header.home")}
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
              {t("header.sign_up")}
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
              {t("header.log_in")}
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
              {t("header.profile")}
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
            {t("header.about")}
          </Link>

          <Link
            to="/review"
            className="mobile-menu-link"
            onClick={() => {
              trackEvent("Mobile Review Clicked");
              onClose();
            }}
          >
            {t("header.review")}
          </Link>

          {isAuthenticated && (
            <button
              className="mobile-menu-link logout-btn"
              onClick={() => {
                handleLogout();
                onClose();
              }}
            >
              {t("header.log_out")}
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
