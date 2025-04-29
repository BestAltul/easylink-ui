import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../js/AuthContext";
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
        <Link to="/" className="logo">
          <img
            src="/clearviewblue.png"
            alt="logo"
            style={{
              width: "36px",
              height: "36px",
              marginRight: "8px",
              verticalAlign: "bottom",
            }}
          />
          EasyLink
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
