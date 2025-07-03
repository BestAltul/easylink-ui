import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Header.css";

function Header() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); // после выхода — редиректим на главную
  };

  return (
    <header className="header">
      <div className="header__container">
        <Link
          to="/"
          className="logo"
          style={{
            display: "flex",               // Обеспечиваем, что картинка и текст идут в одну строку
            alignItems: "center",          // Выравнивание по центру
            textDecoration: "none",        // Нет подчёркивания
            width: "auto",                 // Только содержимое
            padding: 0,                    // Нет внутренних отступов
            margin: 0                      // Нет внешних отступов
          }}
        >
          <img
            src="/clearviewblue.png"
            alt="logo"
            style={{
              width: "36px",
              height: "36px",
              marginRight: "8px"
            }}
          />
          <span
            style={{
              color: "#007bff",
              fontWeight: "bold",
              fontSize: "2rem"
            }}
          >
            EasyLink
          </span>
        </Link>

        <nav className="nav">
          <Link to="/">Home</Link>
          {!isAuthenticated && <Link to="/signup">Sign Up</Link>}
          {!isAuthenticated && <Link to="/signin">Log In</Link>}
          {isAuthenticated && <Link to="/profile">Profile</Link>}
          <Link to="/about">About</Link>
          <Link to="/review">Review</Link>
          {isAuthenticated && (
            <button onClick={handleLogout} className="logout-btn">
              Log Out
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
