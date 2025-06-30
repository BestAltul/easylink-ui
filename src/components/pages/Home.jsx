import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
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
    <div className="container text-center py-5">
      {/* Главный заголовок */}
      <h1
        className="mb-3"
        style={{ fontWeight: "700", fontSize: "3rem", animation: "fadeIn 1s" }}
      >
        Welcome to EasyLink
      </h1>
      <p className="lead mb-4" style={{ animation: "fadeIn 1.5s" }}>
        Your modern solution for secure and effortless identity management.
      </p>
      <p className="text-muted" style={{ animation: "fadeIn 2s" }}>
        Curious how EasyLink empowers your digital life?{" "}
        <Link to="/about" className="text-primary">
          Learn more
        </Link>
      </p>
      <button
        onClick={handleClick}
        className="btn btn-primary px-5 py-3 mt-4"
        style={{ fontSize: "1.25rem", animation: "fadeIn 2.5s" }}
      >
        Get Started
      </button>

      {/* Features Section */}
      <div
        className="row mt-5 justify-content-center"
        style={{ animation: "fadeIn 2s" }}
      >
        <h2 className="mb-5 text-center">Why EasyLink?</h2>

        {[
          {
            emoji: "🔒",
            title: "Secure by Design",
            text: "Your data stays protected with multi-layer authentication and encryption.",
          },
          {
            emoji: "⚡",
            title: "Lightning Fast Access",
            text: "Login in seconds, without remembering complex passwords or codes.",
          },
          {
            emoji: "😊",
            title: "User Friendly",
            text: "Designed for everyone — simple, intuitive, and beautifully easy to use.",
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="col-md-4 mb-4 d-flex justify-content-center"
          >
            <div
              className="card p-4 shadow-sm"
              style={{
                width: "100%",
                maxWidth: "400px",
                minHeight: "220px",
                transition: "transform 0.3s, box-shadow 0.3s",
              }}
            >
              <div className="card-body d-flex flex-column align-items-center text-center">
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
                  {item.emoji}
                </div>
                <h5 className="card-title mb-2">{item.title}</h5>
                <p
                  className="card-text"
                  style={{ fontSize: "0.95rem", color: "#555" }}
                >
                  {item.text}
                </p>
              </div>
            </div>
          </div>
        ))}

        <style>
          {`
            .card:hover {
              transform: scale(1.03);
              box-shadow: 0 6px 20px rgba(0,0,0,0.15);
            }
          `}
        </style>
      </div>

      {/* FadeIn CSS */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}
