import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center" }}>
      <h1>EasyLink Auth</h1>
      <button
        onClick={() => navigate("/signup")}
        style={{ padding: "1rem", margin: "1rem", width: "100%" }}
      >
        Sign Up
      </button>
      <button
        onClick={() => navigate("/signin")}
        style={{ padding: "1rem", margin: "1rem", width: "100%" }}
      >
        Sign In
      </button>
    </div>
  );
}
