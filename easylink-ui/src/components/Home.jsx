import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../js/AuthContext";
import { Link } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleClick = () => {
    if (isAuthenticated) {
      navigate("/profile");
    } else {
      navigate("/signup");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>Welcome to EasyLink</h1>
      <p>Your smart way to manage secure login and identity.</p>
      <p className="text-muted">
        Want to know how EasyLink works? <Link to="/about">Read more here</Link>
      </p>
      <button
        onClick={handleClick}
        className="btn btn-primary"
        style={{ padding: "1rem 2rem", marginTop: "1rem", fontSize: "1.2rem" }}
      >
        Get Started
      </button>
    </div>
  );
}
