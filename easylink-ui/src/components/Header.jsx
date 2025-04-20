import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

function Header() {
  return (
    <header className="header">
      <div className="header__container">
        <Link to="/" className="logo">EasyLink</Link>
        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/signup">Sign Up</Link>
          <Link to="/signin">Sign In</Link>
          <Link to="/about">About</Link>
          <Link to="/review">Review</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
