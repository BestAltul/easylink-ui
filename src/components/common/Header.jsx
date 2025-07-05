import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import "./Header.css";
import LanguageSwitcher from "./LanguageSwitcher";

function Header() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="header">
      <div className="header__container">
        <Link to="/" className="logo" style={{
          display: "flex",
          alignItems: "center",
          textDecoration: "none",
          width: "auto",
          padding: 0,
          margin: 0
        }}>
          <img
            src="/clearviewblue.png"
            alt="logo"
            style={{ width: "36px", height: "36px", marginRight: "8px" }}
          />
          <span style={{ color: "#007bff", fontWeight: "bold", fontSize: "2rem" }}>
            EasyLink
          </span>
        </Link>

        <nav className="nav" style={{ display: "flex", alignItems: "center", gap: 16 }}>
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
